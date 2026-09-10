import React from "react";
import { Link } from "react-router-dom";
import "./RegistrationSuccess.css";

const RegistrationSuccess = () => {
    return (
        <div className="reg-success-page">
            <div className="reg-success-card">
                <div className="reg-success-icon">✓</div>
                <h1 className="reg-success-title">Thank You for Registering for EWI 2026</h1>
                <p className="reg-success-badge">Waitlist Only</p>
                <p className="reg-success-message">
                    If you are selected from the waitlist, you will receive an email about how to proceed.
                </p>

                <div className="reg-success-details">
                    <p className="reg-success-details-intro">
                        As the event approaches, here is some information you should keep in mind:
                    </p>
                    <ul className="reg-success-list">
                        <li>
                            You will receive a registration confirmation email, attached will be the
                            student survival guide.
                        </li>
                        <li>
                            If you would like to submit an updated resume, please email{" "}
                            <a href="mailto:student.liaison.ewi.swe.ucla@gmail.com" className="reg-success-link">
                                student.liaison.ewi.swe.ucla@gmail.com
                            </a>{" "}
                            with the attached copy by Jan. 16 @ 11:59 PM.
                        </li>
                        <li>
                            To stay updated, please keep an eye on your email and follow our Instagram:{" "}
                            <a
                                href="https://www.instagram.com/uclasweewi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="reg-success-link"
                            >
                                @uclasweewi
                            </a>
                        </li>
                    </ul>
                </div>

                <p className="reg-success-signoff">We look forward to seeing you there!!</p>

                <Link to="/students" className="reg-success-btn">Back to Students Page</Link>
            </div>
        </div>
    );
};

export default RegistrationSuccess;
