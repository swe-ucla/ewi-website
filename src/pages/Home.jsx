import React from "react";
import Header from "../components/header/Header";
import Attend from "../components/attend/attend";
import Timer from "../components/timer/Timer";
import Carousel from "../components/carousel/Carousel";
import EventsSection from "../components/eventsSection/EventsSection.tsx";
import GoogleMap from "../components/googleMap/GoogleMap";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <Header />
      <Attend />
      <Carousel />
      <EventsSection />
      <GoogleMap />
    </div>
  );
};

export default Home;
