import React, { useId } from "react";
import "./HomeSection.css";

const HomeSection = ({ title, children, className = "" }) => {
  const headingId = useId();
  return (
    <section
      className={`home-section ${className}`.trim()}
      aria-labelledby={title ? headingId : undefined}
    >
      {title ? (
        <h2 id={headingId} className="home-section__title">
          {title}
        </h2>
      ) : null}
      <div className="home-section__content">{children}</div>
    </section>
  );
};

export default HomeSection;
