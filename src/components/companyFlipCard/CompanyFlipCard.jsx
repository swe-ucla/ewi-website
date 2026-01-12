import React from "react";
import "./CompanyFlipCard.css";

const CompanyFlipCard = ({ company }) => {
  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        <div className="flip-card-front">
          {company.logo ? (
            <img src={company.logo} alt={company.name} className="company-logo" />
          ) : (
            <div className="company-logo-placeholder"></div>
          )}
        </div>
        <div className="flip-card-back">
          <p className="company-description">{company.description}</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyFlipCard;
