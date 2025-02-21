import React, { useState } from "react";
import "./Home.css";
// import ChoroplethMap from "./uvlevels/ChoroplethMap";

function Home() {
  const [isToggled, setIsToggled] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date().toDateString());
  const handleChange = () => {
    setIsToggled(!isToggled);
  };

  return (
    <div className="home-main">
      <h5>
        <i>
          <center>
            Sun360 is the innovative web application to protect you and your
            family from harmful sun damage in Victoria, Australia.
          </center>
        </i>
      </h5>
      <div className="map-line">
        <div className="toggle-button-container" onClick={handleChange}>
          <button
            onClick={handleChange}
            className={`toggle-button ${isToggled ? "on" : "off"}`}
            aria-label="Toggle button"
          >
            {isToggled ? "UV" : "HI"}
          </button>
        </div>

        <h4>{currentDate} Live</h4>
      </div>

      {/* <ChoroplethMap /> */}
    </div>
  );
}

export default Home;
