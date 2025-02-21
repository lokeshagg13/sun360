import React from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import victoriaData from "./victoria.json"; // GeoJSON data for Victoria

let total = 0;
const ChoroplethMap = () => {
  // Function to style each feature in the GeoJSON
  const styleFeature = (feature) => {
    console.log(feature);
    total += 1;
    console.log(total);
    return {
      fillColor: getColor(feature.properties.density),
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: 1,
    };
  };

  // Function to assign color based on population density
  const getColor = (density) => {
    return density > 1000
      ? "#800026"
      : density > 500
      ? "#BD0026"
      : density > 200
      ? "#E31A1C"
      : density > 100
      ? "#FC4E2A"
      : density > 50
      ? "#FD8D3C"
      : density > 20
      ? "#FEB24C"
      : density > 10
      ? "#FED976"
      : "#FFEDA0";
  };

  // Function to bind popups to each feature
  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(
        feature.properties.name + ": " + feature.properties.density
      );
    }
  };

  return (
    <MapContainer
      center={[-37.814, 144.963]}
      zoom={7}
      style={{ height: "600px" }}
    >
      <GeoJSON
        data={victoriaData}
        style={styleFeature}
        onEachFeature={onEachFeature}
      />
    </MapContainer>
  );
};

export default ChoroplethMap;
