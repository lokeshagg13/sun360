import React, { useState, useEffect } from 'react';

// Example skin impact calculation logic
function calculateSkinImpact(uvIndex, skinType) {
   // Placeholder for now. Example based on skin type and UV Index
   if (skinType === 'Type 1' && uvIndex >= 8) {
       return { riskLevel: 'High', timeToBurn: '15 minutes' };
   } else if (skinType === 'Type 2' && uvIndex >= 6) {
       return { riskLevel: 'Moderate', timeToBurn: '30 minutes' };  
   } else {
       return { riskLevel: 'Low', timeToBurn: '60+ minutes' };
   } 
}

function SkinImpactVisual({ locationId, skinType }) {
  const [uvIndex, setUvIndex] = useState(null);
  const [skinImpact, setSkinImpact] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkinImpact = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/locations/${locationId}/current-conditions`);
        if (!response.ok) {
          throw new Error('Failed to fetch UV data');
        }
        const data = await response.json();
        const calculatedImpact = calculateSkinImpact(data.uv_index.uvindex_value, skinType); 
        setUvIndex(data.uv_index);
        setSkinImpact(calculatedImpact); 
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkinImpact();
  }, [locationId, skinType]); 

  return (
    <div>
      {isLoading && <p>Loading skin impact...</p>}
      {error && <p>Error: {error.message}</p>}
      {skinImpact && (
        <div>
          <h2>Skin Impact</h2>
          <p>UV Index: {uvIndex.uvindex_value}</p> 
          <p>Risk Level: {skinImpact.riskLevel}</p>
          <p>Estimated Time to Sunburn: {skinImpact.timeToBurn}</p>

        </div>
      )}
    </div>
  );
}

export default SkinImpactVisual;
