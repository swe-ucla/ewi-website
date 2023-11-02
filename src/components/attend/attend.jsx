import React from 'react'
import './attend.css'
import CTA from './CTA'
import CTA2 from './CTA2'



const Attend = () => {
  return (
      <section id="attend">
        <div className="attend__container">
          <h2>Attend EWI</h2>
          <CTA />
          <CTA2 />
        </div>
      </section>
  )
}

export default Attend