import React from "react";
import "./HomeSection.css";

const HomeSection = ({ title, children, className = "" }) => {
  return (
    <section className={`home-section ${className}`.trim()}>
      {title ? <h2 className="home-section__title">{title}</h2> : null}
      <div className="home-section__content">{children}</div>
    </section>
  );
};

export default HomeSection;
