import React from 'react'
import './companyInfo.css'
import PDFViewer from './PDFViewer'


const CompanyInfo = () => {
  return (
    <section id='about'>
        <div className="container company__content"> 
            <p>Thank you for your interest in EWI!  Evening with Industry is a unique opportunity to spread awareness of your company and make personal connections with hundreds of talented UCLA engineering students at the same time.</p>
            <h2>Registration</h2>
            <div className="company__paragraph">
                <p>Early bird pricing will remain until November 30th, 2023. For the company registration form, please reach us at ewi.swe.ucla@gmail.com.</p>
                <div className="indented__paragraph">
                    <h3>Startups</h3>
                    <p>To diversify the range of opportunities available to our student attendees, we are introducing a startup discount to EWI 2024. Contact us about startup pricing!</p>
                </div>   
                <h2>Company Representative Survival Guide</h2>         
                <p>To help guide our company representative guests and prepare them for the evening, our Corporate Relations chair has created the Company Rep Survival Guide!</p>
            </div>

            <div className='container pdf_container'>
                <PDFViewer />
            </div>

            <h2>Student Demographics</h2>
            <div class="row">
                <div class="column">
                    <img src={require('../../assets/EWI2022StudentMajors.png')} alt="2022 student majors chart"/>
                </div>
                <div class="column">
                    <img src={require('../../assets/EWI2023StudentMajors.png')} alt="2023 student majors chart"/>
                </div>
            </div>
            <br/> <br/>
            <div className="company__paragraph">
                <p>About 200 students attended EWI 2022, which was held virtually, and about 280 students attended EWI 2023, which was held in-person. We host students of all engineering concentrations as well as students studying physics, cognitive science, biology, and more. There are some fluctuations year to year in the distribution of majors , but overall the body of student attendees at EWI are representative of the Samueli Engineering school as a whole and most commonly features mechanical engineering, chemical engineering, and computer science students. </p>
            
            <h2>SWE @ UCLA Sponsorship</h2>
            <p>If you would like to support SWE@UCLA as a whole, send an email to our External Vice President at evp.swe.ucla@gmail.com to learn more about our sponsorship tiers.</p>
            </div>
        </div>
    </section>
  )
}

export default CompanyInfo