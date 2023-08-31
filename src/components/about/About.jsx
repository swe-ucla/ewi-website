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
            <h2>About Us</h2>
            <div className="about__paragraph">
            <h4> 
            <p>Evening with Industry (EWI) is one of Society of Women Engineers’ flagship events and the largest student-run networking event on UCLA campus. In 2024, SWE @ UCLA will host the 47th annual Evening with Industry at UCLA’s Carnesale Commons. <br/></p>
            <p>At this event, we strive to create an environment that is more personal than a typical career fair. To do this, our event has a three-part structure: informal networking over appetizers, a multi-course catered dinner, and then a formal career fair. <br/></p>
            <p>During dinner, students get to sit with and talk to representatives from the company of their choice. The relaxed and informal dinner setting contrasts a high-stakes, fast-paced career fair, encouraging more unscripted conversations and allowing both parties to engage in more genuine conversation. The extended time and decreased pressure allows students and representatives to present themselves authentically and connect over shared experiences. <br/></p>
            <p>While the event is traditionally oriented towards women in engineering, <b>we welcome students of all genders and academic backgrounds</b> relevant to the engineering field. Our primary goal is to ensure that every attendee gains an enriching and worthwhile experience. </p>
            </h4>
         </div>
    </div>
      <h2><br/>Quote here</h2>
    </section>
  )
}

export default About