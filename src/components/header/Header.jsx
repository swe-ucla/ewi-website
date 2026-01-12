import React from "react";
import { Link } from "react-router-dom";
import "./header.css";
import hero_text from "../../assets/hero_text.svg";
import Timer from "../timer/Timer";

const Header = () => {
  return (
    <header className="hero">
      <img src={hero_text} className="hero-text" alt="Hero text" />

      <div className="hero-buttons">
        <Link to="/students">
          <button>FOR STUDENTS</button>
        </Link>
        <Link to="/companies">
          <button>FOR COMPANIES</button>
        </Link>
      </div>
      
      <Timer />
    </header>
  );
};

export default Header;
