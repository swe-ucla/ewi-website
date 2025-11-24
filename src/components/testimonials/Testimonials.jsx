import React from "react";
import "./Testimonials.css";

// Sample testimonial data - replace with actual student testimonials
const testimonials = [
  {
    id: 1,
    text: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor.",
    image: null, // Add student image path when available
    name: "Student Name",
  },
  {
    id: 2,
    text: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor.",
    image: null,
    name: "Student Name",
  },
];

const Testimonials = () => {
  return (
    <div className="testimonials-container">
      <h2 className="testimonials-title">Testimonials</h2>
      <div className="testimonials-list">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="testimonial-card">
            <div className="testimonial-left">
              <div className="testimonial-quote-icon">"</div>
              <p className="testimonial-text">{testimonial.text}</p>
            </div>
            <div className="testimonial-right">
              {testimonial.image ? (
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="testimonial-image"
                />
              ) : (
                <div className="testimonial-image-placeholder"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;

