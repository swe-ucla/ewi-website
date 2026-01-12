import "./EventsSection.css";

export type EventData = {
  number: number;
  rsvpLink: string;
  title: string;
  dateTime: string;
  description: string;
};

const Event = ({
  number,
  rsvpLink,
  title,
  dateTime,
  description,
}: EventData) => {
  return (
    <div className="event-card">
      <div className="event-card-left">
        <p className="event-card-number">
          {number.toString().padStart(2, "0")}
        </p>
        <button className="event-card-rsvp">
          <a href={rsvpLink}>RSVP ↗</a>
        </button>
      </div>
      <div className="event-card-right">
        {" "}
        <h1 className="event-card-title">{title}</h1>
        <p className="event-card-dateTime">{dateTime}</p>
        <p className="event-card-description">{description}</p>
      </div>
    </div>
  );
};

const eventsList: EventData[] = [
  {
    number: 1,
    rsvpLink: "google.com",
    title: "Event 1",
    dateTime: "Date Time",
    description: "This is the description",
  },
  {
    number: 2,
    rsvpLink: "google.com",
    title: "Event 1",
    dateTime: "Date Time",
    description: "This is the description",
  },
  {
    number: 3,
    rsvpLink: "google.com",
    title: "Event 1",
    dateTime: "Date Time",
    description: "This is the description",
  },
  {
    number: 4,
    rsvpLink: "google.com",
    title: "Event 1",
    dateTime: "Date Time",
    description: "This is the description",
  },
];

const EventsSection = () => {
  return (
    <section className="events-section">
      <h1 className="section-title">events</h1>
      <div className="events-grid">
        {eventsList.map((event) => (
          <Event key={event.number} {...event} />
        ))}
      </div>
    </section>
  );
};

export default EventsSection;
