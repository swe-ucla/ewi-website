import React from 'react'
import './studentInfo.css'
import PDFViewerStudent from './PDFViewerStudent'
import SendMessage from '../sendMessage/sendMessage';

const StudentInfo = () => {
  return (
    <div className="container student__content">
      <section>
      <br/>
      <br/>
      <br/>
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

        <br/>

        <h2>EWI Prep Workshops</h2>
        <p style={{ marginInlineStart: '3em' }}>
        EWI Prep Workshops - fall, winter
        </p><p>

          Student registration for Evening with Industry 2024 will open in January. Table assignments are first come, first serve, so be on the lookout to ensure you get to sit with your top choice company! Prices also increase every week, so you don’t want to miss out on the early bird discounts.
        </p>
        <br/>

        <p style={{ marginInlineStart: '3em' }}>
        To prepare our student attendees for EWI and entering the world of industry as a whole, we will be hosting workshops for the Fall and Winter quarters:
        </p>
        <p style={{ marginInlineStart: '5em' }}>
          <br/>
        LinkedIn: January 16, 2024, 6-7PM, Location TBD 
        <br/>
        Networking: January 18, 2024, 6-7PM, Location TBD
        <br/>
        Resume with Resume Review: January 25, 2024, 6-7PM, Location TBD
        <br/>
        Dinner Etiquette: February 1, 2024, 6-7PM, Location TBD
        <br/>
</p>
<br/>
<br/>
<br/>
        <h2>Student Survival Guide</h2>
          <PDFViewerStudent/>

        <br/>
        <br/>
        
        <h2>Other Questions?</h2>
        <p style={{ marginInlineStart: '3em' }}>
        Send an email to student.liasion.ewi.swe.ucla@gmail.com!
        </p>

      <section>
        <p>Send us a message using the form below!</p>
        <br />
        <div className="container send_message">
          <SendMessage />
        </div>
      </section>


      </div>
  );
};

export default StudentInfo
