import React from "react";
import "./Clothing.css";
import Recomm from "./Recomm";

function Clothing() {
  const recomm_texts = [
    {
      color: "green",
      uv: "UV Index 0-2",
      text: "Minimal danger for the average person, but people with very sensitive skin and infants should always be protected from prolonged sun exposure.",
    },
    {
      color: "yellow",
      uv: "UV Index 3-5",
      text: "Low risk of harm from unprotected sun exposure. Wearing a hat with a wide brim and sunglasses will protect your eyes. Wear long-sleeved shirts when outdoors.",
    },
    {
      color: "darkyellow",
      uv: "UV Index 6-7",
      text: "Moderate risk of harm from unprotected sun exposure. Wearing a hat with a wide brim and sunglasses will protect your eyes. Wear long-sleeved shirts when outdoors. Protect sensitive areas like the nose and the rims of the ears.",
    },
    {
      color: "red",
      uv: "UV Index 8-10",
      text: "High risk of harm from unprotected sun exposure. Wear protective clothing and sunglasses to protect the eyes. Wear long-sleeved shirts and trousers made from tightly-woven fabrics. UV rays can pass through the holes and spaces of loosely knit fabrics.",
    },
    {
      color: "purple",
      uv: "UV Index of 11+",
      text: "Very high risk of harm from unprotected sun exposure. Avoid being in the sun as much as possible and wear sunglasses that block out 99-100% of all UV rays (UVA and UVB). Wear a hat with a wide brim which will block roughly 50% of UV radiation from reaching the eyes.",
    },
  ];
  return (
    <div className="clothing-main">
      <h2>Clothing Recommendation</h2>
      <div className="source-div">
        <a
          className="source"
          href="https://www.generationsunsmart.com.au/resources/poster-when-to-protect-yourself-from-uv/"
        >
          Source:  Generation SunSmart
        </a>
      </div>
      <div className="clothing-image">
        <img src="/images/clothing.jpeg" alt="Description of the image" />
      </div>
      <div className="source-div">
        <a
          className="source"
          href="https://www.aimatmelanoma.org/melanoma-101/prevention/what-is-ultraviolet-uv-radiation/"
        >
          Source:  AIM at Melanoma
        </a>
      </div>
      <div className="recomm-info">
        {recomm_texts.map((recomm_text, index) => (
          <Recomm
            key={index}
            color={recomm_text.color}
            uv={recomm_text.uv}
            text={recomm_text.text}
          />
        ))}
      </div>
    </div>
  );
}

export default Clothing;
