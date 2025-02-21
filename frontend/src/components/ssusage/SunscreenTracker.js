// import React, { useState, useEffect, useContext } from 'react';

function SunScreenTracker() { // Assuming we have the user's ID
  
  // const [lastApplication, setLastApplication] = useState(null);
  // const [nextApplicationDue, setNextApplicationDue] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);

  // // 1. Fetch User's Sunscreen Data on Component Mount
  // useEffect(() => {
  //   const fetchSunscreenData = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await fetch(`/users/${userId}/sunscreen-reminders`);
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch sunscreen data');
  //       }
  //       const data = await response.json();

  //       // Logic to extract the latest application and calculate the next due date (see below)
  //       const latestReminder = data.sort((a, b) => new Date(b.ssappl_timestamp) - new Date(a.ssappl_timestamp))[0]; // Assuming reminders are the sunscreen applications
  //       setLastApplication(latestReminder.ssappl_timestamp ? new Date(latestReminder.ssappl_timestamp) : null);
  //       calculateNextApplicationDue(latestReminder);  

  //     } catch (error) {
  //       setError(error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchSunscreenData();
  // }, [userId]);

  // // 2. Helper Function to Calculate Next Application
  // const calculateNextApplicationDue = (latestReminder) => {
  //   // Placeholder logic
  //   if (latestReminder) {
  //       const lastApplicationDate = new Date(latestReminder.ssappl_timestamp);
  //       const nextDue = new Date(lastApplicationDate);
  //       nextDue.setHours(lastApplicationDate.getHours() + 2); // 2 hours is an example
  //       setNextApplicationDue(nextDue);
  //   } else {
  //       setNextApplicationDue(null); 
  //   } 
  // };

  // // 3. Record a New Sunscreen Application 
  // const handleSunscreenApplication = async () => {
  //   setIsLoading(true);
    
  // if (!userId) {
  //   setIsLoading(false);
  //   console.error("User ID is null. Make sure the user is logged in.");
  //   setError("You must be logged in to record a sunscreen application.");
  //   return; // Exit the function if userId is null
  // }
  //   // Create a new date object for the application timestamp
  //   const applicationTimestamp = new Date();
  
  //   // Example static values for uvIndex and temperature
  //   // In a real application, these might come from user input or a weather API
  //   const uvIndex = 5; // Example static value
  //   const temperature = 25; // Example static value in Celsius
  
  //   try {
  //     const response = await fetch(`/users/${userId}/sunscreen-reminders`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         applicationTimestamp: applicationTimestamp.toISOString(), // Convert to ISO string for compatibility
  //         uvIndex: uvIndex,
  //         temperature: temperature,
  //       }),
  //     });
  //     if (!response.ok) {
  //       throw new Error('Failed to record application');
  //     }
  //     // Update state to reflect the new application
  //     const newApplicationData = await response.json();
  //     setLastApplication(applicationTimestamp); // Set the state with the new application date
  //     calculateNextApplicationDue(newApplicationData); // You might need to adjust this based on actual data received
  //   } catch (error) {
  //     setError(error.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // return (
  //   <div>
  //     {isLoading && <p>Loading sunscreen data...</p>}
  //     {error && <p>Error: {error.message}</p>}

  //     {lastApplication ? (
  //       <p>Last Sunscreen Application: {lastApplication.toLocaleString()}</p>
  //     ) : (
  //       <p>No sunscreen applications recorded yet.</p>
  //     )}

  //     {nextApplicationDue && (
  //       <p>Next Application Due: {nextApplicationDue.toLocaleString()}</p>
  //     )}

  //     <button onClick={handleSunscreenApplication}>Record Sunscreen Application</button>
  //   </div>
  // );
}

export default SunScreenTracker; 
