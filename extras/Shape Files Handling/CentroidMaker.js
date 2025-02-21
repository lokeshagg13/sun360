const { featureEach } = require("@turf/meta");
const { polygon } = require("@turf/helpers");
const centroid = require("@turf/centroid").default;
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

// Read GeoJSON data from file
const geojsonData = JSON.parse(fs.readFileSync("Victoria.json", "utf8"));

// Array to store centroids
const centroids = [];

// Iterate through each feature
featureEach(geojsonData, function (feature) {
    console.log(feature.geometry.coordinates[0][0].length)
//   if (feature.geometry.coordinates.length < 4) return;
  // Create a Turf.js polygon from the GeoJSON feature
  const poly = polygon(feature.geometry.coordinates[0]);

  // Calculate the centroid of the polygon
  const center = centroid(poly);

  // Push the centroid coordinates along with vic_loca_2 and loc_pid into the centroids array
  centroids.push({
    vic_loca_2: feature.properties.vic_loca_2,
    loc_pid: feature.properties.loc_pid,
    centroid_lat: center.geometry.coordinates[1],
    centroid_lon: center.geometry.coordinates[0],
  });
});

// Define CSV writer options
const csvWriter = createCsvWriter({
  path: "centroids.csv",
  header: [
    { id: "vic_loca_2", title: "VIC_LOCA_2" },
    { id: "loc_pid", title: "LOC_PID" },
    { id: "centroid_lat", title: "Centroid_Latitude" },
    { id: "centroid_lon", title: "Centroid_Longitude" },
  ],
});

// Write to CSV file
csvWriter
  .writeRecords(centroids)
  .then(() => console.log("CSV file written successfully"))
  .catch((err) => console.error("Error writing CSV file:", err));
