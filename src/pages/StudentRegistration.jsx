import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs, runTransaction } from "firebase/firestore";
import RegistrationTimeline, { getCurrentStep, STEPS } from "../components/registrationTimeline/registrationTimeline";
import registrationTimelineDates from "../data/registrationDates";
import { homeEventConfig } from "../components/home/homeEventConfig";
import { sanitizeCloudinaryId, uploadToCloudinary } from "../utils/cloudinary";
import OverlaySelect from "../components/OverlaySelect/OverlaySelect";
import "./StudentRegistration.css";

const WAITLIST_STEP = STEPS.indexOf("waitlist");

// Temporary override: show the open "normal" registration state (no capacity
// banner, timeline marker on normal). Set to false to restore the date-based
// step from registrationDates.js.
const FORCE_NORMAL_REGISTRATION = true;

const registrationDatesForDisplay = FORCE_NORMAL_REGISTRATION
    ? {
        ...registrationTimelineDates,
        // Keep today inside the normal window so getCurrentStep returns "normal".
        waitlistStart: new Date("2099-01-01T00:00:00"),
    }
    : registrationTimelineDates;

const formatEventSubtitle = (eventDate) => {
    const dateLabel = eventDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
    const startLabel = eventDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });
    return `${dateLabel} - ${startLabel} to 10:00 PM - ${homeEventConfig.location} - Free`;
};

// maps the timeline's current step to one of the 3 registration statuses
// empty str if registration hasn't opened yet or the event date has passed
const getRegistrationStatus = (dates) => {
    const currentStep = getCurrentStep(dates);
    if (currentStep < 0 || currentStep >= STEPS.length - 1) {
        return "";
    }
    return STEPS[currentStep];
};

const companyRankLabels = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];

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

const PRONOUN_OPTIONS = [
    { value: "she/her/hers", label: "she/her/hers" },
    { value: "he/him/hims", label: "he/him/hims" },
    { value: "they/them/theirs", label: "they/them/theirs" },
    { value: "other", label: "Other" },
];

const YEAR_OPTIONS = [
    { value: "first-year", label: "First" },
    { value: "second-year", label: "Second" },
    { value: "third-year", label: "Third" },
    { value: "fouth-year", label: "Fourth" },
    { value: "fifth-year-or-greater", label: "Fifth+" },
    { value: "grad-student-masters", label: "Grad Student - Master's" },
    { value: "grad-student-phd", label: "Grad Student - PhD" },
    { value: "Other", label: "Other" },
];

const YES_NO_OPTIONS = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
];

const POSITION_OPTIONS = [
    { value: "full-time", label: "Full-time" },
    { value: "coop", label: "Co-op" },
    { value: "internship", label: "Internship" },
];

const MAJOR_OPTIONS = studentMajors.map((major) => ({ value: major.name, label: major.name }));
const CHECK_IN_OPTIONS = checkInTimes.map((timeSlot) => ({ value: timeSlot.time, label: timeSlot.time }));
const MEAL_OPTIONS = mealPreferences.map((meal) => ({ value: meal.name, label: meal.name }));
const DESSERT_OPTIONS = dessertPreferences.map((dessert) => ({ value: dessert.name, label: dessert.name }));

const WILL_CALL_OPTIONS = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No, but I'd like to stay on the waitlist" },
];

const RegistrationSelect = (props) => (
    <OverlaySelect {...props} labelClassName="student-reg-labels" />
);

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
    const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
    const [companies, setCompanies] = useState([]);
    const navigate = useNavigate();

    const resumeInputRef = useRef(null);
    const membershipProofInputRef = useRef(null);
    const isWaitlist = getCurrentStep(registrationDatesForDisplay) === WAITLIST_STEP;
    const eventSubtitle = formatEventSubtitle(registrationTimelineDates.eventDate);

    const fetchCompanies = async () => {
        const snapshot = await getDocs(collection(db, "Companies"));
        setCompanies(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    useEffect(() => {
        fetchCompanies().catch((err) => console.error("Failed to load companies:", err));
    }, []);

    const companyOptionsForRank = (rankIndex) => {
        const currentValue = formData.companyPreferences[rankIndex];
        return companies.map((company) => {
            const isFull = company.capacity != null && company.firstChoiceCount >= company.capacity;
            return {
                value: company.name,
                label: `${company.name}${isFull ? " (full)" : ""}`,
                disabled: isFull && company.name !== currentValue,
            };
        });
    };

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

    const validateUID = (label, value) => {
        if (!value || !value.toString().trim()) return `${label} is required`;
        const trimmed = value.toString().trim();
        if (!/^\d+$/.test(trimmed)) return `${label} must contain numbers only`;
        if (trimmed.length !== 9) return `${label} must be 9 digits long`;
        return "";
    }

    const validateCompanyPreferences = (preferences) => {
        const filled = preferences.filter((p) => p !== "");

        if (filled.length < preferences.length) {
            return "Please rank all 10 company preferences";
        }

        if (new Set(filled).size !== filled.length) {
            return "Please select 10 different companies — no repeats allowed";
        }

        return "";
    }

    const valdiateCheckbox = (label, isChecked) => {
        return isChecked ? "" : `You must agree to ${label}`;
    }

    // handle duplicate
    const checkDuplicate = async (email) => {
        const docRef = doc(db, "Registrations", email);
        const docSnap = await getDoc(docRef);
        return docSnap.exists();
    };

    // uploads files and writes the registration, uses email as key
    const submitRegistration = async () => {
        let resumeUrl = null;
        let membershipProofUrl = null;

        const fileId = sanitizeCloudinaryId(formData.email);

        if (formData.resume) {
            resumeUrl = await uploadToCloudinary(formData.resume, {
                folder: "ewi-2026/resumes",
                publicId: fileId,
            });
        }
        if (formData.membershipProof) {
            membershipProofUrl = await uploadToCloudinary(formData.membershipProof, {
                folder: "ewi-2026/membership-proof",
                publicId: fileId,
            });
        }

        const dataToSave = {
            ...formData,
            registrationStatus: getRegistrationStatus(registrationDatesForDisplay), // computed at submit time
            resume: resumeUrl,
            resumeFilename: formData.resume ? formData.resume.name : null,
            membershipProof: membershipProofUrl,
        };

        const registrationRef = doc(db, "Registrations", formData.email);
        const newFirstChoiceName = formData.companyPreferences[0];
        const newCompanyRef = newFirstChoiceName ? doc(db, "Companies", newFirstChoiceName) : null;

        await runTransaction(db, async (tx) => {
            const registrationSnap = await tx.get(registrationRef);
            const oldFirstChoiceName = registrationSnap.exists()
                ? registrationSnap.data().companyPreferences?.[0]
                : null;
            const firstChoiceChanged = oldFirstChoiceName !== newFirstChoiceName;

            const newCompanySnap = firstChoiceChanged && newCompanyRef ? await tx.get(newCompanyRef) : null;

            if (newCompanySnap && newCompanySnap.exists()) {
                const { capacity, firstChoiceCount } = newCompanySnap.data();
                if (capacity != null && firstChoiceCount >= capacity) {
                    throw new Error("CAPACITY_FULL");
                }
            }

            // firstChoiceCount is kept in sync by the onRegistrationWritten Cloud Function
            tx.set(registrationRef, dataToSave);
        });

        console.log("Registration submitted successfully");
        navigate("/student-registration/success");
    };

    // shared handling for submitRegistration failures, including a full first-choice company
    const handleRegistrationError = async (error) => {
        console.error("Registration submission failed: ", error);
        if (error.message === "CAPACITY_FULL") {
            alert("That company just reached capacity for first choices — please pick a different first choice.");
            try {
                await fetchCompanies();
            } catch (refreshErr) {
                console.error("Failed to refresh companies:", refreshErr);
            }
        } else {
            alert("There was an error submitting your registration. Please try again.");
        }
    };

    // handle overwrite of previous submission
    const handleOverwrite = async () => {
        setShowDuplicateAlert(false);
        setIsSubmitting(true);
        try {
            await submitRegistration();
        } catch (error) {
            await handleRegistrationError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // leave form filled/untouched
    const handleCancelOverwrite = () => {
        setShowDuplicateAlert(false);
    };

    // handle submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {
            email: validateField("Email", formData.email),
            pronouns: validateField("Pronouns", formData.pronouns),
            otherPronouns: formData.pronouns === "other" ? validateField("Pronouns", formData.otherPronouns) : "",
            fullName: validateField("Full name", formData.fullName),
            uid: validateUID("UID", formData.uid),
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
            const isDuplicate = await checkDuplicate(formData.email);
            if (isDuplicate) {
                setShowDuplicateAlert(true);
                return;
            }

            await submitRegistration();
        } catch (error) {
            await handleRegistrationError(error);
        } finally {
            setIsSubmitting(false);
        }

    };

    return (
        <div className="student-reg-page">

            {showDuplicateAlert && (
                <div className="duplicate-alert-overlay" role="alertdialog" aria-labelledby="duplicate-alert-title" aria-describedby="duplicate-alert-message">
                    <div className="duplicate-alert-box">
                        <h3 id="duplicate-alert-title" className="duplicate-alert-title">You've already registered</h3>
                        <p id="duplicate-alert-message" className="duplicate-alert-message">
                            We found an existing registration for this email. Submitting again will overwrite
                            your previous registration. Are you sure you want to continue?
                        </p>
                        <div className="duplicate-alert-actions">
                            <button
                                type="button"
                                className="duplicate-alert-cancel-btn"
                                onClick={handleCancelOverwrite}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="duplicate-alert-overwrite-btn"
                                onClick={handleOverwrite}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Overwriting..." : "Overwrite"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="student-reg-card">
            {isWaitlist && (
                <div className="capacity-banner" role="status">
                    <svg className="capacity-banner-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="currentColor" d="M12 3.2 1.8 21h20.4L12 3.2zm0 4.3 6.7 11.6H5.3L12 7.5zm-1 3.2v4.6h2v-4.6h-2zm0 6.1v2h2v-2h-2z" />
                    </svg>
                    <div className="capacity-banner-copy">
                        <p className="capacity-banner-title">Registration is at capacity</p>
                        <p className="capacity-banner-text">
                            This form is waitlist only. You'll be notified as soon as possible if you're lifted off the waitlist.
                        </p>
                    </div>
                </div>
            )}

            <div className="student-reg-header">
                <h1 className="student-reg-title">Student Registration</h1>
                <p className="student-reg-meta">{eventSubtitle}</p>
                <RegistrationTimeline dates={registrationDatesForDisplay} />
                <Link className="ewi-info" to="/students">
                    <span className="ewi-info-bold">What is EWI?</span>
                    <span className="ewi-desc">
                        A three-part networking night: appetizers, dinner with a company, and a career fair.
                    </span>
                </Link>
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
                        <RegistrationSelect
                            id="pronouns"
                            name="pronouns"
                            label="Pronouns*"
                            value={formData.pronouns}
                            options={PRONOUN_OPTIONS}
                            onChange={handleChange}
                            error={errors.pronouns}
                        />

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
                    <h3 className="student-reg-subtitle">Student details</h3>
                    <div className="student-year">
                        <RegistrationSelect
                            id="year"
                            name="year"
                            label="Year*"
                            value={formData.year}
                            options={YEAR_OPTIONS}
                            onChange={handleChange}
                            error={errors.year}
                        />
                    </div>

                    <div className="transfer-status">
                        <RegistrationSelect
                            id="transfer"
                            name="transfer"
                            label="Transfer?*"
                            value={formData.transfer}
                            options={YES_NO_OPTIONS}
                            onChange={handleChange}
                            error={errors.transfer}
                        />
                    </div>

                    <div className="student-major">
                        <RegistrationSelect
                            id="major"
                            name="major"
                            label="Major*"
                            value={formData.major}
                            options={MAJOR_OPTIONS}
                            onChange={handleChange}
                            error={errors.major}
                        />

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
                        <RegistrationSelect
                            id="position-type"
                            name="positionType"
                            label="What type of position are you looking for?*"
                            value={formData.positionType}
                            options={POSITION_OPTIONS}
                            onChange={handleChange}
                            error={errors.positionType}
                        />
                    </div>

                    <div className="student-sponsorship">
                        <RegistrationSelect
                            id="sponsorship"
                            name="needSponsorship"
                            label="Need Sponsorship?*"
                            value={formData.needSponsorship}
                            options={YES_NO_OPTIONS}
                            onChange={handleChange}
                            error={errors.needSponsorship}
                        />
                    </div>

                    <div className="student-checkin">
                        <RegistrationSelect
                            id="check-in"
                            name="checkInTime"
                            label="When do you plan to come for check-in?*"
                            value={formData.checkInTime}
                            options={CHECK_IN_OPTIONS}
                            onChange={handleChange}
                            error={errors.checkInTime}
                        />
                    </div>
                </fieldset>

                <fieldset className="student-resume">
                    <h3 className="student-reg-subtitle">Resume</h3>
                    <div className="resume-upload">
                        <label className="upload-zone">
                            <span className="visually-hidden">Upload resume</span>
                            <input
                                ref={resumeInputRef}
                                className="upload-input"
                                type="file"
                                accept=".pdf"
                                onChange={handleResumeChange}
                            />
                            <span className="upload-zone-text">
                                {formData.resume ? formData.resume.name : "Upload"}
                            </span>
                        </label>
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
                        <label className="upload-zone">
                            <span className="visually-hidden">Upload proof of membership</span>
                            <input
                                ref={membershipProofInputRef}
                                className="upload-input"
                                type="file"
                                accept=".pdf,.jpg,.png"
                                onChange={handleMembershipProofChange}
                            />
                            <span className="upload-zone-text">
                                {formData.membershipProof ? formData.membershipProof.name : "Upload proof of membership"}
                            </span>
                        </label>
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
                    <p className="company-preferences-description">Please rank your top 10 companies in the order you would like to be seated with at dinner. Seating is first come, first serve.</p>
                    {errors.companyPreferences && <span className="error">{errors.companyPreferences}</span>}

                    <div className="company-preferences-grid">
                        {companyRankLabels.map((label, rankIndex) => (
                            <div className="company-choice" key={rankIndex}>
                                <RegistrationSelect
                                    id={`company-choice-${rankIndex}`}
                                    name={`companyPreferences-${rankIndex}`}
                                    label={`${label} choice*`}
                                    value={formData.companyPreferences[rankIndex]}
                                    options={companyOptionsForRank(rankIndex)}
                                    onChange={(e) => handleCompanyRankChange(rankIndex, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                </fieldset>

                <fieldset className="student-meal-preferences">
                    <h3 className="student-reg-subtitle">Meal preferences</h3>
                    <div className="meal-choice">
                        <RegistrationSelect
                            id="meal"
                            name="meal"
                            label="Meal*"
                            value={formData.meal}
                            options={MEAL_OPTIONS}
                            onChange={handleChange}
                            error={errors.meal}
                        />
                    </div>

                    <div className="dessert-choice">
                        <RegistrationSelect
                            id="dessert"
                            name="dessert"
                            label="Dessert*"
                            value={formData.dessert}
                            options={DESSERT_OPTIONS}
                            onChange={handleChange}
                            error={errors.dessert}
                        />
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

                    <RegistrationSelect
                        id="will-call"
                        name="willCall"
                        label="Would you like to be considered for the will call?*"
                        hint="Indicating “No” does not remove you from the waitlist. We only use will call for no-shows on the day of the event."
                        value={formData.willCall}
                        options={WILL_CALL_OPTIONS}
                        onChange={handleChange}
                        error={errors.willCall}
                    />

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
        </div>
    );
};

export default StudentRegistrationForm;