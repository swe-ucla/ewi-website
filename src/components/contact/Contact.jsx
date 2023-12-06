import React from 'react'
import './contact.css'
import{HiOutlineMail} from 'react-icons/hi'
import { useRef } from 'react';
import emailjs from 'emailjs-com'
import SendMessage from '../sendMessage/sendMessage';


export const Contact = () => {
  return (
    <section>
      
      <h2>Contact Us</h2>

      <div className="container contact__container">
        <div className="contact__options">
          <article className="contact__option">
            <HiOutlineMail className='contact__option-icon'/>
            <h4>Email</h4>
            <h5>ewi.swe.ucla@gmail.com</h5>
            <a href="mailto:ewi.swe.ucla@gmail.com">Send a message</a>
          </article>
        </div>
        {/* END OF CONTACT OPTIONS */}
        <SendMessage />
      </div>
    </section>
  )
}

export default Contact;
