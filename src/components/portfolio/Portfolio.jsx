import React from 'react'
import './portfolio.css'
//import IMG6 from '../../assets/avatar1.jpg'
import LEXI from '../../assets/lexi.jpg'
import KAYLEE from '../../assets/kaylee.jpg'

// DO NOT USE THE IMAGES IN PRODUCTION

const data = [
 
  {
    id: 6,
    image: LEXI,
    title: 'Alexandra (Lexi) Jensen',
    bio: 'Alexandra Jensen is EWI 2024’s Internal Director and a third year in Bioengineering. She’s also a Design Team Project Manager in BMES and an undergraduate researcher in Soragni Lab, and hopes to pursue medical device design or engineering R&D. She loves art and creativity in all forms and was previously EWI 2023 Design and Media Chair. ',
  },
  {
    id: 6,
    image: KAYLEE,
    title: 'Kaylee Tran',
    position: 'External Director',
    bio: 'Kaylee Tran is a third year student studying Computer Science and the External Director of EWI 2024. When she’s not staring at compilation errors in her code, she enjoys taking dance classes and hitting the gym. She has been involved with web and mobile development through extracurriculars at UCLA and has previously served as Evening with Industry Corporate Relations Chair and Logistics Director.',
  }
]


const Portfolio = () => {
  return (
    <section id='portfolio'>
      
      <h2>EWI Directors 2024</h2>

      <div className="container portfolio__container">
        {
          data.map(({id, image, title, bio, github, demo}) => {
            return (
              <article key={id} className='portfolio__item'>
              <div className="portfolio__item-image">
                <img src={image} alt={title} />
              </div>
              <h3>{title}</h3>
              <h4>{bio}</h4>
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