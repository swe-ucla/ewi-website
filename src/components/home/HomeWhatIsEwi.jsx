import React from "react";
import HomeSection from "./HomeSection";
import HomeFeatureBlurb from "./HomeFeatureBlurb";
import ewiEvent from "../../assets/ewi_2024.png";
import "./HomeWhatIsEwi.css";

const blurbs = [
  {
    id: 1,
    title: "Networking",
    image: ewiEvent,
    imageAlt: "EWI networking",
    blurb:
      "Connect with companies through informal networking and a traditional career fair portion of the evening.",
  },
  {
    id: 2,
    title: "Dinner conversations",
    image: ewiEvent,
    imageAlt: "EWI dinner",
    blurb:
      "Six to eight students sit with company representatives for unscripted dinner conversations, not a typical resume drop.",
  },
  {
    id: 3,
    title: "Evening with Industry",
    image: ewiEvent,
    imageAlt: "EWI event",
    blurb:
      "SWE's flagship UCLA networking event: appetizers, a multi-course dinner, and time to meet recruiters in one night.",
  },
];

const HomeWhatIsEwi = () => {
  return (
    <HomeSection title="What is EWI?">
      <div className="home-what-is-ewi__grid">
        {blurbs.map((item) => (
          <HomeFeatureBlurb
            key={item.id}
            title={item.title}
            image={item.image}
            imageAlt={item.imageAlt}
            blurb={item.blurb}
          />
        ))}
      </div>
    </HomeSection>
  );
};

export default HomeWhatIsEwi;
