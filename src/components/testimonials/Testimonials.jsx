import React from "react";
import "./Testimonials.css";

const testimonials = [
  {
    id: 1,
    quote: "Having the opportunity to sit down with [the recruiters] and chat about everything from life at Takeda, to trips to Italy while eating dinner were the highlights of EWI. It was a great way to personally connect with a Takeda recruiter and engineer while also learning about the company – something you would rather find outside of a recruiting event like EWI.",
    said_by: " - Maddie Doi, Class of 2026 Bioengineering student who received a Manufacturing Sciences internship at Takeda after EWI 2024",
    image: null, // Add student image path when available
    name: "Maddie Doi",
  },
  {
    id: 2,
    quote: "The highlight of EWI was the food, but also it was really great to connect with the recruiters that were sitting at my table because they were both engaged in what we were talking about and easy to talk to so I felt that the conversation flowed very easily. After having a great conversation with the recruiters at my table, I was able to get their contact info and give them my resume. When I applied and went through the interview process, the recruiter who was there at EWI actually became my mentor so she actually was recruiting directly for her team at EWI, rather than for a general pool of positions.",
    said_by: " - Elaine Chu, Class of 2026 Mechanical Engineering student who received a Starlink Production Engineering internship at SpaceX after EWI 2024",
    image: null,
    name: "Elaine Chu",
  },
  {
    id: 3,
    quote: "EWI was inspiring for me. The 2023 Keynote Speaker, Evelyn Cortez-Davis, emphasized the importance of pursuing your career with a clear passion and executable goals as she shared her own journey, which was both moving and motivating. I learned to evaluate the reasons I am going into the field of my choice and how to never rule myself out from an opportunity before even trying.",
    said_by: " - Daniella Hannah, Class of 2025 Mechanical Engineering student who received a Reliability, Risk, Sustainability & Energy Engineering internship at Northrop Grumman after EWI 2023",
    image: null,
    name: "Daniella Hannah",
  },
];

const Testimonials = () => {
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
                <p className="testimonial-said-by"> {testimonial.said_by} </p>
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
