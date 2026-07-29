import React from 'react';
import './CompanyHero.css';
import IssuuStyleFlipbook from '../flipbook/IssuuStyleFlipbook';
import company_guide from '../../assets/EWI 2025 Company Survival Guide.pdf';

const heading = "For Companies";
const subheading = "subhead";

const CompanyHero = () => {
  return (
    <div className="company-hero">
      <div className="company-hero-content">
        <h1 className="company-hero-title">{heading}</h1>
        <p className="company-hero-description">{subheading}</p>
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSd0HSR3w96uyGjYzzJEKVf-VeGeaTtDT-yg6DKei4dNx9cI-Q/viewform" target="_blank" rel="noopener noreferrer" className="apply-button">Register</a>
      </div>
    </div>
  );
};

export default CompanyHero;

