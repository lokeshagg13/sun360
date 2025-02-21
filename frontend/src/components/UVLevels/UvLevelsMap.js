import React, { useEffect, useState } from 'react';
import * as Leaflet from 'leaflet'; // Import Leaflet
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

function UVLevelsMap() {
  const [locations, setLocations] = useState([]);
  const [currentUVData, setCurrentUVData] = useState(null);

  // Initialize the Map
  useEffect(() => {
    const map = Leaflet.map('map-container').setView([-33.8651, 151.2093], 5); // Customize initial center and zoom
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map); 

    // Fetch initial location data
    fetch('/locations')
      .then(response => response.json())
      .then(data => {
        setLocations(data);
        addMarkersToMap(data, map); 
      })
      .catch(error => console.error('Error fetching locations:', error));
  }, []);

   // Add markers to the map
  const addMarkersToMap = (locationsData, map) => {
    locationsData.forEach(location => {
      const marker = Leaflet.marker([location.location_lat, location.location_long])
            .addTo(map)
            .on('click', () => handleMarkerClick(location.location_id)); 
    });
  };

  // Handle when a marker is clicked
  const handleMarkerClick = (locationId) => {
    fetch(`/locations/${locationId}/current-conditions`)
      .then(response => response.json())
      .then(data => {
        setCurrentUVData(data);
        displayUVInfo(data); // Implement a function to display fetched data
      })
      .catch(error => console.error('Error fetching UV data:', error));
  };

  // Function to display fetched UV information
  const displayUVInfo = (data) => {
    Leaflet.popup()
        .setLatLng([data.location.location_lat, data.location.location_long]) 
        .setContent(`<b>Location:</b> ${data.location.location_name}<br>
                     <b>UV Index:</b> ${data.uv_index.uvindex_value || 'Not Available'}<br>
                      <b>Temperature:</b> ${data.temperature || 'Not Available'}` 
        )
      .openOn(map);
  };

  return (
    <div id="map-container" style={{ height: '400px' }}></div> 
  );
}

export default UVLevelsMap;
