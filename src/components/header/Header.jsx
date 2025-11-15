import React from "react";
import "./header.css";
import hero_text from "../../assets/hero_text.svg";

const Header = () => {
  return (
    <header className="hero">
      <img src={hero_text} className="hero-text" alt="Hero text" />

      <div className="hero-buttons">
        <button>FOR STUDENTS</button>
        <button>FOR COMPANIES</button>
      </div>
    </header>
  );
};

export default Header;
