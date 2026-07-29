import React from 'react';
import './CompanyRegistration.css';
import IssuuStyleFlipbook from '../flipbook/IssuuStyleFlipbook';
import company_guide from '../../assets/EWI 2025 Company Survival Guide.pdf';

const CompanyRegistration = () => {
  return (
    <div className="company-registration">
      <div className="company-registration-content">
        <h1 className="company-registration-title">For Companies</h1>
        <p className="company-registration-description">subhead</p>

          
            {/*keep same link for apply button for now*/}
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSd0HSR3w96uyGjYzzJEKVf-VeGeaTtDT-yg6DKei4dNx9cI-Q/viewform" target="_blank" rel="noopener noreferrer" className="apply-button">Register</a>
            {/* <p className="subtitle-text">not sure if there's any text that needs to be added here</p> */}
      </div>

      
      {/*<div className="company-registration-document">
        <IssuuStyleFlipbook pdfFile={company_guide} scale={1.0} />
      </div> */}
    </div>
  );
};

export default CompanyRegistration;

