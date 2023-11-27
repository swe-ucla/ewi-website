import React from 'react'
import './footer.css'
import{BsLinkedin} from 'react-icons/bs'
import {HashLink } from "react-router-hash-link";
import{BsInstagram} from 'react-icons/bs'
import{HiOutlineMail} from 'react-icons/hi'

const Footer = () => {
  return (
    <footer>
      <HashLink to='/#' className='footer__logo'>Evening with Industry</HashLink>
      
      <ul className='permalinks'>
        <li><HashLink to='/#'>Home</HashLink></li>
        <li><HashLink to='/#attend'>Attend</HashLink></li>
        <li><HashLink to='/#about'>About</HashLink></li>
        <li><HashLink to='/#contact'>Contact</HashLink></li>
      </ul>

      <div className="footer__socials">
        <a href="https://www.linkedin.com/company/swe-ucla" target="_blank"><BsLinkedin/></a>
        <a href="https://www.instagram.com/uclasweewi/" target="_blank"><BsInstagram/></a>
        <a href="mailto:ewi.swe.ucla@gmail.com" target="_blank"><HiOutlineMail/></a>
       
      </div>

     <p>+ a special thanks to webdev team & prodev chair for putting this together for us :)</p>

    </footer>
  )
}

export default Footer