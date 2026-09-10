import React, { useState, useEffect } from "react";
import "./navbar.css";
import LOGO from "../../assets/ewilogo.svg";
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

    const handleEscape = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/">
          <img src={LOGO} alt="EWI logo" />
        </Link>
      </div>

      <input
        className="navbar__menu-input"
        type="checkbox"
        id="side-menu"
        checked={isMenuOpen}
        onChange={handleMenuToggle}
      />
      <label className="navbar__menu-toggle" htmlFor="side-menu">
        <span className="navbar__menu-toggle-line"></span>
      </label>

      {isMenuOpen && (
        <div className="navbar__backdrop" onClick={handleMenuToggle}></div>
      )}

      <div className="navbar__tabs">
        <Link className="navbar__tab" to="/home" onClick={handleLinkClick}>
          Home
        </Link>
        <Link className="navbar__tab" to="/students" onClick={handleLinkClick}>
          Students
        </Link>
        <Link className="navbar__tab" to="/companies" onClick={handleLinkClick}>
          Companies
        </Link>
        <Link className="navbar__tab" to="/meet-the-team" onClick={handleLinkClick}>
          Meet the Team
        </Link>
        <Link className="navbar__tab" to="/contact-us" onClick={handleLinkClick}>
          Contact Us
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
