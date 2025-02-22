// For Dates

export function isCurrentDate(dateString) {
  // Create a new Date object for the current date
  const currentDate = new Date();

  // Extract year, month, and day from the current date
  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
  const currentDay = String(currentDate.getDate()).padStart(2, "0");

  // Construct the current date string in the format "YYYY-MM-DD"
  const currentDateString = `${currentYear}-${currentMonth}-${currentDay}`;

  // Compare the input date string with the current date string
  return dateString === currentDateString;
}

export function isTomorrowDate(dateString) {
  // Create a new Date object for the current date
  const currentDate = new Date();

  // Add one day to the current date
  const tomorrowDate = new Date(currentDate);
  tomorrowDate.setDate(currentDate.getDate() + 1);

  // Extract year, month, and day from tomorrow's date
  const tomorrowYear = tomorrowDate.getFullYear();
  const tomorrowMonth = String(tomorrowDate.getMonth() + 1).padStart(2, "0");
  const tomorrowDay = String(tomorrowDate.getDate()).padStart(2, "0");

  // Construct tomorrow's date string in the format "YYYY-MM-DD"
  const tomorrowDateString = `${tomorrowYear}-${tomorrowMonth}-${tomorrowDay}`;

  // Compare the input date string with tomorrow's date string
  return dateString === tomorrowDateString;
}

export function getCurrentDate() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}

export function formatDateToDDMONYYYY(dateString) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [year, month, day] = dateString.split("-");
  const monthIndex = parseInt(month, 10) - 1; // Months in JavaScript are zero-based

  // Format the date to "DD MMM YYYY"
  const formattedDate = `${parseInt(day, 10)} ${months[monthIndex]} ${year}`;

  return formattedDate;
}

export function isDatePassed(dateString) {
  // Get the current date
  const currentDate = new Date();

  // Parse the date string "YYYY-MM-DD" into a Date object
  const dateToCompare = new Date(dateString);

  // Compare the two dates
  if (dateToCompare < currentDate) {
    return true;
  } else {
    return false;
  }
}

// For Weekdays

export function getFullWeekdayName(initials) {
  switch (initials) {
    case "SU":
      return "Sunday";
    case "MO":
      return "Monday";
    case "TU":
      return "Tuesday";
    case "WE":
      return "Wednesday";
    case "TH":
      return "Thursday";
    case "FR":
      return "Friday";
    case "SA":
      return "Saturday";
    default:
      return "Invalid Initials";
  }
}

export function getCurrentWeekday() {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDate = new Date();
  const currentWeekdayIndex = currentDate.getDay(); // Returns a number from 0 (Sunday) to 6 (Saturday)
  const currentWeekday = weekdays[currentWeekdayIndex];
  return currentWeekday;
}

export function isCurrentWeekday(day) {
  const checkedDay = getFullWeekdayName(day);
  const currentWeekday = getCurrentWeekday();
  return checkedDay === currentWeekday;
}

export function isTomorrowWeekday(day) {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const firstIndex = weekdays.indexOf(getCurrentWeekday());
  const secondIndex = weekdays.indexOf(getFullWeekdayName(day));
  return secondIndex > firstIndex;
}

// For Time

export function convertTo12HourFormat(time24) {
  const [hour, minute] = time24.split(":").map(Number);
  const amOrPm = hour < 12 ? "am" : "pm";
  const hour12 = hour % 12 || 12;
  const time12 = `${hour12.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}${amOrPm}`;
  return time12;
}

export function isTimePassed(time24) {
  // Get the current time
  const currentTime = new Date();

  // Parse the time string time24 into a Date object
  const timeToCompare = new Date();
  const [hours, minutes, seconds] = time24.split(":");
  timeToCompare.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));

  // Compare the two times
  if (timeToCompare <= currentTime) {
    return true;
  } else {
    return false;
  }
}

export function getTimeAfterTwoHours(time24) {
  // Parse the input time string to get hours and minutes
  const [hour, minute] = time24.split(':').map(Number);

  // Create a Date object with the current date and time
  const currentTime = new Date();
  currentTime.setHours(hour);
  currentTime.setMinutes(minute);

  // Add 2 hours to the current time
  currentTime.setHours(currentTime.getHours() + 2);
  const newHour = currentTime.getHours()
  const newMinute = currentTime.getMinutes()
  const amOrPm = newHour < 12 ? "am" : "pm";
  const hour12 = newHour % 12 || 12;
  const time12 = `${hour12.toString().padStart(2, "0")}:${newMinute
    .toString()
    .padStart(2, "0")}${amOrPm}`;
  return time12;
}

export function getTimeAfterTwoHoursForObj(inputTime) {
  // Extract hour, minute, and amOrPm from the input object
  const { hour, minute, amOrPm } = inputTime;

  // Convert hour and minute to numbers
  const hours = parseInt(hour);
  const minutes = parseInt(minute);

  // Convert 12-hour format to 24-hour format
  let hours24hr = hours;
  if (amOrPm.toLowerCase() === 'pm' && hours !== 12) {
    hours24hr += 12;
  } else if (amOrPm.toLowerCase() === 'am' && hours === 12) {
    hours24hr = 0;
  }

  // Create a Date object with the current date and time
  const currentTime = new Date();
  currentTime.setHours(hours24hr);
  currentTime.setMinutes(minutes);

  // Add 2 hours to the current time
  currentTime.setHours(currentTime.getHours() + 2);

  // Format the time in 12-hour format
  let hours12hr = currentTime.getHours();
  const newAmOrPm = hours12hr >= 12 ? 'PM' : 'AM';
  hours12hr = hours12hr % 12 || 12; // Convert hours to 12-hour format
  const minutesStr = currentTime.getMinutes().toString().padStart(2, '0'); // Ensure minutes are always two digits

  // Construct the 12-hour time string
  const time12hr = `${hours12hr}:${minutesStr} ${newAmOrPm}`;

  return time12hr;
}
