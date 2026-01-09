import React from 'react'
import './contact.css'
import { useRef } from 'react';
import emailjs from 'emailjs-com'
import GeneralQA from '../generalQA/GeneralQA';
import flower from "../../assets/flower.svg";
import hero_background from "../../assets/hero_background.svg";
import butterfly from "../../assets/butterfly.png";

export const Contact = () => {
  const form = useRef();
  
  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm('service_q6yqhll', 'template_yfbrimt', form.current, 'Z7j812LuDjlbsCsMe');
    e.target.reset();
  };

  return (
    <section className="contact-section">
      {/* Header Section with Decorative Elements */}
      <div className="contact-header">
        <div className="contact-header-background">
          {/* Hero background image */}
          <div className="contact-header-bg-image"></div>
          
          {/* Decorative flowers */}
          <img src={flower} alt="flower" className="contact-flower contact-flower-1" />
          <img src={flower} alt="flower" className="contact-flower contact-flower-2" />
          <img src={flower} alt="flower" className="contact-flower contact-flower-3" />
          <img src={flower} alt="flower" className="contact-flower contact-flower-4" />
        </div>
        
        {/* Contact Us Text with Butterfly */}
        <div className="contact-header-text-container">
          <h1 className="contact-header-text">
            contact us
            <img src={butterfly} alt="butterfly" className="contact-butterfly-text" />
          </h1>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="contact-form-section">
        <form ref={form} onSubmit={sendEmail} className="contact-form">
          <div className="contact-form-field">
            <label htmlFor="name">Full Name <span className="required">*</span></label>
            <input type="text" id="name" name="name" required />
          </div>
          
          <div className="contact-form-field">
            <label htmlFor="company">Company</label>
            <input type="text" id="company" name="company" />
          </div>
          
          <div className="contact-form-field">
            <label htmlFor="email">Email <span className="required">*</span></label>
            <input type="email" id="email" name="email" required />
          </div>
          
          <div className="contact-form-field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="7"></textarea>
          </div>
          
          <button type="submit" className="contact-submit-btn">SUBMIT</button>
        </form>
      </div>
      
      <GeneralQA />
    </section>
  )
}

export default Contact;
