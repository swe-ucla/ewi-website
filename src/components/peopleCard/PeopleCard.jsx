import React, { useState, useEffect } from 'react';
import './peopleCard.css';

const PeopleCard = ({ image, name, position, description, year, major, linkedInURL }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (isPopupOpen) {
      document.body.classList.add('popup-open');
    } else {
      document.body.classList.remove('popup-open');
    }
    return () => {
      document.body.classList.remove('popup-open');
    };
  }, [isPopupOpen]);

  const handleCardClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = (e) => {
    e.stopPropagation();
    setIsPopupOpen(false);
  };

  const handlePopupClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <div className="people-card" onClick={handleCardClick}>
        <div className="people-card-image-container">
          <img src={image} alt={name} className="people-card-image" />
        </div>
        <h3 className="people-card-name">{name}</h3>
        <h4 className="people-card-position">{position}</h4>
      </div>

      {isPopupOpen && (
        <div className="people-card-popup-overlay" onClick={handleClosePopup}>
          <div className="people-card-popup" onClick={handlePopupClick}>
            <div className="people-card-popup-header">
              <button className="people-card-popup-close" onClick={handleClosePopup}>
                ×
              </button>
            </div>
            <div className="people-card-popup-body">
              <h3 className="people-card-popup-name">{name}</h3>
              <div className="people-card-popup-content">
                <div className="people-card-popup-left">
                  <div className="people-card-popup-image-container">
                    <img src={image} alt={name} className="people-card-popup-image" />
                  </div>
                  {linkedInURL && (
                    <a 
                      href={linkedInURL} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="people-card-linkedin-link"
                    >
                      <svg className="people-card-linkedin-icon" viewBox="0 0 24 24" fill="white">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  )}
                </div>
                <div className="people-card-popup-right">
                  {year && (
                    <div className="people-card-popup-detail">
                      <span className="people-card-popup-label">Class</span>
                      <span className="people-card-popup-value">{year}</span>
                    </div>
                  )}
                  {major && (
                    <div className="people-card-popup-detail">
                      <span className="people-card-popup-label">Major</span>
                      <span className="people-card-popup-value">{major}</span>
                    </div>
                  )}
                  {position && (
                    <div className="people-card-popup-detail">
                      <span className="people-card-popup-label">Role</span>
                      <span className="people-card-popup-value">{position}</span>
                    </div>
                  )}
                </div>
              </div>
              {description && (
                <div className="people-card-popup-about">
                  <h4 className="people-card-popup-about-title">About</h4>
                  <p className="people-card-popup-about-text">{description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PeopleCard;

