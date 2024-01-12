import React, { useEffect, useState } from 'react'
import './timer.css'

const calculateTimeLeft = () => {
    let difference = +new Date(`02/08/2024`) - +new Date();
  
    let timeLeft = {};
  
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
  
    return timeLeft;
  }

const Timer = () => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    useEffect(() => {
        const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
        }, 1000);
    
        return () => clearTimeout(timer);
    });

    const timerComponents = [];
    Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
        return;
    }
    timerComponents.push(
        <span>
        {timeLeft[interval]} {interval}{" "}
        </span>
    );
    });
  return (
    <div>
        <div className='countdown__container'>
            {timerComponents.length ? timerComponents : <span></span>}
        </div>
    </div>
  )
}

export default Timer