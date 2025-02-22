import React, { useEffect, useState } from "react";
import axios from "axios";

import ReminderCard from "./ReminderCard";
import useAuth from "../../hooks/useAuth";
import { getReminderDisplayInfo } from "../../utils/reminderUtils";
import Loader from "../basic-ui/elements/Loader";
import { useNavigate } from "react-router-dom";

import "./ReminderDetails.css"

const GET_REMINDER_URL =
  "/api/users/<<user_id>>/sunscreen-reminders/<<reminder_id>>";
const DELETE_REMINDER_URL =
  "/api/users/<<user_id>>/delete-reminder/<<reminder_id>>";

function ReminderDetails(props) {
  const { id } = props;
  const navigate = useNavigate();
  const [reminderData, setReminderData] = useState(null);
  const [fetchStatus, setFetchStatus] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await axios.get(
          GET_REMINDER_URL.replace("<<user_id>>", auth.accessID).replace(
            "<<reminder_id>>",
            id
          )
        );
        setFetchStatus("s");
        const fetchedData = response?.data || [];
        const { frequency, color, day, time, recommTime } =
          getReminderDisplayInfo(
            fetchedData.ssreminder_type,
            fetchedData.ssreminder_color_code,
            fetchedData.ssreminder_date,
            fetchedData.ssreminder_time,
            fetchedData.ssreminder_weekday
          );
        if (day !== null) {
          fetchedData.ssreminder_freq = frequency;
          fetchedData.ssreminder_color = color;
          fetchedData.ssreminder_day = day;
          fetchedData.ssreminder_time = time;
          fetchedData.ssreminder_recomm_time = recommTime;

          setReminderData(fetchedData);
        } else throw new Error("Invalid date");
      } catch (error) {
        console.log(error);
        setFetchStatus("e");
        setReminderData(null);
      }
    };
    setFetchStatus("p");
    fetchReminders();
  }, []);

  const handleDelete = async () => {
    
    try {
      setDeleteStatus("p");

      await axios.delete(
        DELETE_REMINDER_URL.replace("<<user_id>>", auth.accessID).replace(
          "<<reminder_id>>",
          reminderData.ssreminder_id
        )
      );

      navigate("/reminders");
    } catch (error) {
      console.error("Delete Reminder Error:", error);
      setDeleteStatus("e");
    }
  };

  return (
    <>
      {fetchStatus === "p" && <Loader />}
      {fetchStatus === "s" && reminderData === null && (
        <h2>Invalid Reminder</h2>
      )}
      {fetchStatus === "s" && reminderData !== null && (
        <>
          <div className="reminder-card">
            <ReminderCard
              key={reminderData.ssreminder_id}
              id={reminderData.ssreminder_id}
              user={reminderData.ssreminder_title}
              notes={reminderData.ssreminder_notes}
              date={reminderData.ssreminder_date}
              weekday={reminderData.ssreminder_weekday}
              frequency={reminderData.ssreminder_freq}
              color={reminderData.ssreminder_color}
              day={reminderData.ssreminder_day}
              time={reminderData.ssreminder_time}
              recommTime={reminderData.ssreminder_recomm_time}
            />
          </div>
          <div className="reminder-action">
            <button onClick={() => handleDelete()}>Delete Reminder</button>
            {deleteStatus === "p" && <Loader />}
            {deleteStatus === "e" && (
              <h5>Reminder Deletion failed. Please try again.</h5>
            )}
            <button onClick={() => navigate("/reminders")}>
              Show All Reminders
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default ReminderDetails;
