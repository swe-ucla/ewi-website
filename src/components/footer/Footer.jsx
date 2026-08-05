import React from 'react'
import './footer.css'
import footer_background from "../../assets/footer_background.svg";
import{BsLinkedin} from 'react-icons/bs'
import{BsInstagram} from 'react-icons/bs'
import{HiOutlineMail} from 'react-icons/hi'

const Footer = () => {
  return (
    <footer>
      <img src={footer_background} className="footer-background" alt="Footer Background" />
      <div className="footer-content"> 
        <p>made with love, swe dev team <span>&lt;3</span></p>
        <div className="footer-socials"> 
          <a href="https://www.linkedin.com/company/swe-ucla" target="_blank" rel="noreferrer"><BsLinkedin/></a>
          <a href="https://www.instagram.com/uclasweewi/" target="_blank" rel="noreferrer"><BsInstagram/></a>
          <a href="mailto:ewi.swe.ucla@gmail.com" target="_blank" rel="noreferrer"><HiOutlineMail/></a>
        </div>
      </div>
    </footer>
  )
}

export default Footer