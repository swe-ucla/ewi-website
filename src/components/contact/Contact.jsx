import React from 'react'
import './contact.css'
import{HiOutlineMail} from 'react-icons/hi'
import { useRef } from 'react';
import emailjs from 'emailjs-com'


export const Contact = () => {
  const form = useRef();
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_qawa2ms', 'template_spug6sc', form.current, 'ldWAa_ZNCIs_VH-Xz')
     
    e.target.reset();
  };
  return (
    <section id='contact'>
      
      <h2>Contact Us</h2>

      <div className="container contact__container">
        <div className="contact__options">
          <article className="contact__option">
            <HiOutlineMail className='contact__option-icon'/>
            <h4>Email</h4>
            <h5>ewi.swe.ucla@gmail.com</h5>
            <a href="mailto:" target="_blank">Send a message</a>
          </article>
        </div>
        {/* END OF CONTACT OPTIONS */}
        <form ref={form} onSubmit={sendEmail}>
          <input type="text" name='name' placeholder='Your Full Name' required/>
          <input type="email" name='email' placeholder='Your Email' required/>
          <textarea name="message"  rows="7" placeholder='Your Message' required></textarea>
          <button type='submit' className='btn btn-primary'>Send Message</button>
        </form>
      </div>
    </section>
  )
}

export default Contact