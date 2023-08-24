import React from 'react'
import './portfolio.css'
import IMG6 from '../../assets/avatar1.jpg'

// DO NOT USE THE IMAGES IN PRODUCTION

const data = [
 
  {
    id: 6,
    image: IMG6,
    title: 'Lexi',
    
  },
  {
    id: 6,
    image: IMG6,
    title: 'Kaylee',
    
  }
]


const Portfolio = () => {
  return (
    <section id='portfolio'>
      
      <h2>EWI Directors</h2>

      <div className="container portfolio__container">
        {
          data.map(({id, image, title, github, demo}) => {
            return (
              <article key={id} className='portfolio__item'>
              <div className="portfolio__item-image">
                <img src={image} alt={title} />
              </div>
              <h3>{title}</h3>
              <div className="portfolio__item-cta">

                
              </div>
            </article>
            )
          })
        }
      </div>
    </section>
  )
}

export default Portfolio