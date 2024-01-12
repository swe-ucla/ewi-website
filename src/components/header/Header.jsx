import React from 'react'
import './header.css'
import Timer from '../timer/Timer'

const eventDate = "februrary 8, 2024 @ carnesale commons"

const Header = () => {
  return (
    <header>
      
      <div className="container header__container">
        <div className="headerText">
          <h1>evening<br/>with<br/>industry.</h1>
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

export default Header