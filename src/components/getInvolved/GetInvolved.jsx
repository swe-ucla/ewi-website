import React from 'react';
import { Link } from 'react-router-dom';
import './GetInvolved.css';

const GetInvolved = () => {
  return (
    <div className="get-involved">
      <div className="get-involved-content">
        <h2 className="get-involved-title">get involved</h2>
        <p className="get-involved-description">
          Platinum and Gold level sponsors of SWE UCLA are able to register for EWI for free, in addition to other benefits. Registration includes one dinner table and one career fair booth for up to two representatives, providing an intimate setting to connect with top engineering talent. If a partnership with SWE UCLA is of interest, please contact <a href="mailto:ewi.swe.ucla@gmail.com" style={{textDecoration: 'underline'}}>ewi.swe.ucla@gmail.com</a> to learn more about sponsorship opportunities and how to get involved.
        </p>
        <div className="get-involved-buttons">
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSd0HSR3w96uyGjYzzJEKVf-VeGeaTtDT-yg6DKei4dNx9cI-Q/viewform" target="_blank" rel="noopener noreferrer" className="involved-button">SPONSOR US</a>
          <Link to="/" className="involved-button">ABOUT EWI</Link>
        </div>
      </div>
      <div className="get-involved-stats">
        <div className="stat-circle">
          <div className="stat-circle-bg"></div>
          <p className="stat-number">49</p>
          <p className="stat-label">years running</p>
        </div>
        <div className="stat-circle">
          <div className="stat-circle-bg"></div>
          <p className="stat-number">00+</p>
          <p className="stat-label">students</p>
        </div>
        <div className="stat-circle">
          <div className="stat-circle-bg"></div>
          <p className="stat-number">00+</p>
          <p className="stat-label">companies</p>
        </div>
      </div>
    </div>
  );
};

export default GetInvolved;

