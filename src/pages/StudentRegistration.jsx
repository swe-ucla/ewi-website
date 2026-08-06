import React, { useRef, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import "./StudentRegistration.css";

const CLOUDINARY_URL = "...";
const CLOUDINARY_UPLOAD_PRESET = "...";

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
    { id: 12, name: "Other" },
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
    const [formData, setFormData] = useState({
        email: "",
        pronouns: "",
        otherPronouns: "",
        fullName: "",
        uid: "",
        year: "",
        transfer: "",
        major: "",
        otherMajor: "",
        positionType: "",
        needSponsorship: "",
        checkInTime: "",
        resume: null,
        membershipId: "",
        membershipProof: null,
        companyPreferences: new Array(10).fill(""),
        meal: "",
        dessert: "",
        dietaryRestrictions: "",
        photoConsent: false,
        willCall: "",
        additionalComments: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resumeInputRef = useRef(null);
    const membershipProofInputRef = useRef(null);

    // handling form change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: checked }));
    }

    const handleCompanyRankChange = (rankIndex, selectedCompany) => {
        setFormData((prev) => {
            const updated = [...prev.companyPreferences];
            updated[rankIndex] = selectedCompany;
            return { ...prev, companyPreferences: updated };
        }) 
    }

    const handleResumeChange = (e) => {
        setFormData((prev) => ({ ...prev, resume: e.target.files[0] || null }));
    };

    const clearResume = () => {
        setFormData((prev) => ({ ...prev, resume: null }));
        if (resumeInputRef.current) resumeInputRef.current.value = "";
    };

    const handleMembershipProofChange = (e) => {
        setFormData((prev) => ({ ...prev, membershipProof: e.target.files[0] || null }));
    };

    const clearMembershipProof = () => {
        setFormData((prev) => ({ ...prev, membershipProof: null }));
        if (membershipProofInputRef.current) membershipProofInputRef.current.value = "";
    };

    // input validation
    const validateField = (label, value) => {
        return value && value.toString().trim() ? "" : `${label} is required`;
    }

    const validateFile = (label, file) => (file ? "" : `${label} is required`);

    const validateNumeric = (label, value) => {
        if (!value || !value.toString().trim()) return `${label} is required`;
        return /^\d+$/.test(value.toString().trim()) ? "" : `${label} must contain numbers only`;
    }

    const validateCompanyPreferences = (preferences) => {
        const filled = preferences.filter((p) => p !== "");
  
        if (filled.length < preferences.length) {
            return "Please rank all 10 company preferences";
        }
        
        return "";
    }

    const valdiateCheckbox = (label, isChecked) => {
        return isChecked ? "" : `You must agree to ${label}`;
    }

    // cloudinary upload
    const uploadToCloudinary = async (file) => {
        console.log("Will upload to Cloudinary (placeholder): ", file.name);
        await new Promise((resolve) => setTimeout(resolve, 300));
        return `https://placeholder-url.com/${file.name}`;
    }

    // handle submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {
            email: validateField("Email", formData.email),
            pronouns: validateField("Pronouns", formData.pronouns),
            otherPronouns: formData.pronouns === "other" ? validateField("Pronouns", formData.otherPronouns) : "",
            fullName: validateField("Full name", formData.fullName),
            uid: validateNumeric("UID", formData.uid),
            year: validateField("Year", formData.year), 
            transfer: validateField("Transfer status", formData.transfer),
            major: validateField("Major", formData.major), 
            otherMajor: formData.major === "Other" ? validateField("Major", formData.otherMajor) : "", 
            positionType: validateField("Position type", formData.positionType), 
            needSponsorship: validateField("Sponsorship status", formData.needSponsorship), 
            checkInTime: validateField("Check-in time", formData.checkInTime), 
            resume: validateFile("Resume", formData.resume), 
            membershipId: "",
            membershipProof: null,
            companyPreferences: validateCompanyPreferences(formData.companyPreferences),
            meal: validateField("Meal", formData.meal),
            dessert: validateField("Dessert", formData.dessert), 
            dietaryRestrictions: "",
            photoConsent: valdiateCheckbox("the photo consent", formData.photoConsent), 
            willCall: validateField("Will call status", formData.willCall), 
            additionalComments: "", 
        };

        setErrors(newErrors);
        if (Object.values(newErrors).some((msg) => msg)) return;

        setIsSubmitting(true);

        try {
            let resumeUrl = null;
            let membershipProofUrl = null;

            if (formData.resume) {
                resumeUrl = await uploadToCloudinary(formData.resume);
            }
            if (formData.membershipProof) {
                membershipProofUrl = await uploadToCloudinary(formData.membershipProof);
            }
            
            const dataToSave = { ...formData, resume: resumeUrl, membershipProof: membershipProofUrl };
            await addDoc(collection(db, "Registrations"), dataToSave);

            console.log("Registration submitted successfully");
        } catch (error) {
            console.error("File upload failed: ", error);
            alert("There was an error submitting your registration. Please try again.");
        } finally {
            setIsSubmitting(false);
        }

    };

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

            <form className="student-reg-form" onSubmit={handleSubmit}>

                <fieldset className="student-contact-info">
                    <h3 className="student-reg-subtitle">Contact Info</h3>
                    <div className="student-email">
                        <label className="student-reg-labels">Email*</label>
                        <input className="input-box" type="email" placeholder="name@email.com" value={formData.email} name="email" onChange={handleChange}/>
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>

                    <div className="student-pronouns">
                        <label className="student-reg-labels">Pronouns*</label>
                        <select className="select-box" value={formData.pronouns} name="pronouns" onChange={handleChange}>
                            <option value="" disabled hidden>Select one</option>
                            <option value="she/her/hers">she/her/hers</option>
                            <option value="he/him/hims">he/him/hims</option>
                            <option value="they/them/theirs">they/them/theirs</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.pronouns && <span className="error">{errors.pronouns}</span>}

                        {formData.pronouns === "other" && (
                            <>
                            <input
                                type="text"
                                name="otherPronouns"
                                placeholder="Enter your pronouns"
                                value={formData.otherPronouns}
                                onChange={handleChange}
                                className="input-box"
                            />
                            {errors.otherPronouns && <span className="error">{errors.otherPronouns}</span>}
                            </>
                        )}
                    </div>

                    <div className="student-name">
                        <label className="student-reg-labels">Full name (first last)*</label>
                        <input className="input-box" value={formData.fullName} name="fullName" onChange={handleChange}/>
                        {errors.fullName && <span className="error">{errors.fullName}</span>}
                    </div>

                    <div className="uid">
                        <label className="student-reg-labels">UID*</label>
                        <input className="input-box" value={formData.uid} name="uid" onChange={handleChange}/>
                        {errors.uid && <span className="error">{errors.uid}</span>}
                    </div>
                </fieldset>

                <fieldset className="student-details">
                    <h3 className="student-reg-subtitle">Student Details</h3>
                    <div className="student-year">
                        <label className="student-reg-labels">Year*</label>
                        <select className="select-box" value={formData.year} name="year" onChange={handleChange}>
                            <option value="" disabled hidden>Select one</option>
                            <option value="first-year">First</option>
                            <option value="second-year">Second</option>
                            <option value="third-year">Third</option>
                            <option value="fouth-year">Fourth</option>
                            <option value="fifth-year-or-greater">Fifth+</option>
                            <option value="grad-student-masters">Grad Student - Master's</option>
                            <option value="grad-student-phd">Grad Student - PhD</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.year && <span className="error">{errors.year}</span>}
                    </div>

                    <div className="transfer-status">
                        <label className="student-reg-labels">Transfer?*</label>
                        <select className="select-box" value={formData.transfer} name="transfer" onChange={handleChange}>
                            <option value="" disabled  hidden>Select one</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                        {errors.transfer && <span className="error">{errors.transfer}</span>}
                    </div>

                    <div className="student-major">
                        <label className="student-reg-labels">Major*</label>
                        <select className="select-box" value={formData.major} name="major" onChange={handleChange}>
                            <option value="" disabled  hidden>Select one</option>
                            {studentMajors.map((major) => (
                                <option key={major.id} value={major.name}>{major.name}</option>
                            ))}
                        </select>
                        {errors.major && <span className="error">{errors.major}</span>}

                        {formData.major === "Other" && (
                            <>
                            <input
                                type="text"
                                name="otherMajor"
                                placeholder="Enter your major"
                                value={formData.otherMajor}
                                onChange={handleChange}
                                className="input-box"
                            />
                            {errors.otherMajor && <span className="error">{errors.otherMajor}</span>}
                            </>
                        )}
                    </div>

                    <div className="student-position-type">
                        <label className="student-reg-labels">What type of position are you looking for?*</label>
                        <select className="select-box" value={formData.positionType} name="positionType" onChange={handleChange}>
                            <option value="" disabled  hidden>Select one</option>
                            <option value="full-time">Full-time</option>
                            <option value="coop">Co-op</option>
                            <option value="internship">Internship</option>
                        </select>
                        {errors.positionType && <span className="error">{errors.positionType}</span>}
                    </div>

                    <div className="student-sponsorship">
                        <label className="student-reg-labels">Need Sponsorship?*</label>
                        <select className="select-box" value={formData.needSponsorship} name="needSponsorship" onChange={handleChange}>
                            <option value="" disabled  hidden>Select one</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                        {errors.needSponsorship && <span className="error">{errors.needSponsorship}</span>}
                    </div>

                    <div className="student-checkin">
                        <label className="student-reg-labels">When do you plan to come for check-in?*</label>
                        <select className="select-box" value={formData.checkInTime} name="checkInTime" onChange={handleChange}>
                            <option value="" disabled  hidden>Select one</option>
                            {checkInTimes.map((timeSlot) => (
                                <option key={timeSlot.id} value={timeSlot.time}>{timeSlot.time}</option>
                            ))}
                        </select>
                        {errors.checkInTime && <span className="error">{errors.checkInTime}</span>}
                    </div>
                </fieldset>

                <fieldset className="student-resume">
                    <h3 className="student-reg-subtitle">Resume</h3>
                    <div className="resume-upload">
                        <label className="student-reg-labels">Upload Resume*</label>
                        <input
                            ref={resumeInputRef}
                            className="input-box"
                            type="file"
                            accept=".pdf"
                            onChange={handleResumeChange}
                        />
                        {errors.resume && <span className="error">{errors.resume}</span>}
                        {formData.resume && (
                            <div className="file-selected">
                                <span className="file-selected-name">{formData.resume.name}</span>
                                <button type="button" className="file-remove-btn" onClick={clearResume} aria-label="Remove selected resume">×</button>
                            </div>
                        )}
                        <p className="hint">Must be in format: Major_GradYear_First_Last.pdf</p>
                    </div>
                    
                </fieldset>

                <fieldset className="student-swe-membership">
                    <h3 className="student-reg-subtitle">SWE Membership</h3>
                    <div className="swe-id">
                        <label className="student-reg-labels">National SWE ID</label>
                        <input className="input-box" type="text" value={formData.membershipId} name="membershipId" onChange={handleChange}/>
                        {errors.membershipId && <span className="error">{errors.membershipId}</span>}
                    </div>

                    <div className="swe-membership-proof">
                        <label className="student-reg-labels">Upload proof of membership</label>
                        <input
                            ref={membershipProofInputRef}
                            className="input-box"
                            type="file"
                            accept=".pdf,.jpg,.png"
                            onChange={handleMembershipProofChange}
                        />
                        {errors.membershipProof && <span className="error">{errors.membershipProof}</span>}
                        {formData.membershipProof && (
                            <div className="file-selected">
                                <span className="file-selected-name">{formData.membershipProof.name}</span>
                                <button type="button" className="file-remove-btn" onClick={clearMembershipProof} aria-label="Remove selected file">×</button>
                            </div>
                        )}
                    </div>
                </fieldset>

                <fieldset className="student-company-preferences">
                    <h3 className="student-reg-subtitle">Company Preferences</h3>
                    <p>Please rank your top 10 companies in the order you would like to be seated with at dinner. (Again, seating will be assigned on a first-come, first-serve basis, 
                        and please read through the company sheet thoroughly before making your selections).</p>
                    {errors.companyPreferences && <span className="error">{errors.companyPreferences}</span>}

                    <div className="company-preferences-grid">
                        <div className="company-choice">
                            <label className="student-reg-labels">1st choice*</label>
                            <select className="select-box" value={formData.companyPreferences[0]} onChange={(e) => handleCompanyRankChange(0, e.target.value)}>
                                <option value="" disabled  hidden>Select one</option>
                                {companiesList.map((company) => (
                                    <option key={company.id} value={company.name}>{company.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="company-choice">
                            <label className="student-reg-labels">2nd choice*</label>
                            <select className="select-box" value={formData.companyPreferences[1]} onChange={(e) => handleCompanyRankChange(1, e.target.value)}>
                                <option value="" disabled  hidden>Select one</option>
                                {companiesList.map((company) => (
                                    <option key={company.id} value={company.name}>{company.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="company-choice">
                            <label className="student-reg-labels">3rd choice*</label>
                            <select className="select-box" value={formData.companyPreferences[2]} onChange={(e) => handleCompanyRankChange(2, e.target.value)}>
                                <option value="" disabled  hidden>Select one</option>
                                {companiesList.map((company) => (
                                    <option key={company.id} value={company.name}>{company.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="company-choice">
                            <label className="student-reg-labels">4th choice*</label>
                            <select className="select-box" value={formData.companyPreferences[3]} onChange={(e) => handleCompanyRankChange(3, e.target.value)}>
                                <option value="" disabled  hidden>Select one</option>
                                {companiesList.map((company) => (
                                    <option key={company.id} value={company.name}>{company.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="company-choice">
                            <label className="student-reg-labels">5th choice*</label>
                            <select className="select-box" value={formData.companyPreferences[4]} onChange={(e) => handleCompanyRankChange(4, e.target.value)}>
                                <option value="" disabled  hidden>Select one</option>
                                {companiesList.map((company) => (
                                    <option key={company.id} value={company.name}>{company.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="company-choice">
                            <label className="student-reg-labels">6th choice*</label>
                            <select className="select-box" value={formData.companyPreferences[5]} onChange={(e) => handleCompanyRankChange(5, e.target.value)}>
                                <option value="" disabled  hidden>Select one</option>
                                {companiesList.map((company) => (
                                    <option key={company.id} value={company.name}>{company.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="company-choice">
                            <label className="student-reg-labels">7th choice*</label>
                            <select className="select-box" value={formData.companyPreferences[6]} onChange={(e) => handleCompanyRankChange(6, e.target.value)}>
                                <option value="" disabled  hidden>Select one</option>
                                {companiesList.map((company) => (
                                    <option key={company.id} value={company.name}>{company.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="company-choice">
                            <label className="student-reg-labels">8th choice*</label>
                            <select className="select-box" value={formData.companyPreferences[7]} onChange={(e) => handleCompanyRankChange(7, e.target.value)}>
                                <option value="" disabled  hidden>Select one</option>
                                {companiesList.map((company) => (
                                    <option key={company.id} value={company.name}>{company.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="company-choice">
                            <label className="student-reg-labels">9th choice*</label>
                            <select className="select-box" value={formData.companyPreferences[8]} onChange={(e) => handleCompanyRankChange(8, e.target.value)}>
                                <option value="" disabled  hidden>Select one</option>
                                {companiesList.map((company) => (
                                    <option key={company.id} value={company.name}>{company.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="company-choice">
                            <label className="student-reg-labels">10th choice*</label>
                            <select className="select-box" value={formData.companyPreferences[9]} onChange={(e) => handleCompanyRankChange(9, e.target.value)}>
                                <option value="" disabled  hidden>Select one</option>
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
                        <label className="student-reg-labels">Meal*</label>
                        <select className="select-box" value={formData.meal} name="meal" onChange={handleChange}>
                            <option value="" disabled  hidden>Select one</option>
                            {mealPreferences.map((meal) => (
                                <option key={meal.id} value={meal.name}>{meal.name}</option>
                            ))}
                        </select>
                        {errors.meal && <span className="error">{errors.meal}</span>}
                    </div>

                    <div className="dessert-choice">
                        <label className="student-reg-labels">Dessert*</label>
                        <select className="select-box" value={formData.dessert} name="dessert" onChange={handleChange}>
                            <option value="" disabled  hidden>Select one</option>
                            {dessertPreferences.map((dessert) => (
                                <option key={dessert.id} value={dessert.name}>{dessert.name}</option>
                            ))}
                        </select>
                        {errors.dessert && <span className="error">{errors.dessert}</span>}
                    </div>

                    <div className="dietary-restrictions">
                        <label className="student-reg-labels">Dietary restrictions</label>
                        <input className="input-box" type="text" value={formData.dietaryRestrictions} name="dietaryRestrictions" onChange={handleChange}/>
                    </div>
                </fieldset>

                <fieldset className="student-other">
                    <h3 className="student-reg-subtitle">Other</h3>
                    <div className="photo-consent">
                        <label className="student-reg-labels">
                            <input type="checkbox" value={formData.photoConsent} name="photoConsent" onChange={handleCheckboxChange}/>
                            I consent to SWE's use of my photos or videos from EWI 2026 for promotional purposes*.
                            {errors.photoConsent && <span className="error">{errors.photoConsent}</span>}
                        </label>
                    </div>

                    <div className="will-call">
                        <label className="student-reg-labels">Would you like to be considered for the will call?*</label>
                        <p className="hint">Indicating "No" does NOT mean you are removed from the waitlist. We will only resort to the will call for no-shows on the day of the event.</p>
                        <select className="select-box" value={formData.willCall} name="willCall" onChange={handleChange}>
                            <option value="" disabled  hidden>Select one</option>
                            <option value="yes">Yes</option>
                            <option value="no">No, but I'd like to stay on the waitlist</option>
                        </select>
                        {errors.willCall && <span className="error">{errors.willCall}</span>}

                    </div>

                    <div className="additional-comments">
                        <label className="student-reg-labels">Additional questions/comments</label>
                        <textarea className="input-box" rows={4} value={formData.additionalComments} name="additionalComments" onChange={handleChange}></textarea>
                    </div>
                </fieldset>

                <button className="student-reg-submit" type="submit">
                    {isSubmitting ? "Submitting..." : "Submit" }
                </button>
                {Object.values(errors).some((msg) => msg) && (
                    <p className="submit-error">Please fix the errors before submitting.</p>
                )}

            </form>
        </div>
    );
};

export default StudentRegistrationForm;