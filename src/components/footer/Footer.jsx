import React from 'react'
import './footer.css'
import{BsLinkedin} from 'react-icons/bs'
import{BsGithub} from 'react-icons/bs'
import{BsInstagram} from 'react-icons/bs'
import{HiOutlineMail} from 'react-icons/hi'

const Footer = () => {
  return (
    <footer>
      <a href="#" className='footer__logo'>Evening with Industry</a>
      
      <ul className='permalinks'>
        <li><a href='#'>Home</a></li>
        <li><a href='#about'>Attend</a></li>
        <li><a href='#experience'>About</a></li>
        <li><a href='#contact'>Contact</a></li>
      </ul>

      <div className="footer__socials">
        <a href="https://linkedin.com/in" target="_blank"><BsLinkedin/></a>
        <a href="https://github.com" target="_blank"><BsGithub/></a>
        <a href="https://www.instagram.com/uclasweewi/" target="_blank"><BsInstagram/></a>
        <a href="mailto:ewi.swe.ucla@gmail.com" target="_blank"><HiOutlineMail/></a>
       
      </div>

     <p>+ a special thanks to webdev & prodev chair for putting this together for us :)</p>

    </footer>
  )
}

export default Footer