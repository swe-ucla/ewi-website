import React from "react";
import "./HomeEventItem.css";

const HomeEventItem = ({
  number,
  title,
  dateTime,
  description,
  rsvpLink,
}) => {
  return (
    <article className="home-event-item home-wire-box">
      <div className="home-event-item__header">
        <span className="home-event-item__number">
          {String(number).padStart(2, "0")}
        </span>
        <a
          href={rsvpLink}
          className="home-event-item__rsvp"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          RSVP ↗
        </a>
      </div>
      <h3 className="home-event-item__title">{title}</h3>
      <p className="home-event-item__datetime">{dateTime}</p>
      <p className="home-event-item__description">{description}</p>
    </article>
  );
};

export default HomeEventItem;
