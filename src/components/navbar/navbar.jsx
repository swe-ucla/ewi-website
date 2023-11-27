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
            <div className="tabs">
                <div className="dropdown">
                    <a className="tab">Attend EWI</a>
                    <div className="dropdown-content">
                        <HashLink to="/student/#top">Students</HashLink>
                        <HashLink to="/company/#top">Companies</HashLink>
                    </div>
                </div>
                <HashLink to="/#about"><a href="#about" className="tab">About Us</a></HashLink>
            </div>
        </div>
    );
}

export default Navbar;

