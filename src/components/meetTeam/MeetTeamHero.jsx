import React from 'react';
import './MeetTeamHero.css';
import pinecone from '../../assets/pinecone_v3.svg';
import leaves from '../../assets/three_leaves.svg';

const MeetTeamHero = () => {
  return (
    <div className="meet-team-hero">
      <div className="meet-team-hero-content">
        <img src={pinecone} alt="" className="meet-team-hero-pinecone" />
        <h1 className="meet-team-hero-title">
          <span className="meet-team-hero-first-line">
            <span>meet</span>
            <span className="meet-team-hero-the">the</span>
          </span>
          <span>team</span>
        </h1>
        <img src={leaves} alt="" className="meet-team-hero-leaves" />
      </div>
    </div>
  );
};

export default MeetTeamHero;
