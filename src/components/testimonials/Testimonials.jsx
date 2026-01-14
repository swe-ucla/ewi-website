import React from "react";
import "./Testimonials.css";



const Testimonials = ({testimonials}) => {
  return (
    <div className="testimonials-container">
      <h2 className="testimonials-title">testimonials</h2>
      <div className="testimonials-list">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="testimonial-card">
            <div className="testimonial-quote-icon">"</div>
            <div className="testimonial-content">
              <div className="testimonial-text">
                <p> {testimonial.quote} </p>
                <p className="testimonial-source"> {testimonial.source} </p>
              </div>
              <div className="testimonial-image-container">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
