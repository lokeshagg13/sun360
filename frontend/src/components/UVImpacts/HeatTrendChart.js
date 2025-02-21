import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function HeatTrendChart({ locationId }) {
  const [temperatureData, setTemperatureData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemperatureHistory = async () => {
      setIsLoading(true);
      try {
        // Example: Fetch the past week's data
        const today = new Date();
        const pastWeek = new Date(today.setDate(today.getDate() - 7)); 
        const startDate = pastWeek.toISOString().split('T')[0]; 
        const endDate = today.toISOString().split('T')[0];

        const response = await fetch(`/locations/${locationId}/temperature-history?start_date=${startDate}&end_date=${endDate}`);
        if (!response.ok) {
          throw new Error('Failed to fetch temperature data');
        }
        const data = await response.json();
        setTemperatureData(data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemperatureHistory();
  }, [locationId]);

  return (
    <ResponsiveContainer width="100%" height={300}> 
      <LineChart data={temperatureData}>
        <XAxis dataKey="timestamp" tickFormatter={(ts) => new Date(ts).toLocaleDateString()} />
        <YAxis label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(value) => `${value} °C`} /> 
        <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default HeatTrendChart;
