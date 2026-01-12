import React from 'react';
import { useRef } from 'react';
import emailjs from 'emailjs-com';
import './SweSponsor.css';

const SweSponsor = () => {
  const form = useRef();
  
  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm('service_q6yqhll', 'template_yfbrimt', form.current, 'Z7j812LuDjlbsCsMe');
    e.target.reset();
  };

  return (
    <section className="swe-sponsor-section">
      <div className="swe-sponsor-content">
        <h2 className="swe-sponsor-title">become a SWE sponsor</h2>
        <p className="swe-sponsor-text">
        Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor.
        </p>
      </div>

      {/* Contact Form Section */}
      <div className="swe-sponsor-form-section">
        <form ref={form} onSubmit={sendEmail} className="swe-sponsor-form">
          <div className="swe-sponsor-form-field">
            <label htmlFor="name">Full Name <span className="required">*</span></label>
            <input type="text" id="name" name="name" required />
          </div>
          
          <div className="swe-sponsor-form-field">
            <label htmlFor="company">Company</label>
            <input type="text" id="company" name="company" />
          </div>
          
          <div className="swe-sponsor-form-field">
            <label htmlFor="email">Email <span className="required">*</span></label>
            <input type="email" id="email" name="email" required />
          </div>
          
          <div className="swe-sponsor-form-field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="7"></textarea>
          </div>
          
          <button type="submit" className="swe-sponsor-submit-btn">SUBMIT</button>
        </form>
      </div>
    </section>
  );
};

export default SweSponsor;

