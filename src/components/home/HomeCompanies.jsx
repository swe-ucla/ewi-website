import React from "react";
import HomeSection from "./HomeSection";
import HomeCompanyLogo from "./HomeCompanyLogo";
import { homeFeaturedCompanies } from "./homeCompaniesData";
import pinecone from "../../assets/home-2026/mascot.png";
import "./HomeCompanies.css";

const HomeCompanies = () => {
  return (
    <HomeSection title="companies" className="home-companies">
      <div className="home-companies__panel">
        <ul className="home-companies__grid" aria-label="Confirmed companies">
          {homeFeaturedCompanies.map((company) => (
            <li key={company.id}>
              <HomeCompanyLogo name={company.name} logo={company.logo} />
            </li>
          ))}
          <li className="home-companies__more">
            <div className="home-companies__more-card">
              <p className="home-companies__more-title">
                more details coming soon
                <img
                  className="home-companies__more-pinecone"
                  src={pinecone}
                  alt=""
                />
              </p>
              <p className="home-companies__more-tagline">harvest your potential</p>
            </div>
          </li>
        </ul>
      </div>
    </HomeSection>
  );
};

export default HomeCompanies;
