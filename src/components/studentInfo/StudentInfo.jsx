import React from 'react'
import './studentInfo.css'
import PDFViewerStudent from './PDFViewerStudent'
import SendMessage from '../sendMessage/sendMessage';

const StudentInfo = () => {
  return (
    <div className="container student__content">
      <section>
      <h2>Registration</h2>
      <div className="studentInfo__paragraph">
        <p>
          Student registration for Evening with Industry 2024 will open in January. Table assignments are first come, first serve, so be on the lookout to ensure you get to sit with your top choice company! Prices also increase every week, so you don’t want to miss out on the early bird discounts.
        </p>
        <p>
          If the cost of EWI is a barrier for you, please do not hesitate to contact us about discounted pricing options. We would love to have you at our event and want to ensure that financial aid is available to those who need it.
        </p>
        </div>
      </section>

      
      <div className="studentInfo__paragraph">
        <section>
        <h2>EWI Prep Workshops</h2>
        <p>
          Student registration for Evening with Industry 2024 will open in January. Table assignments are first come, first serve, so be on the lookout to ensure you get to sit with your top choice company! Prices also increase every week, so you don’t want to miss out on the early bird discounts.
        </p>
        
        <p>
        To prepare our student attendees for EWI and entering the world of industry as a whole, we will be hosting workshops for the Fall and Winter quarters. Check out the quick list of workshop dates and registration links below:
        </p>
        </section>
      </div>

      <section>
        <div className="studentInfo__paragraph">
        <h2>Student Survival Guide</h2>
          <PDFViewerStudent/>
          </div>
      </section>

        
      <section>
        <div className="studentInfo__paragraph">
        <h2>Other Questions?</h2>
        <p>Send us a message using the form below!</p>
        <br />
        <div className="container send_message">
          <SendMessage />
        </div>
        </div>
      </section>


      </div>
  );
};

export default StudentInfo
