import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import "./ReminderForm.css";

const getCurrentDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
  const yyyy = today.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

const GET_REMINDER_URL =
  "http://127.0.0.1:5000/users/<<user_id>>/sunscreen-reminders/";
const UPDATE_REMINDER_URL =
  "http://127.0.0.1:5000/users/<<user_id>>/sunscreen-reminders/";

function convertTo24HourFormat(time12) {
  let { hour, minute, amOrPm } = time12;

  hour = parseInt(hour, 10);
  if (hour === 12) {
    hour -= 12;
  }
  if (amOrPm.toUpperCase() === "PM") {
    hour += 12;
  }

  const time24 = `${hour.toString().padStart(2, "0")}:${minute}`;
  return time24;
}

function getFullReminderFrequency(reminderFrequency) {
  switch (reminderFrequency) {
    case "O":
      return "One Time";
    case "D":
      return "Daily";
    case "W":
      return "Weekly";
  }
}

function ReminderForm({ reminderId }) {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [reminderFrequency, setReminderFrequency] = useState("O");
  const [updatedFrequency, setUpdatedFrequency] = useState("O");
  const [selectedDate, setSelectedDate] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");
  const [selectedWeekday, setSelectedWeekday] = useState("MO");
  const [updatedWeekday, setUpdatedWeekday] = useState("");
  const [selectedTime, setSelectedTime] = useState({
    hour: "",
    minute: "",
    amOrPm: "",
  });
  const [user, setUser] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedColor, setSelectedColor] = useState("Y");
  const [updatedColor, setUpdatedColor] = useState("");
  const [status, setStatus] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [currentDate, _] = useState(getCurrentDate());

  useEffect(() => {
    const fetchReminderDetails = async () => {
      try {
        const response = await axios.get(
          GET_REMINDER_URL.replace("<<user_id>>", auth.accessID) + reminderId
        );
        const reminderData = response.data;

        setReminderFrequency(reminderData.ssreminder_type);
        setSelectedDate(reminderData.ssreminder_date || "");
        setSelectedWeekday(reminderData.ssreminder_weekday || "MO");
        setUser(reminderData.ssreminder_title);
        setNotes(reminderData.ssreminder_notes);
        setSelectedColor(reminderData.ssreminder_color_code);

        const [hour, minute] = reminderData.ssreminder_time.split(":");
        const amOrPm = hour >= 12 ? "pm" : "am";
        setSelectedTime({ hour: hour % 12, minute, amOrPm });
      } catch (error) {
        console.error("Error fetching reminder details:", error);
      }
    };

    fetchReminderDetails();
  }, [auth.accessID, reminderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setStatus("p");
      setRemarks("Updating your details");

      await axios.put(
        UPDATE_REMINDER_URL.replace("<<user_id>>", auth.accessID) + reminderId,
        JSON.stringify({
          ssreminder_type: frequency,
          ssreminder_date: frequency === "O" ? selectedDate : null,
          ssreminder_weekday: frequency === "W" ? selectedWeekday : null,
          ssreminder_time: convertTo24HourFormat(selectedTime),
          ssreminder_title: user,
          ssreminder_notes: notes,
          ssreminder_color_code: selectedColor,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/reminders");
    } catch (error) {
      console.error("Update Error:", error);
      setStatus("e");
      setRemarks("Update failed. Please try again.");
    }
  };

  return (
    <div className="reminder-container">
      <h2>Update Reminder</h2>
      <form onSubmit={handleSubmit} className="reminder-form">
        <div className="form-row">
          <label htmlFor="frequency" className="form-label">
            Reminder Frequency
          </label>
          <input
            type="text"
            name="reminderFrequency"
            id="reminderFrequency"
            value={reminderFrequency}
            disabled
          />
          <label htmlFor="frequency" className="form-label">
            Update Frequency
          </label>
          <select
            name="frequency"
            id="frequency"
            value={updatedFrequency}
            defaultValue="O"
            onChange={(e) => setUpdatedFrequency(e.target.value)}
          >
            <option value="O">One Time</option>
            <option value="D">Daily</option>
            <option value="W">Weekly</option>
          </select>
        </div>
        {frequency === "O" && (
          <div className="form-row">
            <label htmlFor="date" className="form-label">
              Reminder Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              min={currentDate}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <label htmlFor="date" className="form-label">
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              min={currentDate}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        )}
        {frequency === "W" && (
          <div className="form-row">
            <label htmlFor="weekday" className="form-label">
              Weekday
            </label>
            <select
              name="weekday"
              id="weekday"
              value={selectedWeekday}
              defaultValue="MO"
              onChange={(e) => setSelectedWeekday(e.target.value)}
            >
              <option value="MO">Monday</option>
              <option value="TU">Tuesday</option>
              <option value="WE">Wednesday</option>
              <option value="TH">Thursday</option>
              <option value="FR">Friday</option>
              <option value="SA">Saturday</option>
              <option value="SU">Sunday</option>
            </select>
          </div>
        )}
        <div className="form-row">
          <label htmlFor="time" className="form-label">
            Time
          </label>
          <div className="time-row">
            <input
              type="number"
              name="hour"
              id="hour"
              value={selectedTime.hour}
              onChange={(e) => {
                if (
                  e.target.value !== "" &&
                  (e.target.value < 1 || e.target.value > 12)
                )
                  return;
                setSelectedTime({ ...selectedTime, hour: e.target.value });
              }}
              min="1"
              max="12"
              size="2"
            />
            <span style={{ marginRight: "9px", marginTop: "5px" }}>
              <b>:</b>
            </span>
            <input
              type="number"
              name="minute"
              id="minute"
              value={selectedTime.minute}
              onChange={(e) => {
                if (
                  e.target.value !== "" &&
                  (e.target.value < 0 || e.target.value > 59)
                )
                  return;
                setSelectedTime({ ...selectedTime, minute: e.target.value });
              }}
              min="0"
              max="59"
              size="2"
            />
            <select
              name="amOrPm"
              id="amOrPm"
              value={selectedTime.amOrPm}
              defaultValue="am"
              onChange={(e) =>
                setSelectedTime({ ...selectedTime, amOrPm: e.target.value })
              }
            >
              <option value="am">am</option>
              <option value="pm">pm</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <label htmlFor="user" className="form-label">
            User
          </label>
          <input
            type="text"
            name="user"
            id="user"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label htmlFor="notes" className="form-label">
            Notes
          </label>
          <textarea
            name="notes"
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>
        <div className="form-row">
          <label htmlFor="color" className="form-label">
            Color
          </label>
          <select
            name="color"
            id="color"
            value={selectedColor}
            defaultValue="Y"
            onChange={(e) => setSelectedColor(e.target.value)}
          >
            <option className="Y" value="Y">
              Yellow
            </option>
            <option className="R" value="R">
              Red
            </option>
            <option className="G" value="G">
              Green
            </option>
          </select>
        </div>

        {status === "p" && <p className="pending-message">{remarks}</p>}
        {status === "e" && <p className="error-message">{remarks}</p>}
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default ReminderForm;
