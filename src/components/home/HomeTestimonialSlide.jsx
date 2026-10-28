import React from "react";
import "./HomeTestimonialSlide.css";

const HomeTestimonialSlide = ({ name, quote, image, imageAlt }) => {
  return (
    <div className="home-testimonial-slide">
      <p className="home-testimonial-slide__name">{name}</p>
      <div className="home-testimonial-slide__picture-wrap">
        {image ? (
          <img
            src={image}
            alt={imageAlt || name}
            className="home-testimonial-slide__picture"
          />
        ) : (
          <div
            className="home-testimonial-slide__picture home-testimonial-slide__picture--placeholder"
            role="img"
            aria-label={imageAlt || name}
          />
        )}
      </div>
      <blockquote className="home-testimonial-slide__quote">
        <p>“{quote}”</p>
      </blockquote>
    </div>
  );
};

export default HomeTestimonialSlide;
