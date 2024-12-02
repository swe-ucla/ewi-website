import React from 'react'
import './studentInfo.css'
import PDFViewerStudent from './PDFViewerStudent'
import SendMessage from '../sendMessage/sendMessage';
import student_guide from '../../assets/Updated SSG.pdf';


const StudentInfo = () => {
  return (
    <div className="container coming_soon">
      <p>Coming Soon!</p>
    </div>
    // <div className="container student__content">
    //     <h2>Registration</h2>
    //     <div className="student__paragraph">
    //       <p>
    //           Student registration for Evening with Industry 2024 opened on January 11, 2024 at 9 PM. Everyone is invited, regardless of gender. Table assignments are first come, first serve, register as soon as possible to ensure you get to sit with your top choice company! We will also begin a waitlist as we hit capacity.* 
    //       </p>
    //       <br/>
    //       <a className="btn" href="https://docs.google.com/forms/d/1ifw7WO5da8OaMP1yaPWfvdGZP80MlKe4R2ytlkhftbU/viewform?edit_requested=true" target="_blank" rel="noopener noreferrer">Student Registration Form</a>
    //       <br/>
    //       <br/>
    //       <p>***STUDENT REGISTRATION FOR EWI 2024 HAS CLOSED ON 2/2/24</p>
    //       <br/>
    //       <p style={{textDecoration: 'underline'}}>
    //         Dates for Registration Prices: 
    //         <br/>
    //       </p>
    //       <ul>
    //         <li>Coming Soon!</li>
    //       </ul>
    //       <br />
    //       <p>
    //         Prices increase every week, so you don’t want to miss out on the early bird discounts. If the cost of EWI is a barrier for you, please do not hesitate to contact us about discounted pricing options. We would love to have you at our event and want to ensure that financial aid is available to those who need it.
    //       </p>
    //       <br />
    //       <p> IMPORTANT: Evening with Industry will be on February 8, 2024 from 5:30-10:00 PM. If you cannot attend before 6:45 PM, please DO NOT register. Unfortunately, we are unable to save you seat. </p>
    //     </div>
    //     <h2>EWI Prep Workshops</h2>
    //     <div className="rsvp_link">
    //       <p>
    //       To prepare our student attendees for EWI and entering the world of industry as a whole, we will be hosting the following workshops in the Winter 2024 quarter:
    //       </p>
    //       <p>
    //         <br/>
    //       <ul>
    //         <li>LinkedIn & Personal Portfolio Workshop: January 16, 2024, 6-7PM, Boelter Hall 5436, <a href="https://docs.google.com/forms/d/e/1FAIpQLSdtCOzRUiOHoM1yu7elh9sacACvB7LrP3ZzVZqTWU6Fi3JwvA/viewform" target="_blank" rel="noopener noreferrer">RSVP</a></li>
    //         <br/>
    //         <li>Networking and Career Fairs Workshop: January 18, 2024, 6-7PM, Young Hall 4216, <a className="rsvp_link" href="https://docs.google.com/forms/d/e/1FAIpQLSfO89TiyfCcos3UvPSQcV_R6xnD0N4cc2jBZKWAREIx-Zh4Pw/viewform" rel="noopener noreferrer" target="_blank">RSVP</a></li>
    //         <br/>
    //         <li>Resume/Cover Letter Tips & Review Workshop: January 25, 2024, 6-7PM, Boelter Hall 5264, <a className="rsvp_link" href="https://forms.gle/TRdn8LWJX9LjCm5G9" target="_blank" rel="noopener noreferrer">RSVP</a></li>
    //         <br/>
    //         <li>Dinner Etiquette Workshop: February 1, 2024, 6-7PM, Boelter Hall 5264, <a className="rsvp_link" href="https://forms.gle/JzurD93RYabu1B3Y9" target="_blank" rel="noopener noreferrer">RSVP</a> </li>
    //       </ul>
    //       </p>
    //     </div>
    //     <h2>Student Survival Guide</h2>
    //     {/* <div className='container pdf_container'>
    //       <PDFViewerStudent/>
    //     </div> */}
    //     <iframe 
    //     src={student_guide}
    //     style={{
    //         alignSelf: 'center',
    //         width: '80%',
    //         height: `60rem`,
    //         border: 'none',
    //         display: 'block',
    //         padding: '1rem'
    //     }}
    //     />
    //     <h2>Other Questions?</h2>
    //     <p>Send us a message using the form below!</p>
    //     <br />
    //     <div className="container send_message">
    //       <SendMessage />
    //     </div>
    //   </div>
  );
};

export default StudentInfo
