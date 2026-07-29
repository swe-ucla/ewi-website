import React from "react";
import { Link } from "react-router-dom";
import HomeSection from "./HomeSection";
import HomeEventItem from "./HomeEventItem";
import { homeFeaturedEvents } from "./homeEventsData";
import "./HomeEvents.css";

const HomeEvents = () => {
  return (
    <HomeSection title="Events">
      <div className="home-events__list">
        {homeFeaturedEvents.map((event) => (
          <HomeEventItem key={event.id} {...event} />
        ))}
      </div>
      <Link to="/students" className="home-events__link">
        View student page for more details →
      </Link>
    </HomeSection>
  );
};

export default HomeEvents;
