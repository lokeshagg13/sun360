import React from "react";

import "./Recomm.css";

function Recomm(props) {
  return (
    <div className="recomm-row">
      <div className={`recomm-box ${props.color}`}></div>
      <div className="recomm-text">
        <span className="uv">{props.uv}: </span>
        <span className="text">{props.text}</span>
      </div>
    </div>
  );
}

export default Recomm;
