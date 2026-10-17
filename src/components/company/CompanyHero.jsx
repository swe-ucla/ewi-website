import React from 'react';
import './CompanyHero.css';
import pinecone from '../../assets/pinecone_suit.png';

const headingTop = "company";
const headingBottom = "registration";
const subheading = "subhead";

const CompanyHero = () => {
  return (
    <div className="company-hero">
      <div className="company-hero-content">
        <h1 className="company-hero-title">
          {headingTop}
          <br />
          {headingBottom}
          <img src={pinecone} alt="" className="company-hero-pinecone" />
        </h1>
        <p className="company-hero-description">{subheading}</p> 
      </div>
    </div>
  );
};

export default CompanyHero;

