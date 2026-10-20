import React from "react";
import HomeHero from "../components/home/HomeHero";
import HomeWhatIsEwi from "../components/home/HomeWhatIsEwi";
import HomeEvents from "../components/home/HomeEvents";
import HomeTestimonials from "../components/home/HomeTestimonials";
import HomeCompanies from "../components/home/HomeCompanies";
import "./Home.css";

const Home = () => {
  return (
    <main className="home">
      <div className="home-top">
        <HomeHero />
      </div>
      <HomeWhatIsEwi />
      <HomeEvents />
      <div className="home-cream-band">
        <HomeTestimonials />
        <HomeCompanies />
      </div>
    </main>
  );
};

export default Home;
