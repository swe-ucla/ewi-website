import React from 'react';
import './navbar.css';
import LOGO from '../../assets/swe-ewi-new.png'
import {Link} from "react-router-dom";
import {HashLink} from "react-router-hash-link";

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="logo">
                <HashLink to="/#top"> <img src={LOGO} alt={'logo'}/> </HashLink>
            </div>

            {/* mini menu */}
            <input class="side-menu" type="checkbox" id="side-menu"/>
            <label class="hamb" for="side-menu"><span class="hamb-line"></span></label>

            {/* full size navbar */}
            <div className="tabs">
                <div className="dropdown">
                    <a className="tab">Attend EWI</a>
                    <div className="dropdown-content">
                        <HashLink className="hash-link" to="/student/#top">Students</HashLink>
                        <HashLink className="hash-link" to="/company/#top">Companies</HashLink>
                    </div>
                </div>
                <HashLink className="hash-link" to="/#about"><a className="tab about" href="#about">About Us</a></HashLink>
            </div>
        </div>
    );
}

export default Navbar;

