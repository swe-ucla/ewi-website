import React from "react";
import Navbar from "./components/navbar/navbar";
import Home from "./pages/Home";
import Students from "./pages/Students";
import Companies from "./pages/Companies";
import MeetTheTeam from "./components/meetTheTeam/MeetTheTeam";
import ContactUs from "./components/contact/Contact";
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
          <Route exact path="/" element={<Home />} />
          <Route exact path="/home" element={<Home />} />
          <Route path="/students" element={<Students />} />
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
