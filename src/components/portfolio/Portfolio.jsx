import React from 'react'
import './portfolio.css'
import IMG6 from '../../assets/avatar1.jpg'
import LEXI from '../../assets/lexi.png'
import KAYLEE from '../../assets/kaylee.png'

// DO NOT USE THE IMAGES IN PRODUCTION

const data = [
 
  {
    id: 6,
    image: LEXI,
    title: 'Alexandra (Lexi) Jensen',
    
  },
  {
    id: 6,
    image: KAYLEE,
    title: 'Kaylee Tran',
    
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