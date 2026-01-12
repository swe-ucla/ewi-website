import React from "react";

import StudentHeader from "../components/studentHeader/StudentHeader";
import PDFViewerStudent from "../components/studentInfo/PDFViewerStudent";
import Testimonials from "../components/testimonials/Testimonials";
import Accordion from "../components/accordion/Accordion";
// import StudentInfo from "../components/studentInfo/StudentInfo";

const Student = () => {
  return (
    <div className="student">
      <StudentHeader />
      <div className="container">
        <PDFViewerStudent />
        {/* <StudentInfo /> */}
        <Testimonials />
        <Accordion />
      </div>
    </div>
  );
};

export default Student;
