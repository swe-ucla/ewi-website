import React from 'react'
import './about.css'
import SWEPHOTO from '../../assets/swe-logo-3.jpg'
import CTAabout from './CTAabout'
import {HiOutlineBookOpen} from 'react-icons/hi'
import {HiOutlineDesktopComputer} from 'react-icons/hi'
import {HiOutlineLightBulb} from 'react-icons/hi'


const About = () => {
  return (
    <section id='about'>
      <h2>About Us</h2>

      <div className="container about__container">
        <div className="about__me">
          <div className="about__me-image">
            <img src={SWEPHOTO} alt="About Image" />
          </div>
        </div>

        <div className="about__content">
          <div className="about__cards">

            <article className='about__card'>
              <h2>Our goals</h2>
              <h4>hi Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 

Integer vitae justo eget magna fermentum iaculis. Hac habitasse platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Eget felis eget nunc lobortis mattis aliquam faucibus. Elit at imperdiet dui accumsan. Lectus mauris ultrices eros in cursus. Sagittis eu volutpat odio facilisis mauris sit amet. Libero nunc consequat interdum varius sit amet mattis vulputate. Lectus arcu bibendum at varius vel pharetra vel turpis. Diam maecenas sed enim ut sem. Sed euismod nisi porta lorem. 

</h4>
            </article>
          </div>
          
        </div>
      </div>
      <h2>Quote here</h2>
      

         <CTAabout />
    </section>
  )
}

export default About