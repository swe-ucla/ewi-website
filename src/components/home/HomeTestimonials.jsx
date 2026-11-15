import React, { useState } from "react";
import HomeSection from "./HomeSection";
import HomeTestimonialSlide from "./HomeTestimonialSlide";
import { homeTestimonials } from "./homeTestimonialsData";
import arrowNext from "../../assets/home-2026/arrow-next.svg";
import leafDot from "../../assets/home-2026/leaf-dot.svg";
import dot from "../../assets/home-2026/dot.svg";
import leafA from "../../assets/home-2026/leaf-a.svg";
import leafB from "../../assets/home-2026/leaf-b.svg";
import leafC from "../../assets/home-2026/leaf-c.svg";
import "./HomeTestimonials.css";

const HomeTestimonials = () => {
  const [index, setIndex] = useState(0);
  const total = homeTestimonials.length;
  const current = homeTestimonials[index];

  const goNext = () => setIndex((i) => (i + 1) % total);

  return (
    <HomeSection title="testimonials">
      <div className="home-testimonials">
        <div className="home-testimonials__stage">
          <div className="home-testimonials__card">
            <img
              className="home-testimonials__leaf home-testimonials__leaf--a"
              src={leafA}
              alt=""
            />
            <img
              className="home-testimonials__leaf home-testimonials__leaf--b"
              src={leafB}
              alt=""
            />
            <img
              className="home-testimonials__leaf home-testimonials__leaf--c"
              src={leafC}
              alt=""
            />
            <HomeTestimonialSlide {...current} />
          </div>
          <button
            type="button"
            className="home-testimonials__next"
            onClick={goNext}
            aria-label="Next testimonial"
          >
            <img src={arrowNext} alt="" width="49" height="49" />
          </button>
        </div>
        <div
          className="home-testimonials__pager"
          role="tablist"
          aria-label="Testimonials"
        >
          {homeTestimonials.map((item, i) => {
            const active = i === index;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Testimonial ${i + 1} of ${total}, ${item.name}`}
                className={`home-testimonials__dot${
                  active ? " home-testimonials__dot--active" : ""
                }`}
                onClick={() => setIndex(i)}
              >
                <img
                  src={active ? leafDot : dot}
                  alt=""
                  width={active ? 28 : 18}
                  height={active ? 44 : 18}
                />
              </button>
            );
          })}
        </div>
      </div>
    </HomeSection>
  );
};

export default HomeTestimonials;
