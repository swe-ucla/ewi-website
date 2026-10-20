import React from "react";
import HomeSection from "./HomeSection";
import HomeEventItem from "./HomeEventItem";
import { homeFeaturedEvents } from "./homeEventsData";
import "./HomeEvents.css";

const HomeEvents = () => {
  return (
    <HomeSection title="events">
      <ul className="home-events__list" aria-label="Featured events">
        {homeFeaturedEvents.map((event) => (
          <li key={event.id}>
            <HomeEventItem {...event} />
          </li>
        ))}
      </ul>
    </HomeSection>
  );
};

export default HomeEvents;
