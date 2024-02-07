import React from 'react'
import './attend.css'
import CTA from './CTA'
import CTA2 from './CTA2'
import Timer from '../timer/Timer'


const Attend = () => {
  return (
      <section>
        <h6 id='attend'></h6>
        <div className="attend__container">
          <h2 >Attend EWI</h2>
          <p className="date"> February 8, 2024, 5:30-10:00 PM @ Carnesale Commons </p>
          <Timer/>
          <CTA />
          <CTA2 />
          <h6 id='about'></h6>
        </div>
      </section>
  )
}

export default Attend