import React, { useState, useEffect } from 'react';

function ClothingRecommendations({ uvIndex, location /*, other relevant data */ }) {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/clothing-recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uv_index: uvIndex, location: location /*, ... */ }),
        });
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        const data = await response.json();
        setRecommendations(data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [uvIndex, location]); // Fetch recommendations when UV index or location changes

  return (
    <div>
      <h2>Clothing Recommendations</h2>
      {isLoading && <p>Loading recommendations...</p>}
      {error && <p>Error: {error.message}</p>}

      {recommendations.length > 0 ? (
        <ul>
          {recommendations.map((rec) => (
            <li key={rec.clothing_id}>
              {rec.clothing_type} (UPF {rec.clothing_upf})
            </li>
          ))}
        </ul>
      ) : (
        <p>No recommendations available.</p>
      )}
    </div>
  );
}

export default ClothingRecommendations;
