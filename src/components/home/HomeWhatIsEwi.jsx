import React from "react";
import HomeSection from "./HomeSection";
import HomeFeatureBlurb from "./HomeFeatureBlurb";
import networkingPhoto from "../../assets/home-2026/what-is-networking.jpg";
import dinnerPhoto from "../../assets/home-2026/what-is-dinner.jpg";
import careerFairPhoto from "../../assets/home-2026/what-is-career-fair.jpg";
import "./HomeWhatIsEwi.css";

const blurbs = [
  {
    id: 1,
    title: "networking",
    image: networkingPhoto,
    imageAlt: "Students networking together at EWI",
    blurb:
      "Connect with companies through informal networking and a traditional career fair portion of the evening.",
  },
  {
    id: 2,
    title: "dinner conversations",
    image: dinnerPhoto,
    imageAlt: "Students seated with recruiters at the EWI dinner",
    blurb:
      "Six to eight students sit with company representatives for unscripted dinner conversations, not just a typical resume drop",
  },
  {
    id: 3,
    title: "career fair",
    image: careerFairPhoto,
    imageAlt: "Students with company representatives at the EWI career fair",
    blurb:
      "Attending companies table in a formal career fair to allow students to talk to all representatives and explore different opportunities.",
  },
];

const HomeWhatIsEwi = () => {
  return (
    <HomeSection title="what is ewi?" className="home-what">
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
