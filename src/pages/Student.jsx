import React from 'react'
import Navbar from '../components/navbar/navbar'
import Footer from '../components/footer/Footer'
import StudentHeader from '../components/studentHeader/StudentHeader'
import StudentInfo from '../components/studentInfo/StudentInfo'

const Student = () => {
  return (
        <div className='student'>
            <Navbar />
            <StudentHeader />
            <StudentInfo />
            <Footer />
        </div>
  )
}

export default Student