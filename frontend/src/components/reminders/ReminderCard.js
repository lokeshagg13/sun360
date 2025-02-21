import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import "./ReminderForm.css";

import {
  convertTo12HourFormat,
  isCurrentDate,
  isTomorrowDate,
  formatDateToDDMMMYYYY,
  getFullWeekdayName,
  isCurrentWeekday,
  isTomorrowWeekday,
} from "../../utils/dateTimeUtils";

const getCurrentDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
  const yyyy = today.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

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

function getFullReminderColor(reminderColor) {
  switch (reminderColor) {
    case "R":
      return "red";
    case "Y":
      return "yellow";
    case "G":
      return "green";
    default:
      return "red";
  }
}

function getFullReminderDay(reminderFrequency, reminderDate, reminderWeekday) {
  let day = "";
  switch (reminderFrequency) {
    case "O":
      day = reminderDate;
      if (isCurrentDate(day)+) {
        day = "Today";
      } else if (isTomorrowDate(day)) {
        day = "Tomorrow";
      } else {
        day = formatDateToDDMMMYYYY(day);
      }
      break;
    case "D":
      return "Today";
    case "W":
      day = getFullWeekdayName(props.weekday);
      if (isCurrentWeekday(day)) {
        return "Today";
      } else if (isTomorrowWeekday(day)) {
        return "Tomorrow";
      } else {
        return day;
      }
    default:
      return "";
  }
}

function ReminderCard({ reminderId }) {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [reminderFrequency, setReminderFrequency] = useState("O");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderWeekday, setReminderWeekday] = useState("MO");
  const [reminderTime, setReminderTime] = useState({
    hour: "",
    minute: "",
    amOrPm: "",
  });
  const [reminderUser, setReminderUser] = useState("");
  const [reminderNotes, setReminderNotes] = useState("");
  const [reminderColor, setReminderColor] = useState("Y");
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
        setReminderDate(reminderData.ssreminder_date || "");
        setReminderWeekday(reminderData.ssreminder_weekday || "MO");
        setReminderUser(reminderData.ssreminder_title);
        setReminderNotes(reminderData.ssreminder_notes);
        setReminderColor(reminderData.ssreminder_color_code);

        const [hour, minute] = reminderData.ssreminder_time.split(":");
        const amOrPm = hour >= 12 ? "pm" : "am";
        setReminderTime({ hour: hour % 12, minute, amOrPm });
      } catch (error) {
        console.error("Error fetching reminder details:", error);
      }
    };

    fetchReminderDetails();
  }, [auth.accessID, reminderId]);

  const time12 = convertTo12HourFormat(props.time.slice(0, -3));

  return (
    <div className={`mini-card ${color}`}>
      <div className="time">{time12}</div>
      <div className="user">{props.user}</div>
      <div className="last">
        <div className="day">{day}</div>
        <div className="frequency"> {frequency}</div>
      </div>
    </div>
  );
}

export default ReminderForm;
