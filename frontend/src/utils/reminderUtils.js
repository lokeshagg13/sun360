import {
  isCurrentDate,
  isTomorrowDate,
  formatDateToDDMONYYYY,
  isDatePassed,
  getFullWeekdayName,
  isCurrentWeekday,
  isTomorrowWeekday,
  convertTo12HourFormat,
  isTimePassed,
  getTimeAfterTwoHours,
} from "./dateTimeUtils";

export function getFullReminderFrequency(reminderFrequency) {
  switch (reminderFrequency) {
    case "O":
      return "One Time";
    case "D":
      return "Daily";
    case "W":
      return "Weekly";
  }
}

export function getFullReminderColor(reminderColor) {
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

export function getFullReminderDay(
  reminderFrequency,
  reminderDate,
  reminderTime,
  reminderWeekday
) {
  switch (reminderFrequency) {
    case "O":
      if (isCurrentDate(reminderDate)) {
        if (isTimePassed(reminderTime)) {
          return null;
        } else {
          return "Today";
        }
      } else if (isTomorrowDate(reminderDate)) {
        return "Tomorrow";
      } else if (isDatePassed(reminderDate)) {
        return null;
      } else {
        return formatDateToDDMONYYYY(reminderDate);
      }
    case "D":
      if (isTimePassed(reminderTime)) {
        return "Tomorrow";
      } else {
        return "Today";
      }
    case "W":
      if (isCurrentWeekday(reminderWeekday)) {
        if (isTimePassed(reminderTime)) {
          return null;
        } else {
          return "Today";
        }
      } else if (isTomorrowWeekday(reminderWeekday)) {
        return "Tomorrow";
      } else {
        return getFullWeekdayName(reminderWeekday);
      }
    default:
      return null;
  }
}

export function getReminderDisplayInfo(
  reminderFrequency,
  reminderColor,
  reminderDate,
  reminderTime,
  reminderWeekday
) {
  const frequency = getFullReminderFrequency(reminderFrequency);

  const color = getFullReminderColor(reminderColor);

  const day = getFullReminderDay(
    reminderFrequency,
    reminderDate,
    reminderTime,
    reminderWeekday
  );

  const time = convertTo12HourFormat(reminderTime);
  const recommTime = getTimeAfterTwoHours(reminderTime);

  return {
    frequency,
    color,
    day,
    time,
    recommTime,
  };
}
