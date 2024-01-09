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
      <p style={{ marginInlineStart: '3em' }}>
          Student registration for Evening with Industry 2024 will open in January. Table assignments are first come, first serve, so be on the lookout to ensure you get to sit with your top choice company! Prices also increase every week, so you don’t want to miss out on the early bird discounts.
        </p>
        <br/>
        <p style={{ marginInlineStart: '3em' }}>
          If the cost of EWI is a barrier for you, please do not hesitate to contact us about discounted pricing options. We would love to have you at our event and want to ensure that financial aid is available to those who need it.
        </p>
        </div>
      </section>

      <section>
        <h2>EWI Prep Workshops</h2>
        <p style={{ marginInlineStart: '3em' }}>
        EWI Prep Workshops - fall, winter
        </p>
        <br/>

        <div className="rsvp_link">
        <p style={{ marginInlineStart: '3em' }}>
        To prepare our student attendees for EWI and entering the world of industry as a whole, we will be hosting workshops in the Winter quarter:
        </p>
        <p style={{ marginInlineStart: '5em' }}>
          <br/>
        LinkedIn & Personal Portfolio Workshop: January 16, 2024, 6-7PM, Boelter Hall 5436, <a href="https://docs.google.com/forms/d/e/1FAIpQLSdtCOzRUiOHoM1yu7elh9sacACvB7LrP3ZzVZqTWU6Fi3JwvA/viewform" target="_blank" rel="noopener noreferrer">RSVP</a>
        <br/>
        Networking and Career Fairs: January 18, 2024, 6-7PM, Young Hall 4216, <a className="rsvp_link" href="https://docs.google.com/forms/d/e/1FAIpQLSfO89TiyfCcos3UvPSQcV_R6xnD0N4cc2jBZKWAREIx-Zh4Pw/viewform" rel="noopener noreferrer" target="_blank">RSVP</a>
        <br/>
        Resume with Resume Review: January 25, 2024, 6-7PM, Location TBD
        <br/>
        Dinner Etiquette: February 1, 2024, 6-7PM, Location TBD
        <br/>

</p>
</div>
</section>

        <section>
        <h2>Student Survival Guide</h2>
          <PDFViewerStudent/>

        </section>

        <section>
        <h2>Other Questions?</h2>
      
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
