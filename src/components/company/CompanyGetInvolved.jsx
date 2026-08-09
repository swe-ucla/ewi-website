import React from "react";
import "./CompanyGetInvolved.css";
import { HiOutlineMail } from "react-icons/hi";

const stats = [
    { title: "title", description: "At EWI, you'll connect with students beyond their resumes through meaningful conversations over dinner." },
    { title: "title", description: "Students join you at your table, where they ask thoughtful questions and share their interests and goals." },
    { title: "title", description: "This format creates a more personal experience than traditional career fairs, giving you a clearer picture of which candidates would be the best fit for your organization." }
]

const CompanyGetInvolved = () => {
    return (
        <div className="company-get-involved">
            <div className="company-get-involved-container">
                <h1 className="company-get-involved-title">Why get involved?</h1>
                <div className="company-stats-container">
                    {stats.map((stat, index) => (
                        <div className="company-stat-box" key={index}>
                            <div className="company-stat-title">
                                <h3 className="company-stat-number">{stat.title}</h3>
                            </div>
                            <p className="company-stat-description">{stat.description}</p>
                        </div>
                    ))}
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
