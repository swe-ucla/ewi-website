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

  const units = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MIN", value: timeLeft.minutes },
    { label: "SEC", value: timeLeft.seconds },
  ];

  const { date, time, location } = homeEventConfig;

  const timerSummary = timeLeft.ended
    ? "Event countdown complete"
    : `${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds until EWI`;

  return (
    <section className="home-countdown-section" aria-label="Countdown to EWI">
      <div className="home-countdown home-wire-box">
        <p className="home-countdown__heading">countdown</p>

        <div
          className="home-countdown__logistics"
          aria-label={`Event details: ${date}, ${time}, ${location}`}
        >
          <span>{date}</span>
          <span className="home-countdown__logistics-sep" aria-hidden="true">
            ·
          </span>
          <span>{time}</span>
          <span className="home-countdown__logistics-sep" aria-hidden="true">
            ·
          </span>
          <span>{location}</span>
        </div>

        {timeLeft.ended ? (
          <p className="home-countdown__ended">See you at {location}!</p>
        ) : (
          <div
            className="home-countdown__timer"
            role="timer"
            aria-live="polite"
            aria-atomic="true"
            aria-label={timerSummary}
          >
            {units.map((unit) => (
              <div key={unit.label} className="home-countdown__unit">
                <span className="home-countdown__value">{pad(unit.value)}</span>
                <span className="home-countdown__label">{unit.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeCountdown;
