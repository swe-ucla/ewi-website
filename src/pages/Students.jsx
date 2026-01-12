import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

import StudentHeader from "../components/studentHeader/StudentHeader";
import IssuuStyleFlipbook from "../components/flipbook/IssuuStyleFlipbook";
import student_guide from "../assets/EWI Student Survival Guide 2024-2025.pdf";
import Testimonials from "../components/testimonials/Testimonials";
import Accordion from "../components/accordion/Accordion";

const Student = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="student">
      <StudentHeader />
      <div className="container">
        <div className="company-registration-document">
          <IssuuStyleFlipbook pdfFile={student_guide} scale={1.0} />
        </div>
        <Testimonials />
        <Accordion />
      </div>
    </div>
  );
};

export default Student;
