import React from "react";
import "./CompanyGrid.css";
import CompanyFlipCard from "../companyFlipCard/CompanyFlipCard";

// Sample company data - replace with actual sponsor data
const companies = [
  {
    id: 1,
    name: "Company A",
    description: "Insert description",
    logo: null, // Add logo path when available
  },
  {
    id: 2,
    name: "Company B",
    description: "Insert description",
    logo: null,
  },
  {
    id: 3,
    name: "Company C",
    description: "Insert description",
    logo: null,
  },
  {
    id: 4,
    name: "Company D",
    description: "Insert description",
    logo: null,
  },
  {
    id: 5,
    name: "Company E",
    description: "Insert description",
    logo: null,
  },
  {
    id: 6,
    name: "Company F",
    description: "Insert description",
    logo: null,
  },
  {
    id: 7,
    name: "Company G",
    description: "Insert description",
    logo: null,
  },
  {
    id: 8,
    name: "Company H",
    description: "Insert description",
    logo: null,
  },
];

const CompanyGrid = () => {
  return (
    <div className="company-grid-container">
      <h2 className="company-grid-title">Our Sponsors</h2>
      <div className="company-grid">
        {companies.map((company) => (
          <CompanyFlipCard key={company.id} company={company} />
        ))}
      </div>
    </div>
  );
};

export default CompanyGrid;

