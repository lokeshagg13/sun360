import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const handleLogout = () => {
    setAuth({});
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-yellow">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          SUN360
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/uv-impacts" className="nav-link">
                UV Impact
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/clothing" className="nav-link">
                Clothing
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/reminders" className="nav-link">
                Reminders
              </Link>
            </li>
          </ul>
          <button
            className="btn btn-outline-primary"
            onClick={() =>
              auth?.accessID && auth?.accessToken
                ? handleLogout()
                : navigate("/login")
            }
          >
            {auth?.accessID && auth?.accessToken ? "Log out" : "Log in"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
