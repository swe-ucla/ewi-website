import React from "react";
import { Link } from "react-router-dom";
import HomeSection from "./HomeSection";
import HomeEventItem from "./HomeEventItem";
import { homeFeaturedEvents } from "./homeEventsData";
import "./HomeEvents.css";

const HomeEvents = () => {
  return (
    <HomeSection title="Events">
      <ul className="home-events__list" aria-label="Featured events">
        {homeFeaturedEvents.map((event) => (
          <li key={event.id}>
            <HomeEventItem {...event} />
          </li>
        ))}
      </ul>
      <Link to="/students" className="home-events__link" aria-label="View student page for more event details">
        View student page for more details →
      </Link>
    </HomeSection>
  );
};

export default HomeEvents;
