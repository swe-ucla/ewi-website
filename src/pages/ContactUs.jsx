import React, { useEffect } from 'react';
import Contact from '../components/contact/Contact';

const ContactUs = () => {
  useEffect(() => {
    document.body.classList.add('contact-page');
    return () => {
      document.body.classList.remove('contact-page');
    };
  }, []);

  return (
    <div className="contact-us-page">
      <Contact />
    </div>
  );
};

export default ContactUs;
