import React from 'react'
import {HashLink} from "react-router-hash-link";

const CTA = () => {
  return (
    <div className='cta1'>
        <HashLink to='/student#top' className='btn btn-primary'>Student</HashLink>
    </div>
  )
}

export default CTA