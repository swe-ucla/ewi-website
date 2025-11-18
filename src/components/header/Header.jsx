import React from "react";
import { Link } from "react-router-dom";
import "./header.css";
import hero_text from "../../assets/hero_text.svg";

const Header = () => {
  return (
    <header className="hero">
      <img src={hero_text} className="hero-text" alt="Hero text" />

      <div className="hero-buttons">
        <Link to="/student">
          <button>FOR STUDENTS</button>
        </Link>
        <Link to="/company">
          <button>FOR COMPANIES</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
