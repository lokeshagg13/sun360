import os
import secrets
import requests

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from flask.helpers import send_from_directory
from sqlalchemy import create_engine, func, and_
from sqlalchemy.engine.reflection import Inspector
from sqlalchemy.dialects.postgresql.base import PGDialect
from werkzeug.security import generate_password_hash, check_password_hash
PGDialect._get_server_version_info = lambda *args: (9, 2)

from models import (
    Users,
    FamilyMember,
    Suburb,
    Suburb_Shp,
    SSReminder
)
from database import db

load_dotenv()

#######################################################

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
owapi_base_url = (
    "https://api.openweathermap.org/data/2.5/onecall?lat=<<lat>>&lon=<<lon>>&exclude=hourly,daily,minutely,alerts&appid="
    + os.environ.get("OPEN_WEATHER_API_KEY")
)
db.init_app(app)
CORS(app, supports_credentials=True, allow_headers="*", origins="*")


@app.cli.command("check-tables")
def check_tables():
    """Check if tables exist in the database."""
    engine = create_engine(app.config["SQLALCHEMY_DATABASE_URI"])
    inspector = Inspector.from_engine(engine)
    tables = inspector.get_table_names()
    if tables:
        print("Found tables in the database:")
        for table in tables:
            print(f"- {table}")
    else:
        print("No tables found in the database.")


@app.cli.command("create-db")
def create_db():
    """Create database tables."""
    with app.app_context():
        db.create_all()


#######################################################
# Basic Routes (Placeholders )


@app.route("/")
@cross_origin()
def index():
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


def logout_user(users_id):
    try:
        Users.query.filter_by(users_id=users_id).update({"users_access_token": None})
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


@app.route("/logout", methods=["POST"])
def logout():
    users_id = request.headers.get("Access-ID")
    if logout_user(users_id):
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


@app.route("/suburb-UV-temp", methods=["GET"])
def get_data_for_suburbs():
    # All Shape File locations
    all_suburbs = Suburb_Shp.query.all()
    for suburb in all_suburbs[:1]:
        lat = suburb.suburb_shp_lat
        lon = suburb.suburb_shp_long
        owapi_url = owapi_base_url.replace("<<lat>>", str(lat)).replace(
            "<<lon>>", str(lon)
        )
        print(owapi_url)
        response = requests.get(owapi_url)
        print(response.json())
    return jsonify(all_suburbs)


@app.route("/locations", methods=["GET"])
def get_locations():
    all_locations = Suburb.query.all()
    result = [loc.to_dict() for loc in all_locations]
    return jsonify(result)


@app.route("/locations/<int:location_id>", methods=["GET"])
def get_location(suburb_name):
    location = Suburb.query.get_or_404(suburb_name)

    # Include related data if needed
    result = suburb_name.to_dict()
    if request.args.get("include_suburbs"):
        result["suburbs"] = [suburb.to_dict() for suburb in suburb_name.suburbs]
    # Add similar logic for other related data (temp_alerts, uv_records) as required

    return jsonify(result)


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
        result = [reminder.to_dict() for reminder in reminders]
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
    "/users/<int:users_id>/sunscreen-reminders/<int:ssreminder_id>", methods=["PUT"]
)
def update_sunscreen_reminder(users_id, ssreminder_id):
    user = Users.query.get_or_404(users_id)
    reminder = SSReminder.query.get_or_404(ssreminder_id)

    if reminder.users_id != users_id:
        return jsonify({"error": "Unauthorized"}), 401  # Authorization check

    data = request.get_json()
    for key, value in data.items():
        setattr(reminder, key, value)
    db.session.commit()
    return jsonify(reminder.to_dict())


@app.route(
    "/users/<int:users_id>/sunscreen-reminders/<int:ssreminder_id>", methods=["DELETE"]
)
def delete_sunscreen_reminder(users_id, ssreminder_id):
    user = Users.query.get_or_404(users_id)
    reminder = SSReminder.query.get_or_404(ssreminder_id)

    if reminder.users_id != users_id:
        return jsonify({"error": "Unauthorized"}), 401  # Authorization check

    db.session.delete(reminder)
    db.session.commit()
    return "", 204


########################################################################

# Real Database:
if __name__ == "__main__":
    with app.app_context():
        try:
            db.create_all()  # Attempt to create the database tables
            print("Database tables created successfully.")
        except Exception as e:
            print(f"An error occurred while creating the database tables: {e}")
    app.run(debug=True, port=5000)
