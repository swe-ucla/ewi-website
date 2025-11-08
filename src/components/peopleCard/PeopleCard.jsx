import React, { useState } from 'react';
import './peopleCard.css';

const PeopleCard = ({ image, name, position, description, year, major }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={`people-card ${isFlipped ? 'flipped' : ''}`}
      onClick={handleFlip}
    >
      <div className="people-card-inner">
        {/* Front of card */}
        <div className="people-card-front">
          <div className="people-card-image-container">
            <img src={image} alt={name} className="people-card-image" />
          </div>
          <h3 className="people-card-name">{name}</h3>
          <h4 className="people-card-position">{position}</h4>
        </div>
        
        {/* Back of card */}
        <div className="people-card-back">
          <div className="people-card-back-content">
            <div className="people-card-back-image-container">
              <img src={image} alt={name} className="people-card-back-image" />
            </div>
            <h3 className="people-card-name">{name}</h3>
            <h4 className="people-card-position">{position}</h4>
            {(year || major) && (
              <div className="people-card-info">
                {year && <span className="people-card-year">{year}</span>}
                {year && major && <span className="people-card-separator">•</span>}
                {major && <span className="people-card-major">{major}</span>}
              </div>
            )}
            <p className="people-card-description">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeopleCard;

