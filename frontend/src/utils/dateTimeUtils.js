export function convertTo12HourFormat(time24) {
  const [hour, minute] = time24.split(":").map(Number);
  const amOrPm = hour < 12 ? "am" : "pm";
  const hour12 = hour % 12 || 12;
  const time12 = `${hour12.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}${amOrPm}`;
  return time12;
}

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

export function formatDateToDDMMMYYYY(dateString) {
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
  const currentWeekday = getCurrentWeekday();
  return day === currentWeekday;
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
  const secondIndex = weekdays.indexOf(day);
  return secondIndex > firstIndex;
}
