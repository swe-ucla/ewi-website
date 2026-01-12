import React from 'react'
import './contact.css'
import { useRef } from 'react';
import emailjs from 'emailjs-com'
import GeneralQA from '../generalQA/GeneralQA';
import butterfly from "../../assets/butterfly.png";
import leafLeft from "../../assets/leafLeft.png";
import leafRight from "../../assets/leafRight.png";

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
        {/* Contact Us Text with Butterfly */}
        <div className="contact-header-text-container">
          <h1 className="contact-header-text">
            <img src={leafLeft} alt="leaf left" className="contact-leaf-left" />
            <span className="contact-header-text-span">contact us</span>
            <img src={leafRight} alt="leaf right" className="contact-leaf-right" />
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
