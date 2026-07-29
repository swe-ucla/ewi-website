import React from "react";
import { Link } from "react-router-dom";
import HomeSection from "./HomeSection";
import HomeCompanyLogo from "./HomeCompanyLogo";
import { homeFeaturedCompanies } from "./homeCompaniesData";
import "./HomeCompanies.css";

const HomeCompanies = () => {
  return (
    <HomeSection title="Companies">
      <ul className="home-companies__grid" role="list" aria-label="Featured companies">
        {homeFeaturedCompanies.map((company) => (
          <li key={company.id}>
            <HomeCompanyLogo name={company.name} logo={company.logo} />
          </li>
        ))}
      </ul>
      <Link to="/companies" className="home-companies__link" aria-label="See all attending companies">
        See all attending companies →
      </Link>
    </HomeSection>
  );
};

export default HomeCompanies;
