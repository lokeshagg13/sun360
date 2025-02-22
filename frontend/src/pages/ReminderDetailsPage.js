import React from "react"; // Import useContext
import { useParams } from "react-router-dom";

import ReminderDetails from "../components/reminders/ReminderDetails";

function ReminderDetailsPage() {
  const { id } = useParams();
  return <ReminderDetails id={id} />;
}

export default ReminderDetailsPage;
