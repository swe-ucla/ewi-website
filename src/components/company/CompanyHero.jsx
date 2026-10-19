import React from 'react';
import './CompanyHero.css';
import pinecone from '../../assets/pinecone_suit.png';

const headingTop = "company";
const headingBottom = "registration";

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
      </div>
    </div>
  );
};

export default CompanyHero;

