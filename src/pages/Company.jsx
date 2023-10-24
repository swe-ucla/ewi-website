import React from 'react'
import CompanyHeader from '../components/companyHeader/CompanyHeader'
import CompanyInfo from '../components/companyInfo/companyInfo'
import CompanyButtons from '../components/companyButtons/CompanyButtons'

const Company = () => {
  return (
        <div className='company'>
            <CompanyHeader />
            <CompanyButtons/>
            <CompanyInfo />
        </div>
  )
}

export default Company