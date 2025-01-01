import React from 'react'
import './studentInfo.css'
import PDFViewerStudent from './PDFViewerStudent'
import SendMessage from '../sendMessage/sendMessage';
import student_guide from '../../assets/Updated SSG.pdf';


const StudentInfo = () => {
  return (
    <div className="container student__content">
      <div className="student__info">
        <h2>Registration</h2>
        <div className="student__paragraph">
          <p>
              Student registration for Evening with Industry 2025 has not opened yet. Everyone is invited, regardless of gender. Table assignments are first come, first serve, register as soon as possible to ensure you get to sit with your top choice company! We will also begin a waitlist as we hit capacity.* 
          <br/><br/>
          <a className="btn" href="https://docs.google.com/forms/d/1ifw7WO5da8OaMP1yaPWfvdGZP80MlKe4R2ytlkhftbU/viewform?edit_requested=true" target="_blank" rel="noopener noreferrer">Student Registration Form</a>
          <br/>
          <br/>
          <br/>
          <div style={{textDecoration: 'underline'}}>
            Dates for Registration Prices: </div>
            <br/>
          <ul>
            <li>1/6 @ 9:00PM (Nationally-registered SWE member drop): $7 for nationally registered SWE members </li>
            <li>1/8 - 1/14 @ 9:00PM: $7 for nationally registered SWE members / $12 for non-members </li>
            <li>1/14 - 1/21 @ 9:00PM: $12 for nationally registered SWE members / $17 for non-members</li>
          </ul>
          <br />
          Prices increase every week, so you don’t want to miss out on the early bird discounts. If the cost of EWI is a barrier for you, please do not hesitate to contact us about discounted pricing options. We would love to have you at our event and want to ensure that financial aid is available to those who need it.
          <br /><br />
          IMPORTANT: Evening with Industry will be on January 28th from 5:30-10:00 PM. If you cannot attend before 6:45 PM, please DO NOT register. Unfortunately, we are unable to save you seat. </p>
        </div>


        <h2>EWI Prep Workshops</h2>
        <div className="rsvp_link">
          <p>
          To prepare our student attendees for EWI and entering the world of industry as a whole, we will be hosting the following workshops in the Winter 2024 quarter:
            <br/>
            <br/>
            <ul>
            <li>Lockheed Martin Resume Workshop: January 13, 2025, 6-7PM, Location TBD, <a href="https://docs.google.com/forms/d/e/1FAIpQLSdy2eC5XyqJcjiFcPtAoBpcXc1hMVlaL8JftI0cS30r6aRO5A/viewform" target="_blank" rel="noopener noreferrer">RSVP</a></li>
            <li>CDM Smith Interview Workshop: January 15, 2025, 6-7PM, Location TBD, <a href="https://docs.google.com/forms/d/e/1FAIpQLSddrrmgktM3qrT0KJLUNUMCP1V6H-y7vC-sAC43F-YhNgM2rw/viewform" target="_blank" rel="noopener noreferrer">RSVP</a></li>
            <li>Presenting Yourself Doesn’t Have to Be So Puzzling Workshop: January 21, 2025, 6-7PM, Location TBD, <a href="https://forms.gle/8eAbF6uJmAQPGkb86" target="_blank" rel="noopener noreferrer">RSVP</a></li>

            </ul>
          </p>
        </div>


        <h2>Student Survival Guide</h2>
        <iframe 
        src={student_guide}
        style={{
            alignSelf: 'center',
            width: '80%',
            height: `60rem`,
            border: 'none',
            display: 'block',
            marginTop: '3rem',
        }}
        />


        <h2>Other Questions</h2>
        <p>Send us a message using the form below!
        <br /><br />
          <SendMessage />
        </p>
      </div>
      </div>
  );
};

export default StudentInfo
