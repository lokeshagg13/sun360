import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

import ReminderMiniCard from "./ReminderMiniCard";

import "./ReminderHomeList.css";
import { getReminderDisplayInfo } from "../../utils/reminderUtils";

const GET_REMINDERS_URL =
  "http://127.0.0.1:5000/users/<<user_id>>/sunscreen-reminders";

function ReminderHomeList() {
  const [reminders, setReminders] = useState([]);
  const [fetchStatus, setFetchStatus] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await axios.get(
          GET_REMINDERS_URL.replace("<<user_id>>", auth.accessID)
        );
        setFetchStatus("s");
        const fetchedReminders = response?.data || [];
        let filteredReminders = [];
        for (
          let i = 0;
          i < fetchedReminders.length && filteredReminders.length < 2;
          i += 1
        ) {
          let rem = fetchedReminders[i];
          const { frequency, color, day, time, recommTime } =
            getReminderDisplayInfo(
              rem.ssreminder_type,
              rem.ssreminder_color_code,
              rem.ssreminder_date,
              rem.ssreminder_time,
              rem.ssreminder_weekday
            );
          if (day !== null) {
            rem.ssreminder_freq = frequency;
            rem.ssreminder_color = color;
            rem.ssreminder_day = day;
            rem.ssreminder_time = time;
            rem.ssreminder_recomm_time = recommTime;
            filteredReminders.push(rem);
          }
        }
        setReminders(filteredReminders);
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
    <div className="home-reminder">
      <h3>Sunscreen Reminders</h3>
      {fetchStatus === "p" && <p>Fetching reminders ...</p>}
      {fetchStatus === "e" && <p>Error while fetching reminders.</p>}
      {fetchStatus === "s" && reminders.length === 0 && (
        <p>No Sunscreen Reminders Yet.</p>
      )}

      {reminders.length > 0 &&
        reminders.map((reminder) => (
          <ReminderMiniCard
            key={reminder.ssreminder_id}
            id={reminder.ssreminder_id}
            user={reminder.ssreminder_title}
            notes={reminder.ssreminder_notes}
            date={reminder.ssreminder_date}
            weekday={reminder.ssreminder_weekday}
            frequency={reminder.ssreminder_freq}
            color={reminder.ssreminder_color}
            day={reminder.ssreminder_day}
            time={reminder.ssreminder_time}
            recommTime={reminder.ssreminder_recomm_time}
          />
        ))}
      <Link to="/add-reminder">
        <button className="add-reminder">Add a new Reminder</button>
      </Link>
      <Link to="/reminders">
        <button className="show-all">Show All Reminders</button>
      </Link>
    </div>
  );
}

export default ReminderHomeList;
