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
    title: "Connections that Count: Networking with EWI",
    dateTime: "Tuesday, Jan. 6th 6-7pm",
    description:
      "Learn how to start conversations, build genuine connections, and network with confidence at events like EWI.",
  },
  {
    number: 2,
    rsvpLink: "google.com",
    title: "LockedIn with LinkedIn",
    dateTime: "Thursday, Jan. 8th 5-6pm",
    description:
      "Turn your LinkedIn profile into a professional first impression that recruiters are eager to click on.",
  },
  {
    number: 3,
    rsvpLink:
      "https://docs.google.com/forms/d/e/1FAIpQLSdq1k42ZOhhAAlFQkY0tG6wQpZHrPrOlZpGfiQ1HnfFwUG5XQ/viewform?usp=header",
    title: "Perfect your Pitch",
    dateTime: "Tuesday, Jan. 13th 6-7pm",
    description:
      "Nervous about talking to over 20 recruiters at Evening with Industry 2026 📝? Level up your elevator pitch at our third EWI preparational workshop on Tuesday, Jan. 13 📈 Join us at EV 2101 from 6-7 pm to craft and practice a clear, confident elevator pitch that highlights your strengths and skills for your next internship or full-time job  🎉",
  },
  {
    number: 4,
    rsvpLink:
      "https://docs.google.com/forms/d/e/1FAIpQLScFx3EnVtKuiEI7lU3oNC_OPAk9Z4dyt4nPzT0HqSnVOHrhiA/viewform?usp=header",
    title: "Resume Ready",
    dateTime: "Thursday, Jan. 15th 6-7pm",
    description:
      "Update and strengthen your resume with actionable tips to make it recruiter-ready for internship applications",
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
