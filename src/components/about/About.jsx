import React from 'react'
import './about.css'
import SWEPHOTO from '../../assets/swe-logo-3.jpg'
import CTAabout from './CTAabout'
import {HiOutlineBookOpen} from 'react-icons/hi'
import {HiOutlineDesktopComputer} from 'react-icons/hi'
import {HiOutlineLightBulb} from 'react-icons/hi'


const About = () => {
  return (
    <section id='about'>
      <div className="container about__content"> 
            <h2><p>About Us</p></h2>
            <div className="about__paragraph">
            <h4> 
            <p> Evening with Industry (EWI) is one of Society of Women Engineers’ flagship events and the largest student-run networking event on UCLA campus. <br /></p>
            <p> In 2024, SWE @ UCLA will host the 47th annual Evening with Industry at UCLA’s Carnesale Commons. <br /></p>
            <p> At this event, we strive to create an environment that is more personal than a typical career fair and foster more genuine connections as a result. <br /></p>
            <p> To do this, our event has a three part structure: informal networking over appetizers, a dinner, and then a formal career fair. <br /></p>
            <p> During dinner, students get to sit with and talk to representatives from the company of their choice. The relaxed and informal dinner setting contrasts a high-stakes, fast-paced career fair, encouraging more unscripted conversations and allowing both parties to engage in more personal conversation. There is more time for students and representatives to present themselves authentically and connect over shared experiences. </p>
            
            </h4>
         </div>
    </div>

      <div className="container about__container">
        <div className="about__me">
          <div className="about__me-image">
            <img src={SWEPHOTO} alt="About Image" />
          </div>
        </div>

        <div className="about__content">
          <div className="about__cards">

            <article className='about__card'>
              <h2>Our goals</h2>
              <h4>While the event is traditionally oriented towards women in engineering, we welcome students of all genders and academic backgrounds relevant to the engineering field. Our primary goal is to ensure that every attendee gains an enriching and worthwhile experience.<br /><br />
              <b>Try to meet someone different than you?</b>
              </h4>
            </article>
          </div>
          
        </div>
      </div>
      <h2><br/>Quote here</h2>
    </section>
  )
}

export default About