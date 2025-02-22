# 🌞 Sun360

Sun360 is a user-friendly application designed to protect individuals in Victoria, Australia, from harmful UV rays. It provides essential UV-related information and recommendations tailored to different age groups and genders, ensuring a safe and informed experience under the sun.

---

## ✨ Features

1. **📊 UV Impact Visualization:**

   - Graphical representation of UV impacts across various age groups and genders.

2. **📍 Location-based UV Index and Temperature:**

   - Check UV Index and temperature for any location in Victoria using its postcode.

3. **👕 Clothing Recommendations:**

   - Provides clothing suggestions based on the current UV Index.

4. **⏰ Sunscreen Reminders:**

   - Personalized reminders for sunscreen application for users and their family members.

5. **👨‍👩‍👧 Family Management:**

   - Register and manage family members for customized settings and reminders.

6. **⚙️ Settings Customization:**
   - Tailor the application to suit personal preferences.

---

## 🛠️ Installation

### Prerequisites:

- Python 3.8 or higher
- PostgreSQL database

### Steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/sun360.git
   ```

2. Navigate to the project directory:

   ```bash
   cd sun360
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:

   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     FLASK_APP=app.py
     FLASK_ENV=dev or production
     DATABASE_URL=your_database_url
     OPEN_WEATHER_API_KEY=your_openweather_api_key
     ```

5. Start the application:
   ```bash
   python app.py
   ```

---

## 🗂️ File Structure

### **Backend**

- **`app.py`**:

  - Main application file containing routes, middleware, and API logic.

- **`models.py`**:

  - Defines database models such as `Users`, `FamilyMember`, `Suburb`, and more.

- **`database.py`**:
  - Contains SQLAlchemy database initialization.

### **Utilities**

- **`api_requests.csv`**:

  - Tracks the number of API requests to external services.

- **`.env`**:
  - Environment variables for secure configurations.

---

## 📦 Dependencies

- **Frameworks and Libraries:**

  - Flask
  - Flask-CORS
  - SQLAlchemy
  - dotenv

- **Database:**

  - PostgreSQL

- **API Services:**

  - 🌤️ OpenWeather API

- **Other Utilities:**
  - 🔐 Werkzeug
  - 📜 CSV

---

## 🚀 Usage

1. **🔑 Login and Registration:**

   - Users can register with their details, including family members.
   - Login using the registered email and password.

2. **☀️ Check UV and Temperature:**

   - Enter a postcode to view the UV Index and temperature for the area.

3. **👕 Get Clothing Recommendations:**

   - Receive clothing suggestions based on UV levels.

4. **⏰ Set Sunscreen Reminders:**

   - Create personalized reminders for sunscreen application.

5. **👨‍👩‍👧 Manage Family Members:**
   - Add or modify family members’ details for tailored notifications.

---

## 🌐 API Endpoints

- **🔑 User Authentication:**

  - `/login`: POST - Login user.
  - `/logout`: GET - Logout user.

- **👤 User Management:**

  - `/users`: POST - Register a new user.
  - `/users/<id>`: GET/PUT/DELETE - Manage user details.

- **☀️ UV and Temperature:**

  - `/suburbs/<postcode>`: GET - Fetch suburb information.
  - `/suburbs/<postcode>/record`: GET - Get UV Index and temperature.

- **⏰ Sunscreen Reminders:**
  - `/users/<id>/sunscreen-reminders`: GET/POST - Manage reminders.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with descriptive messages.
4. Submit a pull request.

---

## 📜 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## 📚 References

1. [Favicon Generator - favicon.io](https://favicon.io/)

   - The favicon was generated using the following graphics from Twitter Twemoji:
     - **Graphics Title**: 2600.svg
     - **Graphics Author**: Copyright 2020 Twitter, Inc and other contributors ([Twemoji Repository](https://github.com/twitter/twemoji))
     - **Graphics Source**: [2600.svg](https://github.com/twitter/twemoji/blob/master/assets/svg/2600.svg)
     - **Graphics License**: [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/)

2. [OpenWeatherMap One Call API](https://openweathermap.org/api/one-call-api)

3. [When to Protect Yourself from UV - Generation SunSmart](https://www.generationsunsmart.com.au/resources/poster-when-to-protect-yourself-from-uv/)

4. [What is Ultraviolet (UV) Radiation? - AIM at Melanoma](https://www.aimatmelanoma.org/melanoma-101/prevention/what-is-ultraviolet-uv-radiation/)

5. [What is Ultraviolet (UV) Radiation? - AIM at Melanoma](https://www.aimatmelanoma.org/melanoma-101/prevention/what-is-ultraviolet-uv-radiation/)

6. [Cancer Incidence Age-Standardised Rates - AIHW](https://www.google.com/url?q=https://www.aihw.gov.au/getmedia/e8779760-1b3c-4c2e-a6c2-b0a8d764c66b/AIHW-CAN-122-CDiA-2021-Book-1a-Cancer-incidence-age-standardised-rates-5-year-age-groups.xlsx.aspx&sa=D&source=apps-viewer-frontend&ust=1710438466470891&usg=AOvVaw1_D6q7O1ZWsAXDirk3QotR&hl=en-GB)

---

## 📧 Contact

For any inquiries or support, please contact [lkaggarwal1997@gmail.com](mailto:lkaggarwal1997@gmail.com).

