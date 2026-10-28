import React from "react";
import "./HomeFeatureBlurb.css";

const HomeFeatureBlurb = ({ title, image, imageAlt, blurb }) => {
  return (
    <article className="home-feature-blurb">
      {image ? (
        <img src={image} alt={imageAlt} className="home-feature-blurb__image" />
      ) : (
        <span className="home-feature-blurb__image home-feature-blurb__image--empty" />
      )}
      <div className="home-feature-blurb__copy">
        {title ? <h3 className="home-feature-blurb__title">{title}</h3> : null}
        <p className="home-feature-blurb__text">{blurb}</p>
      </div>
    </article>
  );
};

export default HomeFeatureBlurb;
