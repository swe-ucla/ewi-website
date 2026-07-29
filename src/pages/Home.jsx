import React from "react";
import HomeHero from "../components/home/HomeHero";
import HomeCountdown from "../components/home/HomeCountdown";
import HomeWhatIsEwi from "../components/home/HomeWhatIsEwi";
import HomeEvents from "../components/home/HomeEvents";
import HomeTestimonials from "../components/home/HomeTestimonials";
import HomeCompanies from "../components/home/HomeCompanies";
import "./Home.css";

const Home = () => {
  return (
    <main className="home">
      <HomeHero />
      <HomeCountdown />
      <HomeWhatIsEwi />
      <HomeEvents />
      <HomeTestimonials />
      <HomeCompanies />
    </main>
  );
};

export default Home;
