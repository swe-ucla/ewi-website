import React from 'react'
import './attend.css'
import CTA from './CTA'
import CTA2 from './CTA2'



const Attend = () => {
  return (
      <section>
        <div className="attend__container">
          <h2 >Attend EWI</h2>
          <CTA />
          <CTA2 />
          <h6 id='about'></h6>
        </div>
      </section>
  )
}

export default Attend