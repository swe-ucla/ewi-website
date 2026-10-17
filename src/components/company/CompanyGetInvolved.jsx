import React from "react";
import "./CompanyGetInvolved.css";
import { HiOutlineMail } from "react-icons/hi";

const blurb = "EWI offers a unique opportunity to connect with students beyond their resumes in a smaller, intimate dinner setting. Attend to meet some of UCLA’s most promising engineers through casual networking, a sit down dinner, and a formal career fair! This format creates a more personal experience than traditional career fairs, giving you a clearer picture of which candidates would be the best fit for your organization.";

const CompanyGetInvolved = () => {
    return (
        <div className="company-get-involved">
            <div className="company-get-involved-container">
                <h1 className="company-get-involved-title">why get involved?</h1>
                <div className="company-blurb-box">
                    <p className="company-blurb">{blurb}</p>
                </div>
                <a href="mailto:ewi.swe.ucla@gmail.com" className="company-questions-box">
                    <span>Questions?</span>
                    <HiOutlineMail className="company-questions-icon" />
                </a>
            </div>
        </div>
    );
};

export default CompanyGetInvolved;
