import React from "react";
import "./header.css";
import Timer from "../timer/Timer";
import { HashLink } from "react-router-hash-link";
import arrowIcon from "./contact_arrow.svg";

const eventDate = "JAN 22ND, 2026 @ CARNESALE COMMONS";

const Header = () => {
  return (
    <header>
      <div className="container header__container">
        <div className="headerText">
          <h1>
            <span className="e">e</span>vening
            <br />
            <span className="with">with</span>
            <br />
            <span className="industry">
              industr<span className="y">y</span>
            </span>
          </h1>
          <div className="event__date">{eventDate}</div>
          <div className="contact_btn"></div>
        </div>
        <button class="button contact-button">
          <HashLink to="/#contact">
            <span className="contact-button-contents">
              contact us
              <img src={arrowIcon} alt="arrow pointing down" />
            </span>
          </HashLink>
        </button>
      </div>
    </header>
  );
};

export default Header;
