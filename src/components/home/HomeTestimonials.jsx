import React, { useState } from "react";
import HomeSection from "./HomeSection";
import HomeTestimonialSlide from "./HomeTestimonialSlide";
import { homeTestimonials } from "./homeTestimonialsData";
import "./HomeTestimonials.css";

const HomeTestimonials = () => {
  const [index, setIndex] = useState(0);
  const total = homeTestimonials.length;
  const current = homeTestimonials[index];

  const goPrev = () => setIndex((i) => (i === 0 ? total - 1 : i - 1));
  const goNext = () => setIndex((i) => (i + 1) % total);

  return (
    <HomeSection title="Testimonials">
      <div className="home-testimonials">
        <HomeTestimonialSlide {...current} />
        <div className="home-testimonials__controls">
          <button
            type="button"
            className="home-testimonials__nav"
            onClick={goPrev}
            aria-label="Previous testimonial"
          >
            ‹
          </button>
          <div className="home-testimonials__dots" role="tablist" aria-label="Testimonials">
            {homeTestimonials.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Testimonial ${i + 1} of ${total}`}
                className={`home-testimonials__dot ${i === index ? "home-testimonials__dot--active" : ""}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
          <button
            type="button"
            className="home-testimonials__nav"
            onClick={goNext}
            aria-label="Next testimonial"
          >
            ›
          </button>
        </div>
      </div>
    </HomeSection>
  );
};

export default HomeTestimonials;
