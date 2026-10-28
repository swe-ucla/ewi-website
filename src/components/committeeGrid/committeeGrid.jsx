import React from "react";
import "./committeeGrid.css";
import PeopleCard from "../peopleCard/PeopleCard";
import JEIA from "../../assets/JeiaSoHeadshot.jpg";
import LILLIAN from "../../assets/LillianGonickHeadshot.JPG";
import GEORGIA from "../../assets/GeorgiaCraneHeadshot.jpg";
import CAROL from "../../assets/placeholder.png";
import PRIYANKA from "../../assets/placeholder.png";
import FIA from "../../assets/placeholder.png";
import FIONA from "../../assets/placeholder.png";

const teamData = [
  {
    id: 1,
    image: JEIA,
    name: "Jeia So",
    position: "External Director",
    year: "4th Year",
    major: "Mechanical Engineering",
    description:
      "Jeia is a fourth year student at UCLA studying Mechanical Engineering and currently serves as the External Director for SWE@UCLA's Evening with Industry Committee. She has been involved with undergraduate research as part of the Mechanics of Soft Materials Lab, and an instructor for the drones E1 class on campus. She hopes to pursue a career in robotics or bionics. In her free time, she enjoys drawing, dancing, and looking for new food spots.",
    linkedInURL: "https://www.linkedin.com/in/jeiaso/",
  },
  {
    id: 2,
    image: LILLIAN,
    name: "Lillian Gonick",
    position: "Internal Director",
    year: "4th Year",
    major: "Linguistics and Computer Science",
    description:
      "Lillian is majoring in Linguistics and Computer Science and minoring in Data Science Engineering. She currently serves as the Internal Director for EWI 2025. In addition to SWE@UCLA, Lillian is involved with ACM Hack and the Vietnamese Student Union. She is pursuing a career as a Software Engineer. Previously, she served as the Corporate Relations Chair for EWI 2024 and the External Director for EWI 2025.",
    linkedInURL: "https://www.linkedin.com/in/lilliangonick/",
  },
  {
    id: 3,
    image: GEORGIA,
    name: "Georgia Crane",
    position: "Professional Development Chair",
    year: "3rd Year",
    major: "Chemical & Biomolecular Engineering",
    description:
      "Georgia is majoring in Chemical & Biomolecular Engineering. She currently serves as the Professional Development Chair for EWI 50. In addition to SWE@UCLA, Georgia is involved with BMES Cell Team and research at UCLA Health. She is pursuing a career in engineering and medicine.",
    linkedInURL: "http://www.linkedin.com/in/georgiacrane",
  },
  { // TODO: UPDATE
    id: 4,
    image: CAROL,
    name: "Carol Hiwatig",
    position: "Design and Media Chair",
    year: "2nd Year",
    major: "Mechanical Engineering",
    description:
      "Carol is a second year studying Mechanical Engineering and she is the Design and Media Chair for EWI 2026! ",
    linkedInURL: "https://www.linkedin.com/in/carol-hiwatig",
  },
  {
    id: 5,
    image: PRIYANKA,
    name: "Priyanka Santhosh",
    position: "Corporate Relations Chair",
    year: "2nd Year",
    major: "Mechanical Engineering",
    description:
      "Priyanka is majoring in Mechanical Engineering. She currently serves as the Corporate Relations Chair for EWI 50. In addition to SWE@UCLA, Priyanka is involved Formula SAE and Flagship Combat Robotics at ASME. She is pursuing a career as a robotics or automotive engineer.",
    linkedInURL: "https://www.linkedin.com/in/priyankasanthosh/",
  },
  {
    id: 6,
    image: FIA,
    name: "Fia Nicolaescu",
    position: "Student Liaison",
    year: "1st Year",
    major: "Electrical Engineering",
    description:
      "Fia is majoring in Electrical Engineering. She currently serves as Student Liaison. In addition to SWE@UCLA, Fia is involved in Nova, IEEE, and Backpacking Club. She is pursuing a career in Electrical Engineering. This is her first year on the EWI committee.",
    linkedInURL: "https://www.linkedin.com/in/fia-nicolaescu-37baa3294/",
  },
  {
    id: 7,
    image: FIONA,
    name: "Fiona Szeto",
    position: "Publicity Chair",
    year: "2nd Year",
    major: "Bioengineering",
    description:
      "Fiona is majoring in Bioengineering. She currently serves as the Publicity Chair for EWI 50. In addition to SWE@UCLA, Fiona is involved with BMES Community Outreach and Research Team. She is pursuing a career in engineering and medicine.",
    linkedInURL: "http://www.linkedin.com/in/fiona-szeto",
  },
];

const DIRECTOR_NAMES = new Set(["Jeia So", "Lillian Gonick"]);

const CommitteeGrid = () => {
  const directors = teamData.filter((person) => DIRECTOR_NAMES.has(person.name));
  const chairs = teamData.filter((person) => !DIRECTOR_NAMES.has(person.name));

  return (
    <section id="meet-the-team" className="committee-grid">
      <header className="committee-grid__header">
        <div className="committee-grid__header-content">
          <h1 className="committee-grid__title">Meet the Team</h1>
        </div>
      </header>

      <div className="container committee-grid__content">
        <div className="committee-grid__section">
          <h2 className="committee-grid__subtitle">Directors</h2>
          <div className="committee-grid__cards committee-grid__cards--directors">
            {directors.map(
              ({ id, image, name, position, description, year, major, linkedInURL }) => (
                <PeopleCard
                  key={id}
                  image={image}
                  name={name}
                  position={position}
                  description={description}
                  year={year}
                  major={major}
                  linkedInURL={linkedInURL}
                />
              )
            )}
          </div>
        </div>

        <div className="committee-grid__section">
          <h2 className="committee-grid__subtitle">Chairs</h2>
          <div className="committee-grid__cards committee-grid__cards--chairs">
            {chairs.map(
              ({ id, image, name, position, description, year, major, linkedInURL }) => (
                <PeopleCard
                  key={id}
                  image={image}
                  name={name}
                  position={position}
                  description={description}
                  year={year}
                  major={major}
                  linkedInURL={linkedInURL}
                />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommitteeGrid;
