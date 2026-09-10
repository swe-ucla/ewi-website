import React, { useState } from "react";
import "./HomeFeatureBlurb.css";

const HomeFeatureBlurb = ({ title, image, imageAlt, blurb }) => {
  const [flipped, setFlipped] = useState(false);

  const toggleFlip = () => setFlipped((prev) => !prev);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFlip();
    }
  };

  return (
    /* ratio-box: sets the square height via padding-top */
    <div className="home-feature-blurb__ratio">
      <article
        className={`home-feature-blurb ${flipped ? "home-feature-blurb--flipped" : ""}`}
        onClick={toggleFlip}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-pressed={flipped}
        aria-label={`${title}. ${flipped ? "Showing description" : "Showing photo"}. Activate to flip.`}
      >
        <div className="home-feature-blurb__inner">
          <div className="home-feature-blurb__face home-feature-blurb__front">
            {image ? (
              <img src={image} alt={imageAlt} className="home-feature-blurb__image" />
            ) : (
              <span className="home-feature-blurb__placeholder">picture</span>
            )}
            <span className="home-feature-blurb__front-title">{title}</span>
          </div>
          <div className="home-feature-blurb__face home-feature-blurb__back">
            <p className="home-feature-blurb__back-title">{title}</p>
            <p className="home-feature-blurb__text">{blurb}</p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default HomeFeatureBlurb;
