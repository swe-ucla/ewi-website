import React from 'react'
import './sendMessage.css'
import { useRef } from 'react';
import emailjs from 'emailjs-com'


export const SendMessage = () => {
  const form = useRef();
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_q6yqhll', 'template_yfbrimt', form.current, 'udePWyliPh6tOWF6h');

    e.target.reset();
  };

  return (
    <form ref={form} onSubmit={sendEmail}>
        <input type="text" name='name' placeholder='Your Full Name' required/>
        <input type="email" name='email' placeholder='Your Email' required/>
        <textarea name="message"  rows="7" placeholder='Your Message' required></textarea>
        <button type='submit' className='btn btn-primary'>Send Message</button>
    </form>
  )
}

export default SendMessage;
