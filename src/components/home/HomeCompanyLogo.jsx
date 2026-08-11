import React from "react";
import "./HomeCompanyLogo.css";

const HomeCompanyLogo = ({ name, logo }) => {
  return (
    <div className="home-company-logo home-wire-box">
      {logo ? (
        <img src={logo} alt={`${name} logo`} className="home-company-logo__img" />
      ) : (
        <>
          <span className="home-company-logo__label">logo</span>
          <span className="home-company-logo__name">{name}</span>
        </>
      )}
    </div>
  );
};

export default HomeCompanyLogo;
