import React from "react";

import StudentHeader from "../components/studentHeader/StudentHeader";
import StudentInfo from "../components/studentInfo/StudentInfo";

const Student = () => {
  return (
    <div className="student">
      <StudentHeader />
      <StudentInfo />
    </div>
  );
};

export default Student;
