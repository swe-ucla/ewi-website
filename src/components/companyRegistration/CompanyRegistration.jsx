import React from 'react';
import './CompanyRegistration.css';
import IssuuStyleFlipbook from '../flipbook/IssuuStyleFlipbook';
import company_guide from '../../assets/EWI 2025 Company Survival Guide.pdf';
import for_companies from '../../assets/for-companies.svg';

const CompanyRegistration = () => {
  return (
    <div className="company-registration">
      <div className="company-registration-hero">
        <div className="company-registration-content">
          <img src={for_companies} className="company-registration-title" alt="Company Registration text" />
          
          <div className="company-registration-info">
            <div className="deadlines-container">
              <h3 className="deadline-text deadline-early">Early Bird Deadline by 12/05/2025</h3>
              <h3 className="deadline-text deadline-regular">Regular Deadline by 01/08/2025</h3>
            </div>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSd0HSR3w96uyGjYzzJEKVf-VeGeaTtDT-yg6DKei4dNx9cI-Q/viewform" target="_blank" rel="noopener noreferrer" className="apply-button">APPLY</a>
            {/* <p className="subtitle-text">not sure if there's any text that needs to be added here</p> */}
          </div>
        </div>
      </div>
      
      <div className="company-registration-document">
        <IssuuStyleFlipbook pdfFile={company_guide} scale={1.0} />
      </div>
    </div>
  );
};

export default CompanyRegistration;

