import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

import StudentHeader from "../components/studentHeader/StudentHeader";
import IssuuStyleFlipbook from "../components/flipbook/IssuuStyleFlipbook";
import student_guide from "../assets/EWI Student Survival Guide 2024-2025.pdf";
import Testimonials from "../components/testimonials/Testimonials";
import Accordion from "../components/accordion/Accordion";

const student_testimonials = [
  {
    id: 1,
    quote: "Having the opportunity to sit down with [the recruiters] and chat about everything from life at Takeda, to trips to Italy while eating dinner were the highlights of EWI. It was a great way to personally connect with a Takeda recruiter and engineer while also learning about the company – something you would rather find outside of a recruiting event like EWI.",
    source: " - Maddie Doi, Class of 2026 Bioengineering student who received a Manufacturing Sciences internship at Takeda after EWI 2024",
    image: null, // Add student image path when available
    name: "Maddie Doi",
  },
  {
    id: 2,
    quote: "The highlight of EWI was the food, but also it was really great to connect with the recruiters that were sitting at my table because they were both engaged in what we were talking about and easy to talk to so I felt that the conversation flowed very easily. After having a great conversation with the recruiters at my table, I was able to get their contact info and give them my resume. When I applied and went through the interview process, the recruiter who was there at EWI actually became my mentor so she actually was recruiting directly for her team at EWI, rather than for a general pool of positions.",
    source: " - Elaine Chu, Class of 2026 Mechanical Engineering student who received a Starlink Production Engineering internship at SpaceX after EWI 2024",
    image: null,
    name: "Elaine Chu",
  },
  {
    id: 3,
    quote: "EWI was inspiring for me. The 2023 Keynote Speaker, Evelyn Cortez-Davis, emphasized the importance of pursuing your career with a clear passion and executable goals as she shared her own journey, which was both moving and motivating. I learned to evaluate the reasons I am going into the field of my choice and how to never rule myself out from an opportunity before even trying.",
    source: " - Daniella Hannah, Class of 2025 Mechanical Engineering student who received a Reliability, Risk, Sustainability & Energy Engineering internship at Northrop Grumman after EWI 2023",
    image: null,
    name: "Daniella Hannah",
  },
];

const Student = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="student">
      <StudentHeader />
      <div className="container">
        <div className="company-registration-document">
          <IssuuStyleFlipbook pdfFile={student_guide} scale={1.0} />
        </div>
        <Testimonials testimonials={student_testimonials} />
        <Accordion />
      </div>
    </div>
  );
};

export default Student;
