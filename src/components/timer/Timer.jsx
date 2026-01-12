import React, { useEffect, useState } from "react";
import "./timer.css";
import timerBackground from "../../assets/timer_background.svg";
import homeFlower from "../../assets/home_flower copy.svg";
import homeLeaves from "../../assets/home_leaves.svg";

const calculateTimeLeft = () => {
  // January 22, 2026 at 5:30PM PST
  let difference = +new Date(`2026-01-22T17:30:00-08:00`) - +new Date();

  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

const formatTime = (value) => {
  return value.toString().padStart(2, "0");
};

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const days = timeLeft.days || 0;
  const hours = timeLeft.hours || 0;
  const minutes = timeLeft.minutes || 0;
  const seconds = timeLeft.seconds || 0;

  return (
    <div className="timer-section-wrapper">
      <div className="timer-logistics">
        <div className="logistics-date">Thursday, January 22</div>
        <div className="logistics-time">5:30 PM - 10:00 PM</div>
        <div className="logistics-location">@ Carnesale Commons</div>
      </div>
      <div className="timer-wrapper">
        <div className="timer-container">
        <img src={homeFlower} alt="Home flower decoration" className="timer-flower" />
        <img src={homeLeaves} alt="Home leaves decoration" className="timer-leaves" />
        <img src={timerBackground} alt="Timer background" className="timer-background" />
        <div className="timer-content">
          <div className="timer-section">
            <div className="timer-number">{formatTime(days)}</div>
            <div className="timer-label">DAYS</div>
          </div>
          <div className="timer-section">
            <div className="timer-number">{formatTime(hours)}</div>
            <div className="timer-label">HOURS</div>
          </div>
          <div className="timer-section">
            <div className="timer-number">{formatTime(minutes)}</div>
            <div className="timer-label">MIN</div>
          </div>
          <div className="timer-section">
            <div className="timer-number">{formatTime(seconds)}</div>
            <div className="timer-label">SEC</div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Timer;
