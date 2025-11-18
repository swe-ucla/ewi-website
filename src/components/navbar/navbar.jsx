import React from 'react';
import './navbar.css';
import LOGO from '../../assets/ewi_logo_2026.png'
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
                <HashLink className="tab" to="/#top">Home</HashLink>
                <HashLink className="tab" to="/student/#top">Students</HashLink>
                <HashLink className="tab" to="/company/#top">Companies</HashLink>
                <HashLink className="tab" to="/#committee">Meet the Team</HashLink>
                <HashLink className="tab" to="/#contact">Contact Us</HashLink>
            </div>
        </div>
    );
}

export default Navbar;

