import React, { useState } from "react";
import "./ReminderMiniCard.css";

import {
  convertTo12HourFormat,
  isCurrentDate,
  isTomorrowDate,
  formatDateToDDMMMYYYY,
  getFullWeekdayName,
  isCurrentWeekday,
  isTomorrowWeekday,
} from "../../utils/dateTimeUtils";

function ReminderMiniCard(props) {
  let color = "red";

  switch (props.color) {
    case "R":
      color = "red";
      break;
    case "Y":
      color = "yellow";
      break;
    case "G":
      color = "green";
      break;
    default:
      color = "red";
  }

  let frequency = "";
  let day = "";
  switch (props.frequency) {
    case "O":
      frequency = "(Once)";
      day = props.date;
      if (isCurrentDate(day)) {
        day = "Today";
      } else if (isTomorrowDate(day)) {
        day = "Tomorrow";
      } else {
        day = formatDateToDDMMMYYYY(day);
      }
      break;
    case "D":
      frequency = "(Daily)";
      day = "Today";
      break;
    case "W":
      frequency = "(Weekly)";
      day = getFullWeekdayName(props.weekday);
      if (isCurrentWeekday(day)) {
        day = "Today";
      } else if (isTomorrowWeekday(day)) {
        day = "Tomorrow";
      }
      break;
    default:
      frequency = "";
  }

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

export default ReminderMiniCard;
