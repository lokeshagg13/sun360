import React from "react";
import { Link } from "react-router-dom";
import "./ReminderMiniCard.css";
import NoteIcon from "../basic-ui/icons/NoteIcon";

function ReminderMiniCard(props) {
  const { id, frequency, color, day, time, user, notes, recommTime } = props;
  return (
    <div className="card-div">
      <Link to={`/reminders/${id}`}>
        <div className={`card ${color}`}>
          <div className="mini-card">
            <div className="time">{time}</div>
            <div className="user">{user}</div>
            <div className="last">
              <div className="day">{day}</div>
              <div className="frequency"> ({frequency})</div>
            </div>
            <div className="notes">{notes && notes !== "" && <NoteIcon />}</div>
          </div>
          <div className="recomm">
            Next recommended application: {recommTime} 
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ReminderMiniCard;
