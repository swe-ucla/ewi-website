import React, { useState } from "react";
import "./Accordion.css";

// Mock Q&A data - replace with actual questions and answers
const questions = [
  {
    id: 1,
    question: "What should I bring to EWI?",
    answer: "You should bring multiple copies of your resume, business cards if you have them, a notebook to take notes, and a positive attitude! Dress professionally and be ready to network with company representatives.",
  },
  {
    id: 2,
    question: "How do I prepare for networking conversations?",
    answer: "Research the companies you're interested in beforehand. Prepare thoughtful questions about their work culture, projects, and opportunities. Practice your elevator pitch and be ready to discuss your experiences and career goals.",
  },
  {
    id: 3,
    question: "What is the dress code for EWI?",
    answer: "Business professional attire is recommended. This typically means a suit or business dress, polished shoes, and a professional appearance. When in doubt, it's better to be slightly overdressed than underdressed.",
  },
  {
    id: 4,
    question: "How are table assignments determined?",
    answer: "Table assignments are first come, first serve based on registration. Register as early as possible to ensure you get to sit with your top choice company during the dinner portion of the event.",
  },
  {
    id: 5,
    question: "What happens if I can't attend the full event?",
    answer: "If you cannot attend before 6:45 PM, please do not register. Unfortunately, we are unable to save your seat if you arrive late. The event structure requires full attendance to maximize networking opportunities.",
  },
];

const Accordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="accordion-container">
      <h2 className="accordion-title">survival tips</h2>
      <div className="accordion-list">
        {questions.map((item, index) => (
          <div key={item.id} className="accordion-item">
            <div
              className="accordion-question"
              onClick={() => toggleQuestion(index)}
            >
              <span className="question-text">{item.question}</span>
              <span className={`accordion-icon ${openIndex === index ? 'open' : ''}`}>
                ›
              </span>
            </div>
            {openIndex === index && (
              <div className="accordion-answer">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accordion;

