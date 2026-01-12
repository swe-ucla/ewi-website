import React from "react";
import "./CompanyGrid.css";
import CompanyFlipCard from "../companyFlipCard/CompanyFlipCard";
import BANK_OF_AMERICA_LOGO from "../../assets/company-logos/bankofamerica-logo.png";
import COMPANYGRID_FLOWER from "../../assets/companygrid-flower.svg";

// Company sponsor data
const companies = [
  {
    id: 1,
    name: "Bank of America",
    description: "Bank of America provides financial services, technology solutions, and investment products to help individuals and businesses achieve financial goals.",
    logo: BANK_OF_AMERICA_LOGO,
  },
  {
    id: 2,
    name: "City of Los Angeles Bureau of Engineering",
    description: "Designs and manages public infrastructure projects, improving streets, stormwater systems, and city facilities that serve Los Angeles communities.",
    logo: null,
  },
  {
    id: 3,
    name: "Crane",
    description: "Crane is a leading manufacturer of innovative systems and components for critical aerospace and defense applications, specializing in fluid management, sensing, and power systems.",
    logo: null,
  },
  {
    id: 4,
    name: "Disney Research Imagineering",
    description: "Disney Imagineering develops immersive attractions and interactive technologies, combining engineering and creativity to deliver memorable guest experiences.",
    logo: null,
  },
  {
    id: 5,
    name: "GHD",
    description: "GHD provides multidisciplinary engineering and environmental consulting services to deliver sustainable infrastructure and resilient, livable communities.",
    logo: null,
  },
  {
    id: 6,
    name: "Gilead Sciences",
    description: "Gilead researches and develops innovative medicines to treat serious diseases, improve patient outcomes, and advance global healthcare.",
    logo: null,
  },
  {
    id: 7,
    name: "Lockheed Martin",
    description: "Lockheed Martin designs and manufactures advanced defense and aerospace systems to support national security and global technological leadership.",
    logo: null,
  },
  {
    id: 8,
    name: "Medtronic",
    description: "Medtronic develops medical devices and therapies to improve patient health, treat chronic diseases, and advance global healthcare solutions.",
    logo: null,
  },
  {
    id: 9,
    name: "Niagara Bottling",
    description: "Niagara Bottling operates high-volume beverage manufacturing facilities, specializing in water treatment, bottling automation, quality control, and distribution systems.",
    logo: null,
  },
  {
    id: 10,
    name: "Parker Hannifin (Aerospace)",
    description: "Parker Aerospace, a division of Parker Hannifin, offers innovative technologies in flight control, hydraulics, and fuel systems for the aerospace industry.",
    logo: null,
  },
  {
    id: 11,
    name: "PPG Industries",
    description: "PPG Industries is a global leader in paints, coatings, and specialty materials, delivering innovative solutions for industrial, commercial, and consumer applications.",
    logo: null,
  },
  {
    id: 12,
    name: "Qvest",
    description: "Qvest designs media technology solutions and consulting services that streamline content production, broadcast, and digital workflows.",
    logo: null,
  },
  {
    id: 13,
    name: "Rehrig Pacific",
    description: "Rehrig Pacific manufactures reusable containers and carts to improve logistics efficiency and promote environmental sustainability across industries.",
    logo: null,
  },
  {
    id: 14,
    name: "Relativity Space",
    description: "Relativity Space uses additive manufacturing and robotics to build rockets faster, aiming to transform aerospace production and space access.",
    logo: null,
  },
  {
    id: 15,
    name: "Siemens Digital Industries Software",
    description: "Creates engineering and manufacturing software that helps companies design, simulate, and optimize products using digital twins and smart technology.",
    logo: null,
  },
  {
    id: 16,
    name: "SoCalGas",
    description: "SoCalGas is the largest natural gas distribution utility in the United States, providing safe, reliable, and affordable energy solutions to power homes, businesses, and communities.",
    logo: null,
  },
  {
    id: 17,
    name: "SpaceX",
    description: "SpaceX develops reusable rockets and spacecraft to revolutionize space transportation and enable humanity's exploration of other planets.",
    logo: null,
  },
  {
    id: 18,
    name: "Takeda",
    description: "Takeda develops patient-centered biopharmaceuticals, advancing treatments in oncology, rare diseases, and gastroenterology to improve global health.",
    logo: null,
  },
  {
    id: 19,
    name: "The Boeing Company",
    description: "Boeing is a global leader in aerospace, designing and manufacturing commercial airplanes, defense systems, and space technologies.",
    logo: null,
  },
  {
    id: 20,
    name: "TP-Link Systems Inc.",
    description: "TP-Link develops networking hardware and IoT solutions to provide reliable, secure, and high-performance connectivity worldwide.",
    logo: null,
  },
  {
    id: 21,
    name: "TriMas Aerospace",
    description: "Designs and manufactures precision fasteners and aerospace components, supporting flight safety, reliability, and innovation across global aerospace platforms worldwide industry.",
    logo: null,
  },
];

const CompanyGrid = () => {
  return (
    <div className="company-grid-container">
      {/* Header Section with Decorative Elements */}
      <div className="company-grid-header">
        {/* Decorative Flowers */}
        <img src={COMPANYGRID_FLOWER} alt="flower" className="company-grid-flower flower-1" />
        <img src={COMPANYGRID_FLOWER} alt="flower" className="company-grid-flower flower-2" />
        <img src={COMPANYGRID_FLOWER} alt="flower" className="company-grid-flower flower-3" />
        <img src={COMPANYGRID_FLOWER} alt="flower" className="company-grid-flower flower-4" />
        
        {/* Header Content */}
        <div className="company-grid-header-content">
          <h1 className="company-grid-title">attending companies</h1>
        </div>
      </div>

      {/* Grid Section */}
      <div className="company-grid">
        {companies.map((company) => (
          <CompanyFlipCard key={company.id} company={company} />
        ))}
      </div>
    </div>
  );
};

export default CompanyGrid;
