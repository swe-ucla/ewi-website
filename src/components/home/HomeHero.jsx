import React from "react";
import { Link } from "react-router-dom";
import "./HomeHero.css";

const scrollToTop = () => window.scrollTo(0, 0);

const HomeHero = () => {
  return (
    <header className="home-hero">
      <h1 className="home-hero__title">EWI 50</h1>
      <p className="home-hero__subtitle">Evening with Industry</p>
      <nav className="home-hero__actions" aria-label="Audience pages">
        <Link
          to="/companies"
          onClick={scrollToTop}
          className="home-hero__button home-wire-box"
        >
          For Companies
        </Link>
        <Link
          to="/students"
          onClick={scrollToTop}
          className="home-hero__button home-wire-box"
        >
          For Students
        </Link>
      </nav>
    </header>
  );
};

export default HomeHero;
