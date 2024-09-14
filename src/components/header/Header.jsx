import React from 'react'
import './header.css'
import Timer from '../timer/Timer'

const eventDate = "JAN 28TH, 2025 @ CARNESALE COMMONS"

const Header = () => {
  return (
    <header>
      
      <div className="container header__container">
        <div className="headerText">
          <h1>
            <span className="e">e</span>vening<br/>
            <span className="with">with</span><br/>
            <span className="industry">industr<span className="y">y</span></span>
          </h1>
          <div className='event__date'>
            {eventDate}
          </div>
        </div>
        <h4 className="text-light" id="attend">
        </h4>
      </div>
    </header>
  )
}

export default Header;
