import React from "react";
import "./about.css";
import EWI2024 from "../../assets/ewi_2024.png";
import COMMITTEE2024 from "../../assets/ewi_committee.png";
import EWI20XX from "../../assets/ewi_20xx.png";

const About = () => {
  return (
    <section>
      <div className="container about__content">
        <div class="custom-grid">
          <div>
            <h2>About Us</h2>
          </div>
          <div className="about__paragraph">
            <p>
              Evening with Industry (EWI) is one of Society of Women Engineers’
              flagship events and the largest student-run networking event on
              UCLA campus. In 2025, SWE @ UCLA will host the 49th annual Evening
              with Industry at UCLA’s Carnesale Commons.
            </p>
            <p>
              At this event, we strive to create an environment that is more
              personal than a typical career fair. To do this, our event has a
              three-part structure: informal networking over appetizers, a
              multi-course catered dinner, and then a formal career fair. 
            </p>
            <p>
              During dinner, students get to sit with and talk to
              representatives from the company of their choice. The relaxed
              dinner setting contrasts a high-stakes, fast-paced career fair,
              encouraging more unscripted conversations and allowing both
              parties to engage in more genuine conversation. The extended time
              and decreased pressure allows students and representatives to
              present themselves authentically and connect over shared
              experiences. 
            </p>
            <p>
              While the event is traditionally oriented towards women in
              engineering, we welcome students of all genders and academic
              backgrounds relevant to the engineering field. Our primary goal is
              to ensure that every attendee gains an enriching and worthwhile
              experience. 
            </p>
          </div>
        </div>
      </div>

      <div className="image_container">
        <div class="image_container-row">
          <div className="image_container-column-image">
            <img
              src={COMMITTEE2024}
              style={{ width: "700px", height: "415px" }}
              alt={"EWI Committee 2024"}
            />
            <div class="image_container-column-caption">EWI Committee 2024</div>
          </div>

          <div class="image_container-column image_container-text">
            <p>
              As we host the 48th Evening with Industry at UCLA, we hope to
              continue our SWE Chapter’s longstanding tradition of diminishing
              the obstacles between students and breaking into industry.
            </p>
            <p>
              We are happy to continue hosting EWI in-person in 2025, as we
              believe the opportunity for participants to immerse themselves in
              the atmosphere of the event leads to a more impactful experience.
            </p>
          </div>
        </div>

        <div class="image_container-row">
          <div class="image_container-column image_container-text">
            <p>
              Our mission is to continue to make EWI accessible to all types of
              students and to match them with fulfilling roles at companies they
              are inspired by, and we hope that each student leaves EWI with
              confidence in their capabilities and a sense of belonging in
              engineering and industry as a whole.{" "}
            </p>
            <div className="image_container-column-image">
              <img
                src={EWI2024}
                style={{ width: "701px", height: "318px" }}
                alt={"EWI 2024"}
              />
              <div class="image_container-column-caption">EWI 2024</div>
            </div>
          </div>

          <div className="image_container-column-image">
            <img
              src={EWI20XX}
              style={{ width: "430px", height: "500px", marginTop: "-4rem" }}
              alt={"EWI 2024"}
            />
            <div class="image_container-column-caption-right">EWI 2024</div>
          </div>
        </div>

        {/* <div class="image_container-row" style={{display: "flex"}}>
          <div className="image_container-column-image" style={{width: "1500px"}}>
            <div class="image_container-column image_container-text">
              <p>Our mission is to continue to make EWI accessible to all types of students and to match them with fulfilling roles at companies they are inspired by, and we hope that each student leaves EWI with confidence in their capabilities and a sense of belonging in engineering and industry as a whole.  </p>
            </div>
            <img src={EWI2024} style={{width: "701px", height: "318px"}}  alt={'EWI 2024'}/>
            <div class="image_container-column-caption">EWI 2024</div>
          </div>

          <div className="image_container-column-image" style={{marginLeft: '-700px', marginTop: "-60px", maxWidth: "100%"}}>
          <img src={EWI20XX} style={{width: "402px", height: "475px"}} alt={'EWI 20XX'}/>
          <div class="image_container-column-caption" style={{textAlign: "right"}}>EWI 20XX</div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default About;
