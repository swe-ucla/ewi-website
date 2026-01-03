import React, { useState } from "react";
import "./GeneralQA.css";

// General Q&A data for both students and companies
const questions = [
  {
    id: 1,
    question: "Where is EWI located?",
    answer: "Evening with Industry 2026 will be held at UCLA's Carnesale Commons, located on the UCLA campus. The event will take place on January 22nd, 2026 from 5:30 PM to 10:00 PM.",
  },
  {
    id: 2,
    question: "Is parking available at the venue?",
    answer: "Yes, parking is available at UCLA. We recommend arriving early to secure parking, as spaces can fill up quickly. Please check UCLA's parking website for current rates and availability. Carpooling is also encouraged.",
  },
  {
    id: 3,
    question: "What is the event schedule?",
    answer: "The event runs from 5:30 PM to 10:00 PM and includes three main parts: informal networking over appetizers (5:30-6:30 PM), a multi-course catered dinner with company representatives (6:30-8:00 PM), and a formal career fair (8:00-10:00 PM).",
  },
  {
    id: 4,
    question: "Who can attend EWI?",
    answer: "EWI is open to all students, regardless of gender or major. While the event is organized by Society of Women Engineers, everyone is welcome to attend. Companies are also welcome to participate as sponsors and representatives.",
  },
];

const GeneralQA = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="general-qa-container">
      <h2 className="general-qa-title">general q&a</h2>
      <div className="general-qa-list">
        {questions.map((item, index) => (
          <div key={item.id} className="general-qa-item">
            <div
              className="general-qa-question"
              onClick={() => toggleQuestion(index)}
            >
              <span className="general-qa-question-text">{item.question}</span>
              <span className={`general-qa-icon ${openIndex === index ? 'open' : ''}`}>
                ›
              </span>
            </div>
            {openIndex === index && (
              <div className="general-qa-answer">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneralQA;

