import React from "react";
import "./StudentSurvivalGuide.css";
import IssuuStyleFlipbook from "../flipbook/IssuuStyleFlipbook";
import student_guide from "../../assets/ewi-50-SSG.pdf";

const StudentSurvivalGuide = () => {
    return (
        <div className="student-survival-section">
            <div className="student-survival-guide">
                <h1 className="student-survival-title">student survival guide</h1>
                <div className="student-registration-document">
                    <IssuuStyleFlipbook pdfFile={student_guide} scale={1.0} />
                </div>
            </div>
        </div>
    );
};

export default StudentSurvivalGuide;