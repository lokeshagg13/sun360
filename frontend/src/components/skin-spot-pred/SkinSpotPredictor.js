import React, { useState } from "react";
import axios from "axios";

// Make sure to set your server URL correctly
const SERVER_URL = "http://localhost:5000";

function SkinSpotPredictor() {
  const [imageFile, setImageFile] = useState(null);
  const [prediction, setPrediction] = useState("");

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
    setPrediction(""); // Clear existing prediction
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axios.post(
        `${SERVER_URL}/predict_image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error:", error);
      setPrediction("An error occurred during prediction.");
    }
  };

  return (
    <div>
      <h1>Skin Spot Prediction</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Submit</button>
      </form>
      {prediction && <p>Prediction: {prediction}</p>}
      <div className="disclaimer">
        <p>
          <strong>Disclaimer:</strong> This Skin Spot Prediction tool is
          designed for informational purposes only and does not provide medical
          advice, diagnosis, or treatment. Always seek the advice of your
          physician or another qualified health provider with any questions you
          may have regarding a medical condition. Never disregard professional
          medical advice or delay seeking it because of something you have read
          or accessed through this application.
        </p>
      </div>
    </div>
  );
}

export default SkinSpotPredictor;
