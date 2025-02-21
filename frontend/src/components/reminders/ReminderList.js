import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

import ReminderMiniCard from "./ReminderMiniCard";

import "./ReminderList.css";

const GET_REMINDERS_URL =
  "http://127.0.0.1:5000/users/<<user_id>>/sunscreen-reminders";

function ReminderList() {
  const [reminders, setReminders] = useState([]);
  const [fetchStatus, setFetchStatus] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await axios.get(
          GET_REMINDERS_URL.replace("<<user_id>>", auth.accessID),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setFetchStatus("s");
        setReminders(response.data || []);
      } catch (error) {
        console.log(error);
        setFetchStatus("e");
        setReminders([]);
      }
    };
    setFetchStatus("p");
    fetchReminders();
  }, []);

  return (
    <>
      {fetchStatus === "p" && <p>Fetching reminders ...</p>}
      {fetchStatus === "e" && <p>Error while fetching reminders.</p>}
      {fetchStatus === "s" && reminders.length === 0 && (
        <p>No Sunscreen Reminders Yet.</p>
      )}
      {reminders.length > 0 && <h3>Sunscreen Reminders</h3>}
      {reminders.length > 0 &&
        reminders.map((reminder) => (
          <ReminderMiniCard
            key={reminder.ssreminder_id}
            color={reminder.ssreminder_color_code}
            time={reminder.ssreminder_time}
            user={reminder.ssreminder_title}
            date={reminder.ssreminder_date}
            weekday={reminder.ssreminder_weekday}
            frequency={reminder.ssreminder_type}
          />
        ))}
      <Link to="/add-reminder">
        <button className="add-reminder">Add a new Reminder</button>
      </Link>
    </>
  );
}

export default ReminderList;
