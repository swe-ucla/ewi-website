import React from "react";
import { Link } from "react-router-dom";
import HomeSection from "./HomeSection";
import HomeCompanyLogo from "./HomeCompanyLogo";
import { homeFeaturedCompanies } from "./homeCompaniesData";
import "./HomeCompanies.css";

const HomeCompanies = () => {
  return (
    <HomeSection title="Companies">
      <div className="home-companies__grid">
        {homeFeaturedCompanies.map((company) => (
          <HomeCompanyLogo key={company.id} name={company.name} logo={company.logo} />
        ))}
      </div>
      <Link to="/companies" className="home-companies__link">
        See all attending companies →
      </Link>
    </HomeSection>
  );
};

export default HomeCompanies;
