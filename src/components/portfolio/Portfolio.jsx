import React from 'react'
import './portfolio.css'
//import IMG6 from '../../assets/avatar1.jpg'
import INTERNAL from '../../assets/lexi.jpg'
import EXTERNAL from '../../assets/kaylee.jpg'

// DO NOT USE THE IMAGES IN PRODUCTION

const data = [
 
  {
    id: 6,
    image: INTERNAL,
    title: 'Crystal Chan',
    position: 'Internal Director',
    bio: 'insert bio',
  },
  {
    id: 6,
    image: EXTERNAL,
    title: 'Khushi Patel',
    position: 'External Director',
    bio: 'insert bio',
  }
]


const Portfolio = () => {
  return (
    <section id='portfolio'>
      
      <h2>EWI Directors 2024</h2>

      <div className="container portfolio__container">
        {
          data.map(({id, image, title, position, bio, github, demo}) => {
            return (
              <article key={id} className='portfolio__item'>
              <div className="portfolio__item-image">
                <img src={image} alt={title} />
              </div>
              <h3>{title}</h3>
              <h5>{position}</h5>
              <h4>{bio}</h4>
            </article>
            )
          })
        }
      </div>
      <h6 id='contact'></h6>
    </section>
  )
}

export default Portfolio