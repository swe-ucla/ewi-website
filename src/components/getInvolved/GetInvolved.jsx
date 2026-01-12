import React from 'react';
import './GetInvolved.css';

const GetInvolved = () => {
  return (
    <div className="get-involved">
      <div className="get-involved-content">
        <h2 className="get-involved-title">get involved</h2>
        <p className="get-involved-description">
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor.
        </p>
        <div className="get-involved-buttons">
          <button className="involved-button">SPONSOR US</button>
          <button className="involved-button">ABOUT EWI</button>
        </div>
      </div>
      <div className="get-involved-stats">
        <div className="stat-circle">
          <div className="stat-circle-bg"></div>
          <p className="stat-number">00+</p>
          <p className="stat-label">participants</p>
        </div>
        <div className="stat-circle">
          <div className="stat-circle-bg"></div>
          <p className="stat-number">00+</p>
          <p className="stat-label">participants</p>
        </div>
        <div className="stat-circle">
          <div className="stat-circle-bg"></div>
          <p className="stat-number">00+</p>
          <p className="stat-label">participants</p>
        </div>
      </div>
    </div>
  );
};

export default GetInvolved;

