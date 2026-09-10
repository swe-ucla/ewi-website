import React from "react";
import "./HomeTestimonialSlide.css";

const HomeTestimonialSlide = ({ name, quote, image, imageAlt }) => {
  return (
    <>
      <p className="home-testimonial-slide__name">{name}</p>
      <div className="home-testimonial-slide__body">
        <div className="home-testimonial-slide__picture-wrap">
          {image ? (
            <img
              src={image}
              alt={imageAlt || name}
              className="home-testimonial-slide__picture"
            />
          ) : (
            <div className="home-testimonial-slide__picture home-testimonial-slide__picture--placeholder home-wire-box home-wire-box--dark">
              picture
            </div>
          )}
        </div>
        <blockquote className="home-testimonial-slide__quote">
          <p>{quote}</p>
        </blockquote>
      </div>
    </>
  );
};

export default HomeTestimonialSlide;
