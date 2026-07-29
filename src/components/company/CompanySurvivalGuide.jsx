import React from "react";
import "./CompanySurvivalGuide.css";
import IssuuStyleFlipbook from "../flipbook/IssuuStyleFlipbook";
import company_guide from '../../assets/EWI 2025 Company Survival Guide.pdf';

const CompanySurvivalGuide = () => {
    return (
        <div className="company-survival-section">
            <div className="company-survival-guide">
                <h1 className="company-survival-title">Company Survival Guide</h1>
                <div className="company-registration-document">
                    <IssuuStyleFlipbook pdfFile={company_guide} scale={1.0} />
                </div>
            </div>
        </div>
    );
};

export default CompanySurvivalGuide;