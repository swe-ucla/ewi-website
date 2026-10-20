import React, { useEffect, useState } from "react";
import {
  homeEventConfig,
  getCountdownTargetDate,
} from "./homeEventConfig";
import "./HomeCountdown.css";

const getTimeLeft = (target) => {
  const difference = target.getTime() - Date.now();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    ended: false,
  };
};

const pad = (value) => value.toString().padStart(2, "0");

const HomeCountdown = () => {
  const targetMs = getCountdownTargetDate().getTime();
  const [timeLeft, setTimeLeft] = useState(() =>
    getTimeLeft(new Date(targetMs))
  );

  useEffect(() => {
    const target = new Date(targetMs);
    const tick = () => setTimeLeft(getTimeLeft(target));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetMs]);

  const groups = [
    { label: "days", value: pad(timeLeft.days) },
    { label: "hours", value: pad(timeLeft.hours) },
    { label: "min", value: pad(timeLeft.minutes) },
  ];

  const { date, time, location } = homeEventConfig;

  const timerSummary = timeLeft.ended
    ? "Event countdown complete"
    : `${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes until EWI. ${date}, ${time}, ${location}`;

  return (
    <section className="home-countdown-section" aria-label="Countdown to EWI">
      {timeLeft.ended ? (
        <p className="home-countdown__ended">See you at {location}!</p>
      ) : (
        <div
          className="home-countdown"
          role="timer"
          aria-live="polite"
          aria-atomic="true"
          aria-label={timerSummary}
        >
          <div className="home-countdown__digits">
            {groups.map((group, index) => (
              <React.Fragment key={group.label}>
                {index > 0 ? (
                  <span className="home-countdown__colon" aria-hidden="true">
                    :
                  </span>
                ) : null}
                <span className="home-countdown__unit">
                  <span className="home-countdown__pair">
                    <span className="home-countdown__box">{group.value[0]}</span>
                    <span className="home-countdown__box">{group.value[1]}</span>
                  </span>
                  <span className="home-countdown__label">{group.label}</span>
                </span>
              </React.Fragment>
            ))}
          </div>
          <p className="home-countdown__meta">
            {date} · {time} · {location}
          </p>
        </div>
      )}
    </section>
  );
};

export default HomeCountdown;
