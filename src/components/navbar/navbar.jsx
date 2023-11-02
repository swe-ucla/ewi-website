import React from 'react';
import './navbar.css';
import LOGO from '../../assets/swe-ewi-new.png'
import {Link} from "react-router-dom";
import {HashLink} from "react-router-hash-link";

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="logo">
                <Link to="/"> <img src={LOGO} alt={'logo'}/> </Link>
            </div>
            <div className="tabs">
                <div className="dropdown">
                    <a className="tab">Attend EWI</a>
                    <div className="dropdown-content">
                        <Link to="">Students</Link>
                        <Link to="/company">Companies</Link>
                    </div>
                </div>
                <HashLink to="/#about"><a href="#about" className="tab">About Us</a></HashLink>
            </div>
        </div>
    );
}

export default Navbar;

