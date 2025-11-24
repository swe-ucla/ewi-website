import React from "react";
import Header from "../components/header/Header";
import Attend from "../components/attend/attend";
import Timer from "../components/timer/Timer";
import Carousel from "../components/carousel/Carousel";

const Home = () => {
  return (
    <div className="home">
      <Header />
      <Timer />
      <Attend />
      <Carousel />
    </div>
  );
};

export default Home;
