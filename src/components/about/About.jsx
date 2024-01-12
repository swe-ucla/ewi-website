import React from 'react'
import './about.css'
import EWI2017 from '../../assets/ewi2017.jpg'
import COMMITTEE2023 from '../../assets/ewi2023committee.jpeg' 
import EWI2018_2 from '../../assets/ewi2018_2.jpg'


const About = () => {
  return (
    <section>
      <div className="container about__content"> 
            <h2>About Us</h2>
            <div className="about__paragraph">
              <p>Evening with Industry (EWI) is one of Society of Women Engineers’ flagship events and the largest student-run networking event on UCLA campus. In 2024, SWE @ UCLA will host the 47th annual Evening with Industry at UCLA’s Carnesale Commons. <br/></p>
              <p>At this event, we strive to create an environment that is more personal than a typical career fair. To do this, our event has a three-part structure: informal networking over appetizers, a multi-course catered dinner, and then a formal career fair. <br/></p>
              <p>During dinner, students get to sit with and talk to representatives from the company of their choice. The relaxed and informal dinner setting contrasts a high-stakes, fast-paced career fair, encouraging more unscripted conversations and allowing both parties to engage in more genuine conversation. The extended time and decreased pressure allows students and representatives to present themselves authentically and connect over shared experiences. <br/></p>
              <p>While the event is traditionally oriented towards women in engineering, <b>we welcome students of all genders and academic backgrounds</b> relevant to the engineering field. Our primary goal is to ensure that every attendee gains an enriching and worthwhile experience. </p>
          </div>
      </div>

      <div className="image_container"> 
      <div class="image_container-row">
        <div class="image_container-column">
          <div className="image_container-column-image">
            <p>As we host the 47th Evening with Industry at UCLA, we hope to continue our SWE Chapter’s longstanding tradition of diminishing the obstacles between students and breaking into industry. 
            </p>
            <p>We are happy to continue hosting EWI in-person in 2024, as we believe the opportunity for participants to immerse themselves in the atmosphere of the event leads to a more impactful experience.
            </p>
            <img src={EWI2017} style={{height:"91.5%", width:"91.5%"}} alt={'EWI 2017'}/>
            <div class="image_container-column-caption">EWI 2017</div>
          </div>
        </div>
        <div class="image_container-column">
          <div className="image_container-column-image">
            <img src={COMMITTEE2023} alt={'EWI Committee 2023'}/>
            <div class="image_container-column-caption">EWI Committee 2023</div>
          </div>
          <div className="column-image">
            <p> Our mission is to continue to make EWI accessible to all types of students and to match them with fulfilling roles at companies they are inspired by, and we hope that each student leaves EWI with confidence in their capabilities and a sense of belonging in engineering and industry as a whole. </p>
            <img src={EWI2018_2} alt={'EWI 2018'}/>
            <div class="image_container-column-caption">EWI 2018</div>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}

export default About