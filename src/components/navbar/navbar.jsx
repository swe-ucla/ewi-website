import React, { useState, useEffect } from "react";
import "./navbar.css";
import LOGO from "../../assets/ewi_logo_2026.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const checkbox = document.getElementById("side-menu");
    if (checkbox) {
      checkbox.checked = isMenuOpen;
    }
    
    // Close menu on escape key
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  return (
    <div className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={LOGO} alt={"logo"} />
        </Link>
      </div>

      {/* mini menu */}
      <input 
        className="side-menu" 
        type="checkbox" 
        id="side-menu" 
        checked={isMenuOpen}
        onChange={handleMenuToggle}
      />
      <label className="hamb" htmlFor="side-menu">
        <span className="hamb-line"></span>
      </label>

      {/* Backdrop overlay */}
      {isMenuOpen && (
        <div 
          className="menu-backdrop" 
          onClick={handleMenuToggle}
        ></div>
      )}

      {/* full size navbar */}
      <div className="tabs">
        <Link className="tab" to="/home" onClick={handleLinkClick}>
          HOME
        </Link>
        <Link className="tab" to="/students" onClick={handleLinkClick}>
          STUDENTS
        </Link>
        <Link className="tab" to="/companies" onClick={handleLinkClick}>
          COMPANIES
        </Link>
        <Link className="tab" to="/meet-the-team" onClick={handleLinkClick}>
          MEET THE TEAM
        </Link>
        <Link className="tab" to="/contact-us" onClick={handleLinkClick}>
          CONTACT US
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
