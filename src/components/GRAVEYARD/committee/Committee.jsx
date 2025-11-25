import React from 'react';
import './committee.css';
import KHANH from '../../assets/KhanhTran_Headshot.jpg';
import JOCELYN from '../../assets/JocelynBarrera_Headshot.png';
import JULIA from '../../assets/JuliaChen_Headshot.JPG';
import LAVENDER from '../../assets/LavenderHwang_Headshot.JPG';
import FIONA from '../../assets/FionaPeng_Headshot.jpg';
import SUSIE from '../../assets/SusieKIm_Headshot.JPG';

const data = [
  {
    id: 1,
    image: KHANH,
    title: 'Khanh Tran',
    position: 'Logistics Chair',
  },
  {
    id: 2,
    image: JOCELYN,
    title: 'Jocelyn Barrera',
    position: 'Professional Development Chair',
  },
  {
    id: 3,
    image: JULIA,
    title: 'Julia Chen',
    position: 'Design & Media Chair',
  },
  {
    id: 4,
    image: LAVENDER,
    title: 'Lavender Hwang',
    position: 'Corporate Relations Chair',
  },
  {
    id: 5,
    image: FIONA,
    title: 'Fiona Peng',
    position: 'Publicity Chair',
  },
  {
    id: 6,
    image: SUSIE,
    title: 'Susie Kim',
    position: 'Student Liaison Chair',
  },
];

const Committee = () => {
  return (
    <section id="committee">
      <h2>EWI COMMITTEE 2025</h2>

      <div className="container committee__container">
        {data.map(({ id, image, title, position }) => (
          <article className="committee__item" key={id}>
            <div className="committee__item-image">
              <img src={image} alt={title} />
            </div>
            <h3>{title}</h3>
            <h4>{position}</h4>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Committee;
