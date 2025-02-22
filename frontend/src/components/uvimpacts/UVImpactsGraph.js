import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import "./UVImpactsGraph.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function UVImpactsGraph(props) {
  const { graphData, graphTitle, graphAnalysis } = props;
  return (
    <>
      <div className="graph-inner">
        <Line
          data={graphData}
          width={370}
          height={300}
          options={{
            height: 500,
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Year",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Count",
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: "top", // Position the legend at the top
                align: "start", // Align the legend to the start of the position (left)
                labels: {
                  boxWidth: 10, // Width of legend box
                  usePointStyle: true, // Use point style for legend items
                  padding: 20, // Padding between legend items
                  align: "start", // Align legend items to the start (left)
                  display: "vertical", // Display legend items vertically
                },
              },
              title: {
                display: true,
                text: `${graphTitle}`,
                font: {
                  size: 16,
                },
              },
            },
          }}
        />
      </div>
      <div className="source-div">
        <a
          className="source"
          href="https://www.google.com/url?q=https://www.aihw.gov.au/getmedia/e8779760-1b3c-4c2e-a6c2-b0a8d764c66b/AIHW-CAN-122-CDiA-2021-Book-1a-Cancer-incidence-age-standardised-rates-5-year-age-groups.xlsx.aspx&sa=D&source=apps-viewer-frontend&ust=1710438466470891&usg=AOvVaw1_D6q7O1ZWsAXDirk3QotR&hl=en-GB"
        >
          Source: Australian Institute of Health and Welfare Incidence
        </a>
      </div>

      <div className="analysis">
        <p>{graphAnalysis}</p>
      </div>
    </>
  );
}

export default UVImpactsGraph;
