import React from 'react'
import './studentInfo.css'
import PDFViewerStudent from './PDFViewerStudent'

const StudentInfo = () => {
  return (
    <div className="container student__content">
      <br/>
      <h2>Registration</h2>
      <div className="studentInfo__paragraph">
        <p style={{ marginInlineStart: '3em' }}>
          Student registration for Evening with Industry 2024 will open in January. Table assignments are first come, first serve, so be on the lookout to ensure you get to sit with your top choice company! Prices also increase every week, so you don’t want to miss out on the early bird discounts.
        </p>
        <br/>
        <p style={{ marginInlineStart: '3em' }}>
          If the cost of EWI is a barrier for you, please do not hesitate to contact us about discounted pricing options. We would love to have you at our event and want to ensure that financial aid is available to those who need it.
        </p>

        <br/>

        <p style={{ marginInlineStart: 0 }}/>
        <h2>EWI Prep Workshops</h2>
        <p style={{ marginInlineStart: '3em' }}>
          Student registration for Evening with Industry 2024 will open in January. Table assignments are first come, first serve, so be on the lookout to ensure you get to sit with your top choice company! Prices also increase every week, so you don’t want to miss out on the early bird discounts.
        </p>
        <br/>
        <p style={{ marginInlineStart: '3em' }}>
        To prepare our student attendees for EWI and entering the world of industry as a whole, we will be hosting workshops for the Fall and Winter quarters. Check out the quick list of workshop dates and registration links below:
        </p>

        <br/>

        <h2>Student Survival Guide</h2>
        <p style={{ marginInlineStart: '4em' }}/>
        <br/>
          <PDFViewerStudent/>

        <br/>
        <p style={{ marginInlineStart: 0 }}/>
        <h2>Other Questions?</h2>
        <p style={{ marginInlineStart: '3em' }}>
        Send an email to student.liasion.ewi.swe.ucla@gmail.com !
        </p>


      </div>
    </div>
  );
};

export default StudentInfo
