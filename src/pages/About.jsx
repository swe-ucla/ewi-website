import React from "react";
import Header from "../components/header/Header";

import About from "../components/about/About";
import Attend from "../components/attend/attend";

import Portfolio from "../components/portfolio/Portfolio";
import Contact from "../components/contact/Contact";

import Committee from "../components/committee/Committee";

const Home = () => {
  return (
    <div className="home">
      <Header />
      <Attend />
      {/*<Nav />*/}
      <About />
      <Portfolio />
      <Committee />
      <Contact />
    </div>
  );
};

export default Home;
