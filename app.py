import os
import csv
import secrets
import requests

from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS, cross_origin
from sqlalchemy import create_engine, func, and_
from sqlalchemy.engine.reflection import Inspector
from werkzeug.security import generate_password_hash, check_password_hash

from sqlalchemy.dialects.postgresql.base import PGDialect

PGDialect._get_server_version_info = lambda *args: (9, 2)

from models import (
    Users,
    FamilyMember,
    Suburb,
    Suburb_Shp,
    SSReminder,
    CancerStatistics,
    CancerIncidence,
)
from database import db

load_dotenv()

#######################################################

app = Flask(__name__, static_folder="frontend/build", static_url_path="/")
CORS(app, supports_credentials=True, allow_headers="*", origins="*")
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
owapi_base_url = (
    "https://api.openweathermap.org/data/3.0/onecall?lat=<<lat>>&lon=<<lon>>&exclude=hourly,daily,minutely,alerts&units=metric&appid="
    + os.environ.get("OPEN_WEATHER_API_KEY")
)
db.init_app(app)


@app.before_request
def debug_request():
    print(f"Headers: {request.headers}")


def create_app_folder():
    if not os.path.exists("app"):
        os.makedirs("app")


def create_apireq_csv():
    file_path = os.path.join("app", "api_requests.csv")
    if not os.path.exists(file_path):
        with open(file_path, mode="w", newline="") as csv_file:
            writer = csv.writer(csv_file)
            # Write the headers
            writer.writerow(["api", "num_requests"])
            # Write the initial row
            writer.writerow(["owapi", 0])
        # print(f"File 'api_requests.csv' created with headers and initial row.")
    else:
        # print(f"File 'api_requests.csv' already exists.")
        pass


#######################################################
# Basic Routes (Placeholders )


def display_file_structure(folder_path, indent_level=0):
    """Displays the file structure of a given folder in a stylized format."""
    try:
        # Get a sorted list of items in the directory
        items = sorted(os.listdir(folder_path))
    except FileNotFoundError:
        print("Error: Folder not found.")
        return
    except PermissionError:
        print("Error: Permission denied.")
        return

    for item in items:
        item_path = os.path.join(folder_path, item)
        # Add indentation for nested directories/files
        indent = " " * (indent_level * 4)
        if os.path.isdir(item_path):
            # Display directory name in brackets
            print(f"{indent}[{item}]")
            # Recursively display the contents of the directory
            display_file_structure(item_path, indent_level + 1)
        else:
            # Display file name
            print(f"{indent}{item}")


@app.route("/", methods=["GET"])
def serve_react_app():
    print("I am here, ", os.getcwd())
    for item in os.listdir(os.getcwd()):
        item_path = os.path.join(os.getcwd(), item)
        print(f"{item}")
    return send_from_directory(app.static_folder, "index.html")


@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not found"}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500


########################################################
# Middlewares


def check_header():
    # Check if the 'Authorization' header is present
    if "Authorization" not in request.headers:
        return jsonify({"error": "Missing Authorization header"}), 401

    if "Access-ID" not in request.headers:
        return jsonify({"error": "Missing Access-ID header"}), 401

    authorization = request.headers.get("Authorization")
    access_id = int(request.headers.get("Access-ID"))

    user = Users.query.filter_by(users_id=access_id).first()
    if not user:
        return jsonify({"error": "Invalid Access ID"}), 401

    if user.users_access_token != authorization:
        return jsonify({"error": "Invalid Authorization"}), 401

    return None


# Apply the middleware to specific routes


@app.before_request
def protect_route():
    # Only apply the middleware to specific routes
    # List the endpoints where you want to apply the middleware
    if request.endpoint in ["logout"]:
        return check_header()


#########################################################
# USERS, Login, Register, Logout


def login_user(user):
    try:
        access_token = secrets.token_hex(32)
        Users.query.filter_by(users_id=user.users_id).update(
            {"users_access_token": access_token}
        )
        db.session.commit()
        return access_token
    except:
        return None


def logout_user(access_id, access_token):
    try:
        if not access_id or not access_token:
            return False
        user = Users.query.filter_by(users_id=access_id).first()

        if not user:
            return False

        if user.users_access_token != access_token:
            return False

        Users.query.filter_by(users_id=access_id).update({"users_access_token": None})
        db.session.commit()
        return True
    except:
        return False


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("users_email")  # Use email to match users_email
    password = data.get("users_password")

    user = Users.query.filter_by(users_email=email).first()
    if user and check_password_hash(user.users_password, password):
        access_token = login_user(user)
        return (
            jsonify(
                {
                    "message": "Login successful",
                    "access_token": access_token,
                    "access_id": "{}".format(user.users_id),
                }
            ),
            200,
        )
    else:
        return jsonify({"error": "Invalid credentials"}), 401


@app.route("/logout", methods=["GET"])
def logout():
    access_id = request.args.get("access_id", type=int)
    access_token = request.args.get("access_token", type=str)
    if logout_user(access_id, access_token):
        return jsonify({"message": "Logged out"}), 200
    else:
        return jsonify({"error": "Unable to logout"}), 401


def is_valid_password(password):
    """Checks basic password requirements"""
    if len(password) < 8:  # Example: Minimum 8 characters
        return False
    # You can add more checks: uppercase, lowercase, numbers, symbols, etc.
    return True


@app.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()

    try:

        if Users.query.filter_by(users_email=data.get("users_email")).first():
            return jsonify({"error": "Email already exists"}), 400

        if not is_valid_password(data.get("users_password")):
            return jsonify({"error": "Password not strong enough"}), 400

        hashed_password = generate_password_hash(
            data.get("users_password"), method="pbkdf2:sha256"
        )

        # Correctly referencing the 'suburb_name' attribute in the Suburb model
        suburb = Suburb.query.filter(
            and_(
                func.lower(Suburb.suburb_name) == data.get("suburb_name").lower(),
                Suburb.suburb_postcode == data.get("suburb_postcode"),
            )
        ).first()

        if suburb is None:
            # Creating a new Suburb instance with the correct attribute
            suburb = Suburb(
                suburb_name=data.get("suburb_name"),
                suburb_postcode=data.get("suburb_postcode"),
            )
            db.session.add(suburb)
            db.session.commit()

        new_user = Users(
            users_name=data.get("users_name"),
            users_email=data.get("users_email"),
            users_password=hashed_password,
            users_age=data.get("users_age"),
            users_skin_type=data.get("users_skin_type", 2),
            users_gender=data.get("users_gender", "X"),
            users_access_token=None,
            suburb_id=suburb.suburb_id,
        )

        db.session.add(new_user)
        db.session.commit()

        # Get updated user for getting the autogenerated ID
        new_user = Users.query.filter_by(users_email=data.get("users_email")).first()

        family_members = data.get("users_family_members")
        if family_members and len(family_members) > 0:
            for fm_idx in range(len(family_members)):
                data_fm = family_members[fm_idx]
                new_family_member = FamilyMember(
                    fm_name=data_fm.get("fm_name"),
                    fm_gender=data_fm.get("fm_gender"),
                    fm_age=data_fm.get("fm_age"),
                    fm_skin_type=data_fm.get("fm_skin_type"),
                    users_id=new_user.users_id,
                )
                db.session.add(new_family_member)
                db.session.commit()

        return jsonify(new_user.to_dict()), 201

    except Exception as e:
        import traceback

        traceback.print_exc()  # Print the full stack trace for debugging
        return jsonify({"error": "Unexpected registration error"}), 500


@app.route("/users/<int:users_id>", methods=["GET", "PUT", "DELETE"])
def manage_user(users_id):
    user = Users.query.get_or_404(users_id)

    if request.method == "GET":
        return jsonify(user.to_dict())

    elif request.method == "PUT":
        data = request.get_json()
        for key, value in data.items():
            setattr(user, key, value)  # Update attributes
        db.session.commit()
        return jsonify(user.to_dict())

    elif request.method == "DELETE":
        db.session.delete(user)
        db.session.commit()
        return "", 204  # Return empty response, status code 204


#########################################################
# LOCATIONS


def get_num_requests_for_api(api_name):
    with open("app/api_requests.csv", "r") as file:
        reader = csv.DictReader(file)
        rows = list(reader)
        for row in rows:
            if row["api"] == api_name:
                return int(row["num_requests"])
        return None


def update_num_requests_for_api(api_name, num_requests):
    with open("app/api_requests.csv", "r") as file:
        reader = csv.DictReader(file)
        rows = list(reader)
        for row in rows:
            if row["api"] == api_name:
                row["num_requests"] = num_requests

        with open("app/api_requests.csv", "w", newline="") as file:
            writer = csv.DictWriter(file, fieldnames=["api", "num_requests"])
            writer.writeheader()
            writer.writerows(rows)


@app.route("/suburbs/<string:postcode>", methods=["GET"])
def get_suburbs(postcode):
    suburbs = Suburb.query.filter_by(suburb_postcode=postcode)
    if not suburbs:
        return jsonify({"message": "Suburbs not found"}), 400
    suburbs_list = [suburb.to_dict().get("suburb_name") for suburb in suburbs]
    if len(suburbs_list) == 0:
        return jsonify({"message": "Suburbs not found"}), 400
    return jsonify({"suburbs": suburbs_list}), 200


@app.route("/suburbs/<string:postcode>/record", methods=["GET"])
def get_data_for_suburbs(postcode):
    suburb = Suburb.query.filter_by(suburb_postcode=postcode).first()
    if not suburb:
        return jsonify({"message": "Suburbs not found"}), 400
    suburb_lat = suburb.to_dict().get("suburb_lat")
    suburb_long = suburb.to_dict().get("suburb_long")
    num_requests_owapi = get_num_requests_for_api("owapi")
    if num_requests_owapi >= 50:
        return jsonify({"message": "API requests exceeded"}), 500
    owapi_url = owapi_base_url.replace("<<lat>>", str(suburb_lat)).replace(
        "<<lon>>", str(suburb_long)
    )

    update_num_requests_for_api("owapi", num_requests_owapi + 1)
    response = requests.get(owapi_url)

    if response.status_code == 200:
        data = response.json()
        print(data)
        return jsonify(
            {
                "postcode": postcode,
                "temperature": data["current"].get("temp"),
                "uvi": data["current"].get("uvi"),
            }
        )

    else:
        print(owapi_url)
        print(f"Error: {response.status_code}")
        print(response)

        return jsonify({"message": "error in open weather api"}), 500
        # return jsonify(all_suburbs)

    return jsonify({"suburbs": owapi_url}), 200


#########################################################
# SUNSCREEN REMINDERS


@app.route("/users/<int:users_id>/sunscreen-reminders", methods=["GET", "POST"])
def manage_sunscreen_reminders(users_id):
    # Check if the user exists
    user = Users.query.get_or_404(users_id)
    if not user:
        return jsonify({"error": "Invalid User"}), 400

    if request.method == "GET":
        reminders = user.ss_reminders  # Fetch reminders via relationship
        result = []
        for reminder in reminders:
            rem = reminder.to_dict()
            rem["ssreminder_id"] = "{}".format(rem.get("ssreminder_id"))
            rem["users_id"] = "{}".format(rem.get("users_id"))
            result.append(rem)
        return jsonify(result)

    elif request.method == "POST":
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        ssreminder_type = data.get("ssreminder_type")

        # Ensure that required fields are present in the data
        if ssreminder_type == "O" and (
            ("ssreminder_date" not in data) or ("ssreminder_time" not in data)
        ):
            return jsonify({"error": "Missing data for reminder date or time"}), 400

        if ssreminder_type == "D" and ("ssreminder_time" not in data):
            return jsonify({"error": "Missing data for reminder time"}), 400

        if ssreminder_type == "W" and (
            "ssreminder_weekday" not in data or "ssreminder_time" not in data
        ):
            return jsonify({"error": "Missing data for reminder weekdays or time"}), 400

        if "ssreminder_title" not in data:
            return jsonify({"error": "Missing data for reminder title"}), 400

        new_reminder = SSReminder(
            users_id=users_id,
            ssreminder_type=data.get("ssreminder_type"),
            ssreminder_date=data.get("ssreminder_date"),
            ssreminder_time=data.get("ssreminder_time"),
            ssreminder_weekday=data.get("ssreminder_weekday"),
            ssreminder_title=data.get("ssreminder_title"),
            ssreminder_notes=data.get("ssreminder_notes") or "",
            ssreminder_color_code=data.get("ssreminder_color_code") or "Y",
            ssreminder_status="P",
        )
        db.session.add(new_reminder)
        db.session.commit()
        return jsonify(new_reminder.to_dict()), 201


@app.route(
    "/users/<int:users_id>/sunscreen-reminders/<int:ssreminder_id>", methods=["GET"]
)
def get_specific_reminder(users_id, ssreminder_id):
    # Check if the user exists
    user = Users.query.get_or_404(users_id)
    if not user:
        return jsonify({"error": "Invalid User"}), 400

    reminder = SSReminder.query.get_or_404(ssreminder_id)
    if not reminder:
        return jsonify({"error": "Invalid Reminder"}), 400

    if reminder.users_id != users_id:
        return jsonify({"error": "Unauthorized"}), 401  # Authorization check

    result = reminder.to_dict()
    result["ssreminder_id"] = "{}".format(result.get("ssreminder_id"))
    result["users_id"] = "{}".format(result.get("users_id"))
    return jsonify(result), 200


@app.route(
    "/users/<int:users_id>/sunscreen-reminders/<int:ssreminder_id>", methods=["PUT"]
)
def update_sunscreen_reminder(users_id, ssreminder_id):
    # Check if the user exists
    user = Users.query.get_or_404(users_id)
    if not user:
        return jsonify({"error": "Invalid User"}), 400

    reminder = SSReminder.query.get_or_404(ssreminder_id)
    if not reminder:
        return jsonify({"error": "Invalid Reminder"}), 400

    if reminder.users_id != users_id:
        return jsonify({"error": "Unauthorized"}), 401  # Authorization check

    data = request.get_json()
    for key, value in data.items():
        setattr(reminder, key, value)
    db.session.commit()
    result = reminder.to_dict()
    result["ssreminder_id"] = "{}".format(result.get("ssreminder_id"))
    result["users_id"] = "{}".format(result.get("users_id"))
    return jsonify(result), 200


@app.route(
    "/users/<int:users_id>/delete-reminder/<int:ssreminder_id>", methods=["DELETE"]
)
def delete_sunscreen_reminder(users_id, ssreminder_id):
    # Check if the user exists
    user = Users.query.get_or_404(users_id)
    if not user:
        return jsonify({"error": "Invalid User"}), 400

    reminder = SSReminder.query.get_or_404(ssreminder_id)
    if not reminder:
        return jsonify({"error": "Invalid Reminder"}), 400

    if reminder.users_id != users_id:
        return jsonify({"error": "Unauthorized"}), 401  # Authorization check

    db.session.delete(reminder)
    db.session.commit()
    return "", 204


#########################################################

# UV Data routes


@app.route("/uv-impacts", methods=["GET"])
def get_uvimpacts_data():
    age = request.args.get("age", type=int)
    gender = request.args.get("gender", type=str)
    age_str = None
    if age > 90:
        age_str = "90+"
    else:
        age_min = (age // 5) * 5
        age_max = age_min + 4
        age_str = "{:02d}-{:02d}".format(age_min, age_max)

    filtered_rows = CancerStatistics.query.filter(
        and_(
            CancerStatistics.cancer_age_group == age_str,
            CancerStatistics.cancer_gender == gender,
        )
    ).all()

    data_rows = []
    for row in filtered_rows:
        row_dict = row.to_dict()
        incidence_rate, mortality_rate = (
            row_dict["cancer_age_specific_incidence_rate"],
            row_dict["cancer_age_specific_mortality_rate"],
        )

        print(incidence_rate, mortality_rate)
        print(float(incidence_rate) if incidence_rate != "None" else incidence_rate)
        row_dict["cancer_age_specific_incidence_rate"] = (
            float(incidence_rate) if incidence_rate != "None" else incidence_rate
        )
        row_dict["cancer_age_specific_mortality_rate"] = (
            float(mortality_rate) if mortality_rate != "None" else mortality_rate
        )
        data_rows.append(row_dict)
    return jsonify({"_data": data_rows})


if __name__ == "__main__":
    with app.app_context():
        try:
            db.create_all()  # Attempt to create the database tables
            print("Database tables created successfully.")
        except Exception as e:
            print(f"An error occurred while creating the database tables: {e}")
        create_app_folder()
        create_apireq_csv()
    app.run(debug=True if os.environ.get("FLASK_ENV") == "dev" else False, port=5000)
