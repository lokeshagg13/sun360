// import React, { useState, useEffect, useContext } from 'react';
 
// function ReminderSettings() {
//   const [reminders, setReminders] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // State for new reminder settings
//   const [newReminderFrequency, setNewReminderFrequency] = useState('daily');
//   const [newReminderTimes, setNewReminderTimes] = useState(['10:00']); 
//   const [newReminderUVThreshold, setNewReminderUVThreshold] = useState('');
//   const [newReminderTempAlert, setNewReminderTempAlert] = useState(false);

//   // Fetch reminders on component mount
//   useEffect(() => {
//     const fetchReminders = async () => {
//       setIsLoading(true);
//       try {
//         const response = await fetch(`/users/${userId}/sunscreen-reminders`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch reminders');
//         }
//         console.log("Raw Response:", response); 
//         const data = await response.json();
//         setReminders(data);
//       } catch (error) {
//         setError(error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchReminders();
//   }, [userId]);

//   // Function to add a new time to the newReminderTimes array
//   const handleAddReminderTime = () => {
//     setNewReminderTimes([...newReminderTimes, '10:00']); // Add a default time
//   };

//   // Function to handle changes in reminder times
//   const handleTimeChange = (index, newTime) => {
//     setNewReminderTimes(currentTimes => currentTimes.map((time, i) => i === index ? newTime : time));
//   };

//    // Function to handle removal of reminder times
//   const handleTimeRemoval = (index) => {
//     setNewReminderTimes(currentTimes => currentTimes.filter((_, i) => i !== index));
//   };

//   // Function to add a new reminder
//   const handleAddReminder = async (event) => {
//     event.preventDefault();
//     setIsLoading(true);
//     try {
//       const response = await fetch(`/users/${userId}/sunscreen-reminders`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           ssreminder_freq: newReminderFrequency,
//           ssreminder_time: newReminderTimes,  
//           uv_index_threshold: newReminderUVThreshold,
//           temp_alert: newReminderTempAlert,
//         }),  
//       });
//       if (!response.ok) {
//         throw new Error('Failed to add reminder');
//       }
//       const newReminderData = await response.json();
//       setReminders([...reminders, newReminderData]);
//       setNewReminderFrequency('daily');
//       setNewReminderTimes(['10:00']);
//       setNewReminderUVThreshold('');
//       setNewReminderTempAlert(false);
//     } catch (error) {
//       setError(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//    // Function to update a reminder
//    const handleUpdateReminder = async (reminderId, updatedData) => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`/users/${userId}/sunscreen-reminders/${reminderId}`, {
//         method: 'PUT', 
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updatedData), 
//       });
//       if (!response.ok) {
//         throw new Error('Failed to update reminder');
//       }
//       // Update the reminders state locally
//       setReminders(reminders.map((reminder) => reminder.ssreminder_id === reminderId ? { ...reminder, ...updatedData } : reminder));
//     } catch (error) {
//       setError(error);
//     } finally {
//       setIsLoading(false); 
//     }
//   };

//   // Function to delete a reminder
//   const handleDeleteReminder = async (reminderId) => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`/users/${userId}/sunscreen-reminders/${reminderId}`, {
//         method: 'DELETE',
//       });
//       if (!response.ok) {
//         throw new Error('Failed to delete reminder');
//       }
//       // Update the reminders state locally
//       setReminders(reminders.filter((reminder) => reminder.ssreminder_id !== reminderId)); 
//     } catch (error) {
//       setError(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   return (
//     <div>
//       <h2>Reminder Settings</h2>
//       {isLoading && <p>Loading reminders...</p>}
//       {error && <p>Error: {error.message}</p>}

//       {/* Display existing reminders */}
//       {reminders.map((reminder) => (
//         <div key={reminder.ssreminder_id}> 
//           <p>Frequency: {reminder.ssreminder_freq}</p>
//           {reminder.ssreminder_time && reminder.ssreminder_time.map((time) => ( 
//               <p key={time}>Time: {time}</p> 
//           ))}  
//           <p>UV Index Threshold: {reminder.uv_index_threshold || 'None'}</p> 
//           <p>Temperature Alert: {reminder.temp_alert ? 'Yes' : 'No'}</p> 
//           <button onClick={() => handleUpdateReminder(reminder.ssreminder_id, /* ... */)}>Edit</button>
//           <button onClick={() => handleDeleteReminder(reminder.ssreminder_id)}>Delete</button>
//           {/* Reminder Times */} 
//             <div>
//                 {newReminderTimes.map((time, index) => ( 
//                     <div key={index}> 
//                         <input type="time" value={time} onChange={(e) => handleTimeChange(index, e.target.value)} />
//                         <button onClick={() => handleTimeRemoval(index)}>Remove Time</button>  
//                     </div> 
//                 ))}
//                 <button onClick={handleAddReminderTime}>Add Time</button>  
//             </div> 
//         </div>
//       ))}

//       <h3>Add New Reminder</h3>
//       <form onSubmit={handleAddReminder}>  
//     <input type="text" value={newReminderFrequency} onChange={(e) => setNewReminderFrequency(e.target.value)} placeholder="Frequency (e.g., daily)"/>
    
//      {/* UV Index Threshold */}
//     <input type="number" value={newReminderUVThreshold} onChange={(e) => setNewReminderUVThreshold(e.target.value)} placeholder="UV Index Threshold (Optional)"/>

//     {/* Temperature Alert  */}
//     <label htmlFor="tempAlert">Temperature Alert:</label>
//     <input type="checkbox" id="tempAlert" name="tempAlert" checked={newReminderTempAlert} onChange={(e) => setNewReminderTempAlert(e.target.checked)}/> 

//     {/* Reminder Times */} 
//     <div>
//         {newReminderTimes.map((time, index) => ( 
//             <div key={index}> 
//                 <input type="time" value={time} onChange={(e) => handleTimeChange(index, e.target.value)} />
//                 <button onClick={() => handleTimeRemoval(index)}>Remove Time</button>  
//             </div> 
//        ))}
//        <button onClick={handleAddReminderTime}>Add Time</button>  
//     </div> 

//     <button type="submit">Add Reminder</button>
//  </form>
//     </div>
//   );
// }

// export default ReminderSettings;
