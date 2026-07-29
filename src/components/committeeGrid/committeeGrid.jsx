import React from "react";
import "./committeeGrid.css";
import PeopleCard from "../peopleCard/PeopleCard";
import KHANH from "../../assets/Khanh_EWIHeadshot.jpg";
import JACQUELINE from "../../assets/Jacqueline_EWIHeadshot.jpg";
import JEIA from "../../assets/Jeia_EWIHeadshot.jpg";
import JOLENE from "../../assets/Jolene_EWIHeadshot.jpg";
import LILLIAN from "../../assets/Lillian_EWIHeadshot.JPG";
import SUSIE from "../../assets/Susie_EWIHeadshot.jpeg";
import CLARISSE from "../../assets/Clarisse_EWIHeadshot.jpg";
import APARNA from "../../assets/Aparna_EWIHeadshot.JPG";

const teamData = [
  {
    id: 1,
    image: KHANH,
    name: "Khanh Tran",
    position: "Internal Director",
    year: "3rd Year",
    major: "Bioengineering",
    description:
      "Khanh is a third year student at UCLA studying Bioengineering and currently serves as the Internal Director for SWE@UCLA's Evening with Industry Committee. Outside of SWE, she is also an Undergraduate Researcher at Dr. Yang's Immunoengineering Lab and the Research Team Project Manager in the Biomedical Engineering Society (BMES@UCLA). In her spare time, she enjoys singing with her a cappella group at UCLA! Previously, she has also been the Logistics and Student Liaison Chair, developing EWI 2025 and 2024, respectively.",
    linkedInURL: "https://www.linkedin.com/in/khanh-b-tran/",
  },
  {
    id: 2,
    image: LILLIAN,
    name: "Lillian Gonick",
    position: "External Director",
    year: "3rd Year",
    major: "Linguistics and Computer Science",
    description:
      "Lillian is majoring in Linguistics and Computer Science and minoring in Data Science Engineering. She currently serves as the External Director for EWI 2025. In addition to SWE@UCLA, Lillian is involved with ACM Hack and the Vietnamese Student Union. She is pursuing a career as a Software Engineer. Previously, she served as the Corporate Relations Chair for EWI 2024.",
    linkedInURL: "https://www.linkedin.com/in/lilliangonick/",
  },
  {
    id: 3,
    image: SUSIE,
    name: "Susie Kim",
    position: "Logistics Chair",
    year: "2nd Year",
    major: "Computer Science",
    description:
      "Susie is a second year computer science student and is serving as the logistics chair for EWI 2025. She contributes to building internal tools as a software engineer for the Daily Bruin and is involved in building full-stack applications for LA Blueprint. She is passionate about integrating and advancing technology into an accessible tool for everyone. She has previously served as the Student Liaison Chair for EWI 2025.",
    linkedInURL: "https://www.linkedin.com/in/susiekim101/",
  },
  {
    id: 4,
    image: JEIA,
    name: "Jeia So",
    position: "Design and Media Chair",
    year: "2nd Year",
    major: "Mechanical Engineering",
    description:
      "Jeia is a second year studying Mechanical Engineering and she is the Design and Media Chair for EWI 2026! She has been involved with undergraduate research as part of the Mechanics of Soft Materials Lab, and an instructor for the drones E1 class on campus. She hopes to pursue a career in robotics or bionics. In her free time, she enjoys drawing, dancing, and looking for new food spots.",
    linkedInURL: "https://www.linkedin.com/in/jeiaso/",
  },
  {
    id: 5,
    image: CLARISSE,
    name: "Clarisse Kim",
    position: "Corporate Relations Chair",
    year: "1st Year",
    major: "Mechanical Engineering",
    description:
      "Clarisse is a first-year mechanical engineering major and the Corporate Relations Chair for EWI 2025. She has been involved with Design Build Fly @UCLA and ASME and hopes to pursue a career in product design or consulting. When she isn't hunched over her laptop, she can be found eating her weight in MadeGood granola bars or playing (though mainly losing) at claw machines. She's excited to contribute to the EWI committee!",
    linkedInURL: "https://www.linkedin.com/in/clarisse-kim/",
  },
  {
    id: 6,
    image: JOLENE,
    name: "Jolene Young",
    position: "Student Liaison",
    year: "2nd Year",
    major: "Materials Engineering",
    description:
      "Jolene is a second year student studying Materials Engineering and is the Student Liaison for EWI 2026. She has also been involved with Materials Research Society (MRS) and American Society of Civil Engineers (ASCE), and hopes to create innovative materials and designs that promote sustainability in products and built environments. Outside of academics, she is on Samahang Modern and enjoys trying new cafes and restaurants.",
    linkedInURL: "https://linkedin.com/in/jolene-young",
  },
  {
    id: 7,
    image: JACQUELINE,
    name: "Jacqueline Vargas",
    position: "Professional Development Chair",
    year: "3rd Year",
    major: "Chemical Engineering",
    description:
      "Jacqueline is a third-year student studying chemical engineering and is the professional development chair for EWI 2026. She has been involved with Special Olympics, American Institute of Chemical Engineers, and Society of Latin Engineers, and hopes to pursue a career in the energy sector. In her spare time, she enjoys puzzles, listening to music, and scrapbooking.",
    linkedInURL: "https://www.linkedin.com/in/jacquelinekvargas/",
  },
  {
    id: 8,
    image: APARNA,
    name: "Aparna Petluri",
    position: "Publicity Chair",
    year: "3rd Year",
    major: "Data Theory",
    description:
      "Aparna Petluri is a third year student studying Data Theory, and is the Publicity Chair for EWI 2025. She is currently also involved in UCLA's DATARes through DataBlog, and hopes to pursue a career as a statistician. In her spare time, she enjoys reading, going to the gym, and spending time with friends.",
    linkedInURL: "https://www.linkedin.com/in/aparna-petluri-7b4479242/",
  },
];

const DIRECTOR_NAMES = new Set(["Khanh Tran", "Lillian Gonick"]);

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
