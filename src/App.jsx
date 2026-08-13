import React from "react";
import Navbar from "./components/navbar/navbar";
import Home from "./pages/Home";
import Students from "./pages/Students";
import StudentsTemplatePage from "./pages/StudentsTemplate";
import Companies from "./pages/Companies";
import MeetTheTeam from "./pages/MeetTheTeam";
import ContactUs from "./pages/ContactUs";
import Footer from "./components/footer/Footer";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

const App = () => {
  return (
    <>
      <Analytics />
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/students" element={<Students />} />
          <Route path="/student" element={<Navigate to="/students" replace />} />
          <Route path="/students-template" element={<StudentsTemplatePage />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/meet-the-team" element={<MeetTheTeam />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
};

export default App;
