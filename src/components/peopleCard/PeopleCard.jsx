import React, { useState, useEffect } from "react";
import { BsLinkedin } from "react-icons/bs";
import "./PeopleCard.css";

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
        <div className="people-card__media">
          <img src={image} alt={name} className="people-card__image" />
          <div className="people-card__caption">
            <h3 className="people-card__name">{name}</h3>
            <p className="people-card__position">{position}</p>
          </div>
        </div>
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
                  {linkedInURL && (
                    <div className="people-card__popup-detail">
                      <span className="people-card__popup-label">LinkedIn</span>
                      <a
                        href={linkedInURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="people-card__linkedin"
                      >
                        <BsLinkedin />
                      </a>
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
