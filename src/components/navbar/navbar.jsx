/*
import React from 'react'
import './navbar.css'


const Navbar = () => {
  return (
    
      <div className="container navbarheader__container">
        <h3>this header will have swe logo and buttons to other pages</h3>
      </div>
  )
}

export default Navbar
*/
// Navbar.js
// Navbar.js
import React from 'react';
import './navbar.css';

const Navbar = () => {
    return (
        <div className="navbar">
            <h2>SWE Logo</h2>
            <div className="tabs">
                <div className="dropdown">
                    <a href="/page1" className="tab">Attend EWI</a>
                    <div className="dropdown-content">
                        <a href="/subpage1">Students</a>
                        <a href="/subpage2">Companies</a>
                    </div>
                </div>
                <a href="#about" className="tab">About Us</a>
            </div>
        </div>
    );
}

export default Navbar;

