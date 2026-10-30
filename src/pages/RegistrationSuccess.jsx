import React from "react";
import { Link, useLocation } from "react-router-dom";
import mascot from "../assets/home-2026/mascot.png";
import "./StudentRegistration.css";
import "./RegistrationSuccess.css";

const RegistrationSuccess = () => {
    const location = useLocation();
    const isWaitlist = Boolean(location.state?.waitlist);

    return (
        <div className="student-reg-page reg-success-page">
            <div className="reg-success">
                <img
                    className="reg-success__mascot"
                    src={mascot}
                    alt=""
                    width={420}
                    height={475}
                />

                <div className="reg-success__panel">
                    <h1 className="reg-success__title">you're registered</h1>
                    <p className="reg-success__tagline">harvest your potential</p>

                    {isWaitlist ? (
                        <p className="reg-success__lead">
                            You're on the waitlist for EWI 2026.
                            <br />
                            We'll reach out if a spot opens.
                        </p>
                    ) : (
                        <p className="reg-success__lead">
                            You're registered for EWI 2026.
                            <br />
                            We look forward to seeing you there!
                        </p>
                    )}

                    <ul className="reg-success__list">
                        <li>
                            As the event approaches, you'll get a confirmation email with the student
                            survival guide.
                        </li>
                        <li>
                            Updated resume? Email{" "}
                            <a href="mailto:student.liaison.ewi.swe.ucla@gmail.com">
                                student.liaison.ewi.swe.ucla@gmail.com
                            </a>{" "}
                            by Jan. 16 @ 11:59 PM.
                        </li>
                    </ul>

                    <Link to="/students" className="student-reg-submit reg-success__btn">
                        Back to Students
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegistrationSuccess;
