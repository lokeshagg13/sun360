// LoginPage.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import useAuth from "../../hooks/useAuth";

import "./Login.css";

const LOGIN_URL = "http://127.0.0.1:5000/login";

function Login() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState(null);
  const [loginRemarks, setLoginRemarks] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoginStatus('p');
      setLoginRemarks("Logging in");
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({
          users_email: email,
          users_password: password,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          withCredentials: true,
        }
      );

      // Get access token and set auth global context to contain email and access token so that it can be used all over the app
      const accessToken = response?.data?.access_token;
      const accessID = response?.data?.access_id;
      setAuth({ accessID, accessToken });

      // Clear input fields
      setEmail("");
      setPassword("");

      // Navigate to search page on successful login
      navigate("/", { replace: true });
    } catch (error) {
      // Handling different login issues
      setLoginStatus('e');
      if (!error?.response) {
        setLoginRemarks("No server response.");
      } else if (error.response?.status === 401) {
        setLoginRemarks("Invalid credentials.");
      } else {
        setLoginRemarks("Login failed. Please try again later/");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {loginStatus === 'p' && <p className="pending-message">{loginRemarks}</p>}
      {loginStatus === 'e' && <p className="error-message">{loginRemarks}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-row">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-row">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
          />
        </div>

        <button type="submit" className="login-btn">
          Login
        </button>
      </form>

      <p>
        Not a user? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
