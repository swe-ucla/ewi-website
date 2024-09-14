import React from 'react'
import {Link} from "react-router-dom";
import {HashLink} from "react-router-hash-link";

const CTA2 = () => {
  return (
    <div className='cta2'>
        <HashLink to='/company#top' className='btn btn-primary'>Companies</HashLink>
    </div>
  )
}

export default CTA2