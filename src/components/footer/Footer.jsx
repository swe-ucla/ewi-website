import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import SWE_LOGO from "../../assets/purple-swe-logo.svg";
import { BsLinkedin, BsInstagram } from "react-icons/bs";

const EWI_EMAIL = "ewi.swe.ucla@gmail.com";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <Link to="/" className="footer__logo" aria-label="EWI home">
          <img src={SWE_LOGO} alt="SWE logo" />
        </Link>

        <p className="footer__contact">
          Questions? Email{" "}
          <a className="footer__email" href={`mailto:${EWI_EMAIL}`}>
            {EWI_EMAIL}
          </a>
          .
        </p>

        <div className="footer__socials">
          <a
            className="footer__social-link"
            href="https://www.linkedin.com/company/swe-ucla"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <BsLinkedin />
          </a>
          <a
            className="footer__social-link"
            href="https://www.instagram.com/uclasweewi/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <BsInstagram />
          </a>
        </div>
      </div>

      <p className="footer__credit">made with love by SWE Dev</p>
    </footer>
  );
};

export default Footer;
