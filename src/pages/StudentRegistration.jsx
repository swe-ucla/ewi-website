import React from "react";
import "./StudentRegistration.css";

const companiesList = [
    { id: 1, name: "City of Los Angeles Bureau of Engineering" },
    { id: 2, name: "Crane" },
    { id: 3, name: "GHD" },
    { id: 4, name: "Gilead Sciences" },
    { id: 5, name: "Parker Aerospace" },
    { id: 6, name: "PPG Industries" },
    { id: 7, name: "Qvest" },
    { id: 8, name: "Rehrig Pacific" },
    { id: 9, name: "SoCalGas" },
    { id: 10, name: "TP-Link Systems Inc." },
    { id: 11, name: "TriMas Aerospace" },
    { id: 12, name: "Niagara Bottling" },
    { id: 13, name: "Lockheed Martin" },
    { id: 14, name: "Accenture" },
]

const studentMajors = [
    { id: 1, name: "Aerospace Engineering" },
    { id: 2, name: "Bioengineering" },
    { id: 3, name: "Chemical Engineering" },
    { id: 4, name: "Civil Engineering" },
    { id: 5, name: "Computer Engineering" },
    { id: 6, name: "Computer Science" },
    { id: 7, name: "Computer Science and Engineering" },
    { id: 8, name: "Electrical Engineering" },
    { id: 9, name: "Materials Science and Engineering" },
    { id: 10, name: "Mechanical Engineering" },
    { id: 11, name: "Undeclared Engineering" },
    { id: 12, name: "Other:" },
]

const mealPreferences = [
    { id: 1, name: "Achiote-Marinated Portobello Sopes (Vegan)"},
    { id: 2, name: "Broccoli Pesto w/ Fusilli Pasta (Vegetarian)"}
]

const dessertPreferences = [
    { id: 1, name: "Seasonal Fresh Fruit Cup (Vegan)"},
    { id: 2, name: "Classic Opera Cake (Vegeterian)"}
]

const checkInTimes = [
    { id: 1, time: "5:30 - 5:45 PM"},
    { id: 2, time: "5:45 - 6:00 PM"},
    { id: 3, time: "6:00 - 6:15 PM"},
    { id: 4, time: "6:15 - 6:30 PM"},
    { id: 5, time: "6:30 - 6:45 PM"},

]
const StudentRegistrationForm = () => {
    return (
        <div className="student-reg-page">

            <div className="student-reg-header">
                <h1 className="student-reg-title">Student Registration</h1>
                <p>November, 20, 2026 - X:XX PM to X:XX PM - Carnesale Commons - Cost</p>
                <div className="ewi-info">
                    <p className="ewi-info-bold">What is EWI?</p>
                    <p className="ewi-desc">
                        EWI consists of a 3 part networking event: Casual networking over appetizers, a 3 course dinner with a company of your preference, and a traditional career fair.
                        EWI will take place in-person on Thursday, January 22nd, 2026 in Carnesale Commons from 5:30 PM -10:00 PM. A student survival guide and information on workshops
                         will be sent out shortly after registration.
                        <br /><br />
                        Registration is first come, first serve. The earlier you sign up, the more likely you will be to be seated with your top companies during dinner. Additionally, 
                        students who attend 4/5 Prep for EWI workshops will receive priority company pairings. This event is open to everyone regardless of gender. We will begin a 
                        waitlist as we hit capacity.
                    </p>
                </div>
            </div>

            <form className="student-reg-form">

                <fieldset className="student-contact-info">
                    <h3 className="student-reg-subtitle">Contact Info</h3>
                    <div className="student-email">
                        <label className="student-reg-labels">Email*</label>
                        <input className="input-box" type="email" placeholder="name@email.com"/>
                    </div>

                    <div className="student-pronouns">
                        <label className="student-reg-labels">Pronouns</label>
                        <select className="select-box">
                            <option value="" disabled selected hidden>Select one</option>
                            <option value="she/her/hers">she/her/hers</option>
                            <option value="he/him/hims">he/him/hims</option>
                            <option value="they/them/theirs">they/them/theirs</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="student-name">
                        <label className="student-reg-labels">Full name (first last)*</label>
                        <input  className="input-box"/>
                    </div>

                    <div className="uid">
                        <label className="student-reg-labels">UID</label>
                        <input className="input-box" />  
                    </div>
                </fieldset>

                <fieldset className="student-details">
                    <h3 className="student-reg-subtitle">Student Details</h3>
                    <div className="student-year">
                        <label className="student-reg-labels">Year</label>
                        <select className="select-box">
                            <option value="" disabled selected hidden>Select one</option>
                            <option value="first-year">First</option>
                            <option value="second-year">Second</option>
                            <option value="third-year">Third</option>
                            <option value="fouth-year">Fourth</option>
                            <option value="fifth-year-or-greater">Fifth+</option>
                            <option value="grad-student-masters">Grad Student - Master's</option>
                            <option value="grad-student-phd">Grad Student - PhD</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="transfer-status">
                        <label className="student-reg-labels">Transfer?</label>
                        <select className="select-box">
                            <option value="" disabled selected hidden>Select one</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>

                    <div className="student-major">
                        <label className="student-reg-labels">Major</label>
                        <select className="select-box">
                            <option value="" disabled selected hidden>Select one</option>
                            {studentMajors.map((major) => (
                                <option key={major.id} value={major.name}>{major.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="student-position-type">
                        <label className="student-reg-labels">What type of position are you looking for?</label>
                        <select className="select-box">
                            <option value="" disabled selected hidden>Select one</option>
                            <option value="full-time">Full-time</option>
                            <option value="coop">Co-op</option>
                            <option value="internship">Internship</option>
                        </select>
                    </div>

                    <div className="student-sponsorship">
                        <label className="student-reg-labels">Need Sponsorship?</label>
                        <select className="select-box">
                            <option value="" disabled selected hidden>Select one</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>

                    <div className="student-checkin">
                        <label className="student-reg-labels">When do you plan to come for check-in?</label>
                        <select className="select-box">
                            <option value="" disabled selected hidden>Select one</option>
                            {checkInTimes.map((timeSlot) => (
                                <option key={timeSlot.id} value={timeSlot.time}>{timeSlot.time}</option>
                            ))}
                        </select>
                    </div>
                </fieldset>

                <fieldset className="student-resume">
                    <h3 className="student-reg-subtitle">Resume</h3>
                    <div className="resume-upload">
                        <label className="student-reg-labels">Upload Resume*</label>
                        <input className="input-box" type="file" accept=".pdf" />
                        <p className="hint">Must be in format: Major_GradYear_First_Last.pdf</p>
                    </div>
                    
                </fieldset>

                <fieldset className="student-swe-membership">
                    <h3 className="student-reg-subtitle">SWE Membership</h3>
                    <div className="swe-id">
                        <label className="student-reg-labels">National SWE ID</label>
                        <input className="input-box" type="text" />
                    </div>

                    <div className="swe-membership-proof">
                        <label className="student-reg-labels">Upload proof of membership</label>
                        <input className="input-box" type="file" accept=".pdf,.jpg,.png" />
                    </div>
                </fieldset>

                <fieldset className="student-company-preferences">
                    <h3 className="student-reg-subtitle">Company Preferences</h3>
                    <p>Rank your top 10 companies in order of preference.</p>

                    <div className="company-preferences-grid">
                        <div className="company-choice">
                            <label className="student-reg-labels">1st choice</label>
                            <select className="select-box">
                                <option value="" disabled selected hidden>Select one</option>
                                {companiesList.map((company) => (
                                    <option key={company.id} value={company.name}>{company.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="company-choice">
                            <label className="student-reg-labels">2nd choice</label>
                            <select className="select-box">
                                <option value="" disabled selected hidden>Select one</option>
                                {companiesList.map((company) => (
                                    <option key={company.id} value={company.name}>{company.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="company-choice">
                            <label className="student-reg-labels">3rd choice</label>
                            <select className="select-box">
                                <option value="" disabled selected hidden>Select one</option>
                                {companiesList.map((company) => (
                                    <option key={company.id} value={company.name}>{company.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="company-choice">
                            <label className="student-reg-labels">4th choice</label>
                            <select className="select-box">
                                <option value="" disabled selected hidden>Select one</option>
                                {companiesList.map((company) => (
                                    <option key={company.id} value={company.name}>{company.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="company-choice">
                            <label className="student-reg-labels">5th choice</label>
                            <select className="select-box">
                                <option value="" disabled selected hidden>Select one</option>
                                {companiesList.map((company) => (
                                    <option key={company.id} value={company.name}>{company.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="company-choice">
                            <label className="student-reg-labels">6th choice</label>
                            <select className="select-box">
                                <option value="" disabled selected hidden>Select one</option>
                                {companiesList.map((company) => (
                                    <option key={company.id} value={company.name}>{company.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="company-choice">
                            <label className="student-reg-labels">7th choice</label>
                            <select className="select-box">
                                <option value="" disabled selected hidden>Select one</option>
                                {companiesList.map((company) => (
                                    <option key={company.id} value={company.name}>{company.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="company-choice">
                            <label className="student-reg-labels">8th choice</label>
                            <select className="select-box">
                                <option value="" disabled selected hidden>Select one</option>
                                {companiesList.map((company) => (
                                    <option key={company.id} value={company.name}>{company.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="company-choice">
                            <label className="student-reg-labels">9th choice</label>
                            <select className="select-box">
                                <option value="" disabled selected hidden>Select one</option>
                                {companiesList.map((company) => (
                                    <option key={company.id} value={company.name}>{company.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="company-choice">
                            <label className="student-reg-labels">10th choice</label>
                            <select className="select-box">
                                <option value="" disabled selected hidden>Select one</option>
                                {companiesList.map((company) => (
                                    <option key={company.id} value={company.name}>{company.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset className="student-meal-preferences">
                    <h3 className="student-reg-subtitle">Meal Preferences</h3>
                    <div className="meal-choice">
                        <label className="student-reg-labels">Meal</label>
                        <select className="select-box">
                            <option value="" disabled selected hidden>Select one</option>
                            {mealPreferences.map((meal) => (
                                <option key={meal.id} value={meal.name}>{meal.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="dessert-choice">
                        <label className="student-reg-labels">Dessert</label>
                        <select className="select-box">
                            <option value="" disabled selected hidden>Select one</option>
                            {dessertPreferences.map((dessert) => (
                                <option key={dessert.id} value={dessert.name}>{dessert.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="dietary-restrictions">
                        <label className="student-reg-labels">Dietary restrictions</label>
                        <input className="input-box" type="text" />
                    </div>
                </fieldset>

                <fieldset className="student-other">
                    <h3 className="student-reg-subtitle">Other</h3>
                    <div className="photo-consent">
                        <label className="student-reg-labels">
                            <input type="checkbox" />
                            I consent to SWE's use of my photos or videos from EWI 2026 for promotional purposes.
                        </label>
                    </div>

                    <div className="will-call">
                        <label className="student-reg-labels">Would you like to be considered for the will call?</label>
                        <select className="select-box">
                            <option value="" disabled selected hidden>Select one</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>

                    <div className="additional-comments">
                        <label className="student-reg-labels">Additional questions/comments</label>
                        <textarea className="input-box" rows={4}></textarea>
                    </div>
                </fieldset>

                <button className="student-reg-submit" type="submit">Submit</button>

            </form>
        </div>
    );
};

export default StudentRegistrationForm;