import React from 'react'
import Header from './components/header/Header'
import Nav from './components/nav/Nav'
import About from './components/about/About'
import Attend from './components/attend/attend'
import Navbar from './components/navbar/navbar'
import Portfolio from './components/portfolio/Portfolio'
import Contact from './components/contact/Contact'
import Footer from './components/footer/Footer'
import Home from './pages/Home'
import Company from './pages/Company'
import Student from './pages/Student'
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';

const App = () => {
  return (
    <>
        <Analytics />
      <Router>
                <Routes>
                    <Route
                        exact
                        path="/"
                        element={<Home />}
                    />
                    <Route
                        path="/company"
                        element={<Company />}
                    />
 
                    <Route
                        path="/student"
                        element={<Student />}
                    />
 
                    <Route
                        path="*"
                        element={<Navigate to="/" />}
                    />
                </Routes>
            </Router>
    </>
  );
}

export default App