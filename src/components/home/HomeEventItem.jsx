import React from "react";
import { HiOutlineLocationMarker, HiOutlineClock } from "react-icons/hi";
import "./HomeEventItem.css";

const HomeEventItem = ({
  title,
  description,
  location,
  time,
  rsvpLink,
}) => {
  return (
    <a
      className="home-event-item"
      href={rsvpLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${title}. ${description} ${location}. ${time}. RSVP, opens in a new tab.`}
    >
      <div className="home-event-item__badge" aria-hidden="true">
        #
      </div>
      <div className="home-event-item__body">
        <h3 className="home-event-item__title">{title}</h3>
        <p className="home-event-item__description">{description}</p>
        <div className="home-event-item__meta">
          <span>
            <HiOutlineLocationMarker aria-hidden="true" />
            {location}
          </span>
          <span>
            <HiOutlineClock aria-hidden="true" />
            {time}
          </span>
        </div>
      </div>
    </a>
  );
};

export default HomeEventItem;
