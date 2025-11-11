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
            <h3 className="company-name">{company.name}</h3>
          )}
        </div>
        <div className="flip-card-back">
          <h3 className="company-name-back">{company.name}</h3>
          <p className="company-description">{company.description}</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyFlipCard;

