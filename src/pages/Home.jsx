import React from "react";
import Header from "../components/header/Header";
import Attend from "../components/attend/attend";
import Timer from "../components/timer/Timer";
import Carousel from "../components/carousel/Carousel";
import CompanyGrid from "../components/companyGrid/CompanyGrid";
import EventsSection from "../components/eventsSection/EventsSection.tsx";

const Home = () => {
  return (
    <div className="home">
      <Header />
      <Timer />
      <Attend />
      <Carousel />
      <CompanyGrid />
      <EventsSection />
    </div>
  );
};

export default Home;
