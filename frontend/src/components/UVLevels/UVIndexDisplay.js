import React, { useState, useEffect } from 'react';

function UVIndexDisplay({ locationId }) {
  const [uvIndex, setUvIndex] = useState(null);
  const [uvIndexTimestamp, setUvIndexTimestamp] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUVIndex = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/locations/${locationId}/current-conditions`);
        if (!response.ok) {
          throw new Error('Failed to fetch UV data');
        }
        const data = await response.json();
        setUvIndex(data.uv_index); 
        setUvIndexTimestamp(data.uv_index.uvrecord_timestamp); 
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUVIndex();
  }, [locationId]); // Fetch when locationId changes

  return (
    <div>
      {isLoading && <p>Loading UV Index...</p>}
      {error && <p>Error: {error.message}</p>}
      {uvIndex && (
        <div>
          <h2>UV Index: {uvIndex.uvindex_value}</h2> 
          <p>Recorded at: {new Date(uvIndexTimestamp).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}

export default UVIndexDisplay;
