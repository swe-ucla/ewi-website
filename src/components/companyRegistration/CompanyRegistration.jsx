import React from 'react';
import './CompanyRegistration.css';
import FlippingBookEmbed from '../flipbook/FlippingBookEmbed';

const CompanyRegistration = () => {
  return (
    <div className="company-registration">
      <div className="company-registration-hero">
        <div className="company-registration-content">
          <h1 className="company-registration-title">
            <span className="title-line-1">
              company
              <svg className="flower-icon" xmlns="http://www.w3.org/2000/svg" width="140" height="141" viewBox="0 0 140 141" fill="none">
                <path d="M72.2496 22.097C72.2758 22.1704 80.7426 45.9582 83.1791 64.4193C76.8058 65.421 70.8518 66.9762 66.4706 69.3559C54.5165 75.8489 47.8573 89.7402 46.3973 99.2007C41.1515 91.3136 36.8301 78.5675 39.796 66.712C44.3223 48.6197 72.2286 22.1169 72.2496 22.097Z" fill="url(#paint0_linear_179_808)"/>
                <path d="M89.4092 107.939C75.3651 119.027 50.1947 113.525 46.9164 107.303C43.6381 101.081 50.0751 78.2612 66.4696 69.3562C82.8641 60.4512 121.283 63.0888 121.283 63.0888C121.283 63.0888 103.453 96.8521 89.4092 107.939Z" fill="url(#paint1_linear_179_808)"/>
                <defs>
                  <linearGradient id="paint0_linear_179_808" x1="72.2019" y1="22.087" x2="54.4769" y2="106.771" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9DA77A"/>
                    <stop offset="1" stopColor="#3E4C13"/>
                  </linearGradient>
                  <linearGradient id="paint1_linear_179_808" x1="84.2238" y1="36.3315" x2="9.85764" y2="80.5457" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3E4C13"/>
                    <stop offset="1" stopColor="#9DA77A"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="title-line-2">registration</span>
          </h1>
          
          <div className="company-registration-info">
            <p className="deadline-text">regular deadline by 0/0</p>
            <button className="apply-button">APPLY</button>
            {/* <p className="subtitle-text">not sure if there's any text that needs to be added here</p> */}
          </div>
        </div>
      </div>
      
      {/* <div className="company-registration-document">
        <FlippingBookEmbed issuuUrl="https://issuu.com/lianelsalinton/docs/ewi-survival-guide" />
      </div> */}
    </div>
  );
};

export default CompanyRegistration;

