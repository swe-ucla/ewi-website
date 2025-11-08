import React from 'react';
import './meetTheTeam.css';
import PeopleCard from '../peopleCard/PeopleCard';
import KHANH from '../../assets/KhanhTran_Headshot.jpg';
import JOCELYN from '../../assets/JocelynBarrera_Headshot.png';
import JULIA from '../../assets/JuliaChen_Headshot.JPG';
import LAVENDER from '../../assets/LavenderHwang_Headshot.JPG';
import FIONA from '../../assets/FionaPeng_Headshot.jpg';
import SUSIE from '../../assets/SusieKIm_Headshot.JPG';

const teamData = [
  {
    id: 1,
    image: KHANH,
    name: 'Khanh Tran',
    position: 'Logistics Chair',
    year: '3rd Year',
    major: 'Computer Science',
    description: 'Khanh Tran oversees all logistical aspects of EWI 2025, ensuring smooth operations and coordination for the event.',
  },
  {
    id: 2,
    image: JOCELYN,
    name: 'Jocelyn Barrera',
    position: 'Professional Development Chair',
    year: '3rd Year',
    major: 'Computer Science',
    description: 'Jocelyn Barrera leads professional development initiatives, helping students prepare for their careers and networking opportunities.',
  },
  {
    id: 3,
    image: JULIA,
    name: 'Julia Chen',
    position: 'Design & Media Chair',
    year: '3rd Year',
    major: 'Computer Science',
    description: 'Julia Chen manages all design and media content for EWI, creating visual materials and maintaining the event\'s brand identity.',
  },
  {
    id: 4,
    image: LAVENDER,
    name: 'Lavender Hwang',
    position: 'Corporate Relations Chair',
    year: '3rd Year',
    major: 'Computer Science',
    description: 'Lavender Hwang builds and maintains relationships with corporate partners, facilitating sponsorship and company participation.',
  },
  {
    id: 5,
    image: FIONA,
    name: 'Fiona Peng',
    position: 'Publicity Chair',
    year: '3rd Year',
    major: 'Computer Science',
    description: 'Fiona Peng handles all publicity and marketing efforts, spreading the word about EWI to students and the broader community.',
  },
  {
    id: 6,
    image: SUSIE,
    name: 'Susie Kim',
    position: 'Student Liaison Chair',
    year: '3rd Year',
    major: 'Computer Science',
    description: 'Susie Kim serves as the primary point of contact for students, addressing questions and ensuring a great experience for all attendees.',
  },
];

const MeetTheTeam = () => {
  return (
    <section id="meet-the-team">
      <h2>Meet the Team</h2>
      <div className="container meet-the-team__container">
        {teamData.map(({ id, image, name, position, description, year, major }) => (
          <PeopleCard
            key={id}
            image={image}
            name={name}
            position={position}
            description={description}
            year={year}
            major={major}
          />
        ))}
      </div>
    </section>
  );
};

export default MeetTheTeam;

