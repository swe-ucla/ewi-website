import React from 'react'
import './companyButtons.css'
import ButtonRegistration from './ButtonRegistration'
import ButtonSG from './ButtonSG'
import ButtonSWESponsor from './ButtonSWESponsor'

const CompanyButtons = () => {
  return (
      <div className="flex-container">
         <ButtonRegistration />
         <ButtonSG />
         <ButtonSWESponsor/>
      </div>
    
  )
}

export default CompanyButtons