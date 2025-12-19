import React from 'react'
import "./StudentHeader.css";
import student_header_text from "../../assets/student_header_text.svg";

const StudentHeader = () => {
  return (
    <div className="student-header">
      <div className="student-header-content">
        <img src={student_header_text} className="student-text" alt="Student Registration text" />
        <h3 className="h3">regular deadline by 0/0</h3>
        <button className="button">APPLY</button>
        <p className="p">Eligibility: Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
      </div>
    </div>
  )
}

export default StudentHeader
