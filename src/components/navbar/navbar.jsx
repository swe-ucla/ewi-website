import React from "react";
import "./navbar.css";
import LOGO from "../../assets/ewi_logo_2026.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={LOGO} alt={"logo"} />
        </Link>
      </div>

      {/* mini menu */}
      <input class="side-menu" type="checkbox" id="side-menu" />
      <label class="hamb" for="side-menu">
        <span class="hamb-line"></span>
      </label>

      {/* full size navbar */}
      <div className="tabs">
        <Link className="tab" to="/home">
          Home
        </Link>
        <Link className="tab" to="/students">
          Students
        </Link>
        <Link className="tab" to="/companies">
          Companies
        </Link>
        <Link className="tab" to="/meet-the-team">
          Meet the Team
        </Link>
        <Link className="tab" to="/contact-us">
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
