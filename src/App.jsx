import React from "react";
import Navbar from "./components/navbar/navbar";
import Home from "./pages/Home";
import Students from "./pages/Students";
import Companies from "./pages/Companies";
import MeetTheTeam from "./pages/MeetTheTeam";
import ContactUs from "./pages/ContactUs";
import Footer from "./components/footer/Footer";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

const AppContent = () => {
  const location = useLocation();
  const isCompaniesPage = location.pathname === "/companies";

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/students" element={<Students />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/meet-the-team" element={<MeetTheTeam />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer className={isCompaniesPage ? "companies-page-footer" : ""} />
    </>
  );
};

const App = () => {
  return (
    <>
      <Analytics />
      <Router>
        <AppContent />
      </Router>
    </>
  );
};

export default App;
