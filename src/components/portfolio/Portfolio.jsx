import React from 'react'
import './portfolio.css'
//import IMG6 from '../../assets/avatar1.jpg'
import INTERNAL from '../../assets/crystal.jpg'
import EXTERNAL from '../../assets/khushi.png'

// DO NOT USE THE IMAGES IN PRODUCTION

const data = [
 
  {
    id: 6,
    image: INTERNAL,
    title: 'Crystal Chan',
    position: 'Internal Director',
    bio: 'Crystal Chan is a third year student studying Materials Engineering and the Internal Director for EWI 2025. She has been involved with Materials Research Society (MRS) and hopes to pursue a career within the sustainable design of innovative materials, products, and spaces. In her spare time, she enjoys taking dance classes and cafe hopping. She has previously served as EWI 2024 Design and Media Chair.',
    linkedin: "https://www.linkedin.com/in/crystalchan23"
  },
  {
    id: 6,
    image: EXTERNAL,
    title: 'Khushi Patel',
    position: 'External Director',
    bio: 'Khushi Patel is a third year student studying Civil Engineering and Entrepreneurship. In addition to being the External Director for EWI 2025, she has been involved with Engineers without Borders and Consult Your Community. She aims to pursue a career in construction management and development. She likes hot yoga, dancing, and trying new restaurants in her free time. She previously served as EWI 2024 Logistics Chair and EWI 2023 Student Liaison.',
    linkedin: "https://www.linkedin.com/in/khushipatel22",
  }
]


const Portfolio = () => {
  return (
    <section id='portfolio'>
      
      <h2>EWI Directors 2025</h2>

      <div className="container portfolio__container">
        {
          data.map(({id, image, title, position, bio, linkedin, github, demo}) => {
            return (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" key={id}>
                <article className='portfolio__item'>
                  <div className="portfolio__item-image">
                    <img src={image} alt={title} />
                  </div>
                  <h3>{title}</h3>
                  <h5>{position}</h5>
                  <h4>{bio}</h4>
                </article>
              </a>
            )
          })
        }
      </div>
      <h6 id='contact'></h6>
    </section>
  )
}

export default Portfolio