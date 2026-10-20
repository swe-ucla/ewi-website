import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiX } from "react-icons/fi";
import guidePreview from "../../assets/students/guide-preview.png";
import foliage from "../../assets/students/hero-foliage.png";
import mascot from "../../assets/students/mascot.png";
import registrationWordmark from "../../assets/students/registration.svg";
import studentWordmark from "../../assets/students/student.svg";
import "./StudentsTemplate.css";

const QUESTIONS = Array.from({ length: 4 }, (_, index) => ({
    id: index + 1,
    question: "Question",
    answer: "Question answer",
}));

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
                    <img className="students-template-guide-preview" src={guidePreview} alt="Student Survival Guide preview" />
                </section>
            </div>
        </main>
    );
};

export default StudentsTemplate;
