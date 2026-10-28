import CommitteeGrid from "../components/committeeGrid/committeeGrid";
import MeetTeamHero from "../components/meetTeam/MeetTeamHero";
import "./MeetTheTeam.css";

const MeetTheTeam = () => {
  
  return (
    <div className="meet-team-page">
      <MeetTeamHero />
      <CommitteeGrid />
    </div>
  );
};

export default MeetTheTeam;
