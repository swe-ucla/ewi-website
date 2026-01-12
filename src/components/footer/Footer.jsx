import React from 'react'
import './footer.css'
import footer_background from "../../assets/footer_background.svg";
import{BsLinkedin} from 'react-icons/bs'
import {HashLink } from "react-router-hash-link";
import{BsInstagram} from 'react-icons/bs'
import{HiOutlineMail} from 'react-icons/hi'

const Footer = ({ className }) => {
  return (
    <footer className={className}>
      <img src={footer_background} className="footer-background" alt="Footer Background" />
      <div className="footer-content"> 
        <p>made with love, swe dev team <span>&lt;3</span></p>
        <div className="footer-socials"> 
          <a href="https://www.linkedin.com/company/swe-ucla" target="_blank"><BsLinkedin/></a>
          <a href="https://www.instagram.com/uclasweewi/" target="_blank"><BsInstagram/></a>
          <a href="mailto:ewi.swe.ucla@gmail.com" target="_blank"><HiOutlineMail/></a>
        </div>
      </div>
    </footer>
  )
}

export default Footer