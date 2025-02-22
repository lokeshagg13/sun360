import React from "react";
import "./ReminderCard.css";

function ReminderCard(props) {
  const { id, frequency, color, day, time, user, notes, recommTime } = props;
  return (
    <div className="card-div">
      <div className={`card ${color}`}>
        <div className="big-card">
          <div className="mid-row">
            <div className="day">{day}</div>
            <div className="frequency"> ({frequency})</div>
          </div>
          <div className="mid-row">
            <div className="time">Time: {time}</div>
            <div className="user">For: {user}</div>
          </div>
        </div>
        <div className="recomm">Next recommended application: {recommTime}</div>
        <div className="notes">Notes: {notes}</div>
      </div>
    </div>
  );
}

export default ReminderCard;
