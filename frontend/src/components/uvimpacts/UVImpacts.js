import React, { useEffect, useState } from "react";
import axios from "axios";

import "./UVImpacts.css";
import UVImpactsGraph from "./UVImpactsGraph";

const GET_UV_IMPACTS_URL =
  "http://127.0.0.1:5000/uv-impacts?age=<<age>>&gender=<<gender>>";

function getAnalysisText(gender, ageGroup, graphDataMel) {
  return `For ${
    gender === "M" ? "Male" : "Female"
  } Victorians between ${ageGroup}, the incidence counts caused by UV exposure were ${
    graphDataMel.datasets[0].data[0]
  } in ${graphDataMel.labels[0]} and ${
    graphDataMel.datasets[0].data.slice(-1)[0]
  } in ${graphDataMel.labels.slice(-1)[0]}. Mortality rates were recorded as ${
    graphDataMel.datasets[1].data[0]
  } in ${graphDataMel.labels[0]} and ${
    graphDataMel.datasets[1].data.slice(-1)[0]
  } in ${graphDataMel.labels.slice(-1)[0]}. `;
}

function UVImpacts() {
  const [age, setAge] = useState(20);
  const [gender, setGender] = useState("M");
  const [ageGroup, setAgeGroup] = useState("20-24");
  const [graphDataMel, setGraphDataMel] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (age > 116 || age < 0) {
          return () => {};
        }
        if (!["M", "F"].includes(gender)) {
          return () => {};
        }

        const response = await axios.get(
          GET_UV_IMPACTS_URL.replace("<<age>>", `${age}`).replace(
            "<<gender>>",
            gender
          )
        );
        const dataRows = response?.data?._data;
        const dataRowsMel = dataRows.filter(
          (row) => `${row.cancer_group === "Melanoma skin cancer"}`
        );
        const years_mel = dataRowsMel.map((row) => row.cancer_year);
        const incidence_values_mel = dataRowsMel.map(
          (row) => `${row.cancer_incidence_count}`
        );
        const mortality_values_mel = dataRowsMel.map(
          (row) => `${row.cancer_mortality_count}`
        );

        const formattedDataMel = {
          labels: years_mel,
          datasets: [
            {
              label: "Incidence Count",
              data: incidence_values_mel,
              borderColor: "rgba(255, 99, 132, 0.6)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
            },
            {
              label: "Mortality Count",
              data: mortality_values_mel,
              borderColor: "rgba(54, 162, 235, 0.6)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
            },
          ],
        };

        setGraphDataMel(formattedDataMel);
        setAgeGroup(dataRows[0].cancer_age_group);
      } catch (error) {
        console.log(error);
        setGraphDataMel(null);
        setAgeGroup("");
      }
    }
    fetchData();
  }, [age, gender]);

  return (
    <>
      <h1>UV Impacts</h1>
      <div className="input-row">
        <div className="input-age">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            name="age"
            id="age"
            min={1}
            value={age}
            onChange={(e) => {
              if (e.target.value === "") setAge(0);
              if (e.target.value < 0 || e.target.value > 116) return;
              setAge(e.target.value);
            }}
          />
        </div>
        <div className="input-gender">
          <label htmlFor="gender">Gender</label>
          <select
            name="gender"
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>
      </div>
      <div className="graph">
        {graphDataMel && (
          <UVImpactsGraph
            id="melanoma"
            graphData={graphDataMel}
            graphTitle={`Mortality and incidence rates for ${
              gender === "M" ? "male" : "female"
            } aged ${ageGroup}`}
            graphAnalysis={getAnalysisText(gender, ageGroup, graphDataMel)}
          />
        )}
      </div>
      {/* <UVImpactsGraph
        id="non-melanoma"
        age={age}
        gender={gender}
        ageGroup={ageGroup}
        graphData={graphDataNonMel}
      /> */}
    </>
  );
}

export default UVImpacts;
