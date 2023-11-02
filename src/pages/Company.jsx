import React from 'react'
import CompanyHeader from '../components/companyHeader/CompanyHeader'
import CompanyInfo from '../components/companyInfo/companyInfo'
import CompanyButtons from '../components/companyButtons/CompanyButtons'
import Navbar from '../components/navbar/navbar'
import Footer from '../components/footer/Footer'

const Company = () => {
  return (
        <div className='company'>
            <Navbar />
            <CompanyHeader />
            <CompanyButtons/>
            <CompanyInfo />
            <Footer />
        </div>
  )
}

export default Company