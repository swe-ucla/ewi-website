import React from "react";
import { Link } from "react-router-dom";
import HomeCountdown from "./HomeCountdown";
import homepageHeader from "../../assets/home-2026/homepage-header.svg";
import "./HomeHero.css";

const scrollToTop = () => window.scrollTo(0, 0);

const HomeHero = () => {
  return (
    <header className="home-hero">
      <div className="home-hero__stage">
        <img
          className="home-hero__art"
          src={homepageHeader}
          alt=""
          width={1440}
          height={1316}
          decoding="async"
        />
        <h1 className="home-hero__sr-title">
          evening with industry 50 — harvest your potential
        </h1>

        <div className="home-hero__overlay">
          <nav className="home-hero__actions" aria-label="Audience pages">
            <Link
              to="/companies"
              onClick={scrollToTop}
              className="home-hero__button"
            >
              For Companies
            </Link>
            <Link
              to="/students"
              onClick={scrollToTop}
              className="home-hero__button"
            >
              For Students
            </Link>
          </nav>
          <HomeCountdown />
        </div>
      </div>
    </header>
  );
};

export default HomeHero;
