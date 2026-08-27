import React, { useState } from "react";
import "./StudentsTemplate.css";

const PAGE_TITLE = "For Students";
const PAGE_SUBHEADING = "subheading";
const REGISTER_LABEL = "Register";
const SURVIVAL_TIPS_TITLE = "Survival Tips";
const SURVIVAL_GUIDE_TITLE = "Student Survival Guide";
const PDF_PLACEHOLDER_TEXT = "PDF preview placeholder";

const StudentsTemplate = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const questions = [
        { id: 1, question: "question 1", answer: "answer 1" },
        { id: 2, question: "question 2", answer: "answer 2" },
        { id: 3, question: "question 3", answer: "answer 3" },
    ];

    const toggleQuestion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="students-template-page">
            <div className="students-template-content">
                <header className="students-template-header">
                    <h1>{PAGE_TITLE}</h1>
                    <p className="students-template-subhead">{PAGE_SUBHEADING}</p>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a className="students-template-button" href="#" aria-disabled="true">
                        {REGISTER_LABEL}
                    </a>
                </header>

                <section className="students-template-section">
                    <h2>{SURVIVAL_TIPS_TITLE}</h2>
                    <div className="students-template-accordion">
                        {questions.map((item, index) => (
                            <div key={item.id} className="students-template-accordion-item">
                                <button
                                    type="button"
                                    className="students-template-question"
                                    onClick={() => toggleQuestion(index)}
                                >
                                    {item.question}
                                    <span className={`students-template-icon ${openIndex === index ? "open" : ""}`}>
                                        ▾
                                    </span>
                                </button>
                                {openIndex === index && (
                                    <div className="students-template-answer">
                                        {item.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="students-template-section">
                    <h2>{SURVIVAL_GUIDE_TITLE}</h2>
                    <div className="students-template-guide">
                        <div className="students-template-guide-placeholder">
                            {PDF_PLACEHOLDER_TEXT}
                        </div>
                    </div>
                </section>
                <section className="students-template-section">
                    <h2>hellohellohello</h2>
                </section>
            </div>
        </div>
    );
};

export default StudentsTemplate;
