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

const App = () => {
  return (
    <>
        <Navbar />
        <Home />
        <Company />
        <Footer />
        
    </>
  )
}

export default App