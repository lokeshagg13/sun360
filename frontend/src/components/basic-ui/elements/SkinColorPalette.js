// SkinColorPalette.js
import React from "react";
import "./SkinColorPalette.css";

function SkinColorPalette() {
  // Array of colors for the palette
  const colors = [
    "rgb(255, 215, 180)",
    "rgb(235, 195, 160)",
    "rgb(215, 175, 140)",
    "rgb(195, 155, 120)",
    "rgb(175, 135, 100)",
    "rgb(155, 115, 80)",
    "rgb(135, 95, 60)",
    "rgb(115, 75, 40)",
    "rgb(95, 55, 20)",
    "rgb(75, 35, 0)",
  ];

  return (
    <div className="skin-color-palette">
      {colors.map((color, index) => (
        <div
          key={index}
          className="palette-section"
          style={{ backgroundColor: color }}
        ></div>
      ))}
    </div>
  );
}

export default SkinColorPalette;
