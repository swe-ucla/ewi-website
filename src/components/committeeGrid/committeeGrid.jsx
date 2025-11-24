import React from "react";
import "./committeeGrid.css";
import PeopleCard from "../peopleCard/PeopleCard";
import KHANH from "../../assets/KhanhTran_Headshot.jpg";
import JOCELYN from "../../assets/JocelynBarrera_Headshot.png";
import JULIA from "../../assets/JuliaChen_Headshot.JPG";
import LAVENDER from "../../assets/LavenderHwang_Headshot.JPG";
import FIONA from "../../assets/FionaPeng_Headshot.jpg";
import SUSIE from "../../assets/SusieKIm_Headshot.JPG";

const teamData = [
  {
    id: 1,
    image: KHANH,
    name: "Khanh Tran",
    position: "Logistics Chair",
    year: "Test Year",
    major: "Test Major",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 2,
    image: JOCELYN,
    name: "Jocelyn Barrera",
    position: "Professional Development Chair",
    year: "Test Year",
    major: "Test Major",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 3,
    image: JULIA,
    name: "Julia Chen",
    position: "Design & Media Chair",
    year: "Test Year",
    major: "Test Major",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 4,
    image: LAVENDER,
    name: "Lavender Hwang",
    position: "Corporate Relations Chair",
    year: "Test Year",
    major: "Test Major",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 5,
    image: FIONA,
    name: "Fiona Peng",
    position: "Publicity Chair",
    year: "Test Year",
    major: "Test Major",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 6,
    image: SUSIE,
    name: "Susie Kim",
    position: "Student Liaison Chair",
    year: "Test Year",
    major: "Test Major",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

const committeeGrid = () => {
  return (
    <section id="meet-the-team">
      <h2>Meet the Team</h2>
      <div className="container meet-the-team__container">
        {teamData.map(
          ({ id, image, name, position, description, year, major }) => (
            <PeopleCard
              key={id}
              image={image}
              name={name}
              position={position}
              description={description}
              year={year}
              major={major}
            />
          )
        )}
      </div>
    </section>
  );
};

export default committeeGrid;
