import React from 'react'
import "./StudentHeader.css";
import student_header_text from "../../assets/student_header_text.svg";

const StudentHeader = () => {
  return (
    <div className="student-header">
      <div className="student-header-content">
        <img src={student_header_text} className="student-text" alt="Student Registration text" />
        <h3 className="h3">regular deadline by 1/16</h3>
        <a className="button-link" href="https://docs.google.com/forms/d/1PfdlBL6_Ktjdf8y0rcf4T4torBHp0mVE85wQdN2TaOs/viewform?edit_requested=true" target="_blank" rel="noopener noreferrer">
          REGISTER
        </a>
        <p className="p">Registration is first come, first serve. The earlier you sign up, the more likely you will be to be seated with your top companies during dinner. This event is open to everyone regardless of gender. We will begin a waitlist as we hit capacity. </p>
        <p className="p">EWI is cost-free this year! Registration is first-come-first-serve, so make sure to submit the form as soon as possible.</p>
      </div>
    </div>
  )
}

export default StudentHeader
