import React from 'react';
import './about.css';
import EWI2024 from '../../assets/ewi committee 2024.png';
import DINNER from '../../assets/dinner.png'; 
import CAREER from '../../assets/career fair.png';

const About = () => {
  return (
    <section>
      

      {/* Row 1: About Us text on the left, four paragraphs on the right */}
      <div className="container about__content">
        <div className="about1__left">
        <h2>About Us</h2>
        </div>
        <div className="about1__right">
          <p>Evening with Industry (EWI) is one of Society of Women Engineers’ flagship events and the largest student-run networking event on UCLA campus. In 2025, SWE @ UCLA will host the 48th annual Evening with Industry at UCLA’s Carnesale Commons.</p>
          <p>At this event, we strive to create an environment that is more personal than a typical career fair. To do this, our event has a three-part structure: informal networking over appetizers, a multi-course catered dinner, and then a formal career fair. </p>
          <p>During dinner, students get to sit with and talk to representatives from the company of their choice. The relaxed dinner setting contrasts a high-stakes, fast-paced career fair, encouraging more unscripted conversations and allowing both parties to engage in more genuine conversation. The extended time and decreased pressure allows students and representatives to present themselves authentically and connect over shared experiences. </p>
          <p>While the event is traditionally oriented towards women in engineering, we welcome students of all genders and academic backgrounds relevant to the engineering field. Our primary goal is to ensure that every attendee gains an enriching and worthwhile experience. </p>
        </div>
      </div>

      <div className="divider"></div>

      {/* Row 2: Image on the left, two paragraphs on the right */}
      <div className="container about__content">
        <div className="about2__left">
          <img src={EWI2024} style={{ height: "100%", width: "100%" }} alt="EWI 2024" />
          <div className="image_caption">EWI Committee 2024</div>
        </div>
        <div className="about2__right">
          <p>As we host the 48th Evening with Industry at UCLA, we hope to continue our SWE Chapter’s longstanding tradition of diminishing the obstacles between students and breaking into industry.</p>
          <p>We are happy to continue hosting EWI in-person in 2025, as we believe the opportunity for participants to immerse themselves in the atmosphere of the event leads to a more impactful experience.</p>
        </div>
      </div>

      <div className="divider"></div>

      {/* Row 3: Text and image on the left, one image on the right */}
      <div className="container about__content">
        <div className="about3__left">
          <p>Our mission is to continue to make EWI accessible to all types of students and to match them with fulfilling roles at companies they are inspired by, and we hope that each student leaves EWI with confidence in their capabilities and a sense of belonging in engineering and industry as a whole.</p>
          <img src={DINNER} style={{ height: "100%", width: "100%" }} alt="EWI 20XX" />
          <div className="image_caption">EWI Dinner</div>
        </div>
        <div className="about3__right">
          <img src={CAREER} style={{ height: "90%", width: "90%" }} alt="EWI Committee 2024" />
          <div className="image_caption">EWI Career Fair</div>
        </div>
      </div>

      <div className="divider"></div>
    </section>
  );
};

export default About;
