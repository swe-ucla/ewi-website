import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiX } from "react-icons/fi";
import guidePreview from "../../assets/students/guide-preview.png";
import foliage from "../../assets/students/hero-foliage.png";
import mascot from "../../assets/students/mascot.png";
import registrationWordmark from "../../assets/students/registration.svg";
import studentWordmark from "../../assets/students/student.svg";
import "./StudentsTemplate.css";

const SHOW_GUIDE_COMING_SOON = true;

const QUESTIONS = [
    {
        id: 1,
        question: "What should I bring to EWI?",
        answer:
            "Prepare multiple copies of your resume to hand out during the career fair, a prepared elevator pitch and a positive attitude! If you are interested in multiple types of roles (ex: software engineer and product management), bring multiple versions of your resume to hand out!",
    },
    {
        id: 2,
        question: "How do I prepare for networking conversations?",
        answer:
            "Research the companies you're interested in beforehand. Prepare thoughtful questions about their work culture, projects, and opportunities. A good question can bring you a long way. Practice your elevator pitch and be ready to discuss your experiences and career goals.",
    },
    {
        id: 3,
        question: "How do company assignments work?",
        answer:
            'Table assignments are first come, first serve based on registration. Register as early as possible to ensure you get to sit with your top choice company during the dinner portion of the event. Priority company registration is also offered to participants who attend 4/5 of our "Prep for EWI" workshops. If you qualify, you will be guaranteed one of your top 5 company choices. Workshops are held the weeks prior to EWI and are advertised on our Instagram and website.',
    },
];

const StudentsTemplate = () => {
    const [openIndexes, setOpenIndexes] = useState([0]);

    return (
        <main className="students-template-page">
            <img className="students-template-foliage" src={foliage} alt="" aria-hidden="true" />
            <div className="students-template-content">
                <header className="students-template-header">
                    <img className="students-template-mascot" src={mascot} alt="" aria-hidden="true" />
                    <h1 className="students-template-wordmark" aria-label="Student registration">
                        <img src={studentWordmark} alt="" aria-hidden="true" />
                        <img src={registrationWordmark} alt="" aria-hidden="true" />
                    </h1>
                    <Link className="students-template-button" to="/student-registration">Register</Link>
                </header>

                <section className="students-template-section" aria-labelledby="survival-tips-title">
                    <h2 id="survival-tips-title">survival tips</h2>
                    <div className="students-template-accordion">
                        {QUESTIONS.map((item, index) => {
                            const isOpen = openIndexes.includes(index);
                            const answerId = `students-template-answer-${item.id}`;

                            return (
                                <article key={item.id} className="students-template-accordion-item">
                                    <button type="button" className="students-template-question" onClick={() => setOpenIndexes((current) => isOpen ? current.filter((itemIndex) => itemIndex !== index) : [...current, index])} aria-expanded={isOpen} aria-controls={answerId}>
                                        {item.question}
                                        <span className="students-template-icon" aria-hidden="true">{isOpen ? <FiX /> : <FiPlus />}</span>
                                    </button>
                                    {isOpen && <p className="students-template-answer" id={answerId}>{item.answer}</p>}
                                </article>
                            );
                        })}
                    </div>
                </section>

                <section className="students-template-section students-template-guide-section" aria-labelledby="survival-guide-title">
                    <h2 id="survival-guide-title">student survival guide</h2>
                    {SHOW_GUIDE_COMING_SOON ? (
                        <div className="students-survival-soon" role="status">
                            <div className="students-survival-soon__card">
                                <h3 className="students-survival-soon__title">coming soon</h3>
                                <p className="students-survival-soon__tagline">harvest your potential</p>
                            </div>
                        </div>
                    ) : (
                        <img
                            className="students-template-guide-preview"
                            src={guidePreview}
                            alt="Student Survival Guide preview"
                        />
                    )}
                </section>
            </div>
        </main>
    );
};

export default StudentsTemplate;
