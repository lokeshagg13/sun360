import React, { useState } from "react";
import axios from "axios";

import useAuth from "../hooks/useAuth";
import "./Home.css";
import SearchIcon from "./basic-ui/icons/SearchIcon";
import Loader from "./basic-ui/elements/Loader";
import ReminderHomeList from "./reminders/ReminderHomeList";
// import ChoroplethMap from "./uvlevels/ChoroplethMap";

const GET_SUBURBS_URL =
  "http://127.0.0.1:5000/suburbs/<<postcode>>";
const GET_RECORDS_URL =
  "http://127.0.0.1:5000/suburbs/<<postcode>>/record";

function Home() {
  const { auth } = useAuth();
  const [currentDate, _] = useState(new Date().toDateString());
  const [postcode, setPostcode] = useState("");
  const [searchStatus, setSearchStatus] = useState(null);
  const [suburbs, setSuburbs] = useState(null);
  const [selectedSuburb, setSelectedSuburb] = useState("");
  const [dataStatus, setDataStatus] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  const handleSearch = async () => {
    try {
      setSearchStatus("p");
      setSelectedSuburb(null);
      const response = await axios.get(
        GET_SUBURBS_URL.replace("<<postcode>>", postcode)
      );
      setSearchStatus("s");
      setSuburbs(response?.data?.suburbs);
    } catch (error) {
      console.error("Error fetching suburbs:", error);
      setSearchStatus("e");
      setSuburbs([]);
    }
  };

  const handleSuburbClick = async (suburbName) => {
    try {
      setDataStatus("p");
      setSelectedSuburb(null);
      setSuburbs([]);
      const response = await axios.get(
        GET_RECORDS_URL.replace("<<postcode>>", postcode)
      );
      const data = response?.data;
      data.temperature = Math.round(data.temperature);
      setDataStatus("s");
      setSelectedSuburb(suburbName);
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setDataStatus("e");
      setWeatherData(null);
    }
  };

  return (
    <div className="home-main">
      <div className="logo">
        <img src="/images/logo.png" alt="Sun 360" />
        <h5>
          Protecting you and your family from harmful sun damage in <b>Victoria, Australia</b>.
        </h5>
      </div>

      <div className="postcode-search">
        <label htmlFor="postcode">UV Parameters of any location</label>
        <div className="postcode-row">
          <input
            type="text"
            id="postcode"
            name="postcode"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="Enter postcode here"
          />
          <button onClick={handleSearch}>
            <SearchIcon />
          </button>
        </div>
      </div>

      {(searchStatus === "p" || dataStatus === "p") && (
        <div>
          <Loader />
        </div>
      )}
      {searchStatus !== "p" &&
        dataStatus !== "p" &&
        selectedSuburb === null &&
        suburbs &&
        suburbs.length === 0 && <p>No Suburbs Found</p>}

      {searchStatus !== "p" && suburbs && (
        <div className="suburbs-box">
          {suburbs.map((suburb, index) => (
            <div className="suburb-list" key={index}>
              <button onClick={() => handleSuburbClick(suburb)}>
                {suburb}
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedSuburb && weatherData && (
        <div className="weather-data">
          <div className="date-line">
            <h4>Weather Data ({currentDate} Live)</h4>
          </div>
          <div className="source-div">
            <a
              className="source"
              href="https://openweathermap.org/api/one-call-api"
            >
              Source: Open Weather API
            </a>
          </div>

          <div className="data-row">
            <span className="label">SUBURB</span>
            <span className="value">{selectedSuburb}</span>
          </div>
          <div className="data-row">
            <span className="label">TEMPERATURE</span>
            <span className="value">{weatherData.temperature}°C</span>
          </div>
          <div className="data-row">
            <span className="label">UV INDEX</span>
            <span className="value">{weatherData.uvi}</span>
          </div>
        </div>
      )}
      {/* <ChoroplethMap /> */}
      {(!auth?.accessID || !auth?.accessToken) && (
        <>
          <div className="source-div">
            <a
              className="source"
              href="https://www.generationsunsmart.com.au/resources/poster-when-to-protect-yourself-from-uv/"
            >
              Source: Generation SunSmart
            </a>
          </div>
          <div className="home-image">
            <img src="/images/clothing.jpeg" alt="Description of the image" />
          </div>
        </>
      )}
      {auth?.accessID && auth?.accessToken && <ReminderHomeList />}
    </div>
  );
}

export default Home;
