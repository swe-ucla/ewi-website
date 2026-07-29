import React, { useState, useEffect } from "react";
import "./peopleCard.css";

const PeopleCard = ({ image, name, position, description, year, major, linkedInURL }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (isPopupOpen) {
      document.body.classList.add("popup-open");
    } else {
      document.body.classList.remove("popup-open");
    }
    return () => {
      document.body.classList.remove("popup-open");
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
    <div className="people-card-component">
      <article className="people-card" onClick={handleCardClick}>
        <div className="people-card__image-wrap">
          <img src={image} alt={name} className="people-card__image" />
        </div>
        <h3 className="people-card__name">{name}</h3>
        <h4 className="people-card__position">{position}</h4>
      </article>

      {isPopupOpen && (
        <div className="people-card__overlay" onClick={handleClosePopup}>
          <div className="people-card__popup" onClick={handlePopupClick}>
            <div className="people-card__popup-header">
              <button
                type="button"
                className="people-card__popup-close"
                onClick={handleClosePopup}
                aria-label="Close profile"
              >
                ×
              </button>
            </div>
            <div className="people-card__popup-body">
              <h3 className="people-card__popup-name">{name}</h3>
              <div className="people-card__popup-content">
                <div className="people-card__popup-left">
                  <div className="people-card__popup-image-wrap">
                    <img src={image} alt={name} className="people-card__popup-image" />
                  </div>
                  {linkedInURL && (
                    <a
                      href={linkedInURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="people-card__linkedin"
                    >
                      <svg className="people-card__linkedin-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  )}
                </div>
                <div className="people-card__popup-details">
                  {year && (
                    <div className="people-card__popup-detail">
                      <span className="people-card__popup-label">Class</span>
                      <span className="people-card__popup-value">{year}</span>
                    </div>
                  )}
                  {major && (
                    <div className="people-card__popup-detail">
                      <span className="people-card__popup-label">Major</span>
                      <span className="people-card__popup-value">{major}</span>
                    </div>
                  )}
                  {position && (
                    <div className="people-card__popup-detail">
                      <span className="people-card__popup-label">Role</span>
                      <span className="people-card__popup-value">{position}</span>
                    </div>
                  )}
                </div>
              </div>
              {description && (
                <div className="people-card__popup-about">
                  <h4 className="people-card__popup-about-title">About</h4>
                  <p className="people-card__popup-about-text">{description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeopleCard;
