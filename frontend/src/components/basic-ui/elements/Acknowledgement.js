// Navbar.js
import React from "react";
import "./Acknowledgement.css";

function Acknowledgement() {
  return (
    <div className="acknow-row">
      <div className="flags">
        <div className="flag-1">
          <img src="/images/aboriginal.jpeg" alt="The Aboriginal Flag" />
        </div>
        <div className="flag-2">
          <img src="/images/torres.jpeg" alt="The Torres Strait Islander Flag" />
        </div>
      </div>
      <div className="text">
        <p>
          Sun360 acknowledges the Peoples of the Kulin Nations and recognises
          their continuing connection to the land and waterways on which Sun360
          conducts businesses and collects information and data. We pay respects
          to their Elders, past and present.
        </p>
      </div>
    </div>
    
);
}

export default Acknowledgement;
