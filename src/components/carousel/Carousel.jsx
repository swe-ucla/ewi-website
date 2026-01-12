import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Carousel.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import careerFair from "../../assets/career fair.png";
import dinner from "../../assets/dinner.png";
import ewi20xx from "../../assets/ewi_20xx.png";
import ewi2024 from "../../assets/ewi_2024.png";
import ewiCommittee from "../../assets/ewi_committee.png";
import tiltedFlower from "../../assets/tilted_flower.svg";
import tiltedLeaves from "../../assets/tilted_leaves.svg";

const defaultImages = [careerFair, dinner, ewi20xx, ewi2024, ewiCommittee];

const Carousel = ({ images = defaultImages, autoPlay = true, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Auto-play
  useEffect(() => {
    if (!autoPlay || images.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [currentIndex, autoPlay, interval, images.length]);

  if (images.length === 0) return <p>No images</p>;

  return (
    <div className="carousel-section">
      <div className="carousel-container">
        <button className="carousel-btn prev" onClick={prevImage}>
          <FaChevronLeft />
        </button>

        <div className="carousel-image-wrapper">
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex}`}
            className="carousel-image"
          />
          <img src={tiltedFlower} alt="Tilted flower decoration" className="carousel-flower" />
          <img src={tiltedLeaves} alt="Tilted leaves decoration" className="carousel-leaves" />
        </div>

        <button className="carousel-btn next" onClick={nextImage}>
          <FaChevronRight />
        </button>

        <div className="carousel-dots">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
      
      <div className="carousel-text">
        <p>
          Evening with Industry (EWI) is one of Society of Women Engineers' flagship events and the largest student-run networking event at UCLA. This year, we are proud to host the 49th annual EWI on Thursday, January 22 from 5:30 p.m. to 10:00 p.m. at Carnesale Commons.
        </p>
        <p>
          Our goal is to make the networking experience more personable and approachable. Deviating from a traditional career fair, we prioritize gaining valuable connections by dividing the event into three main portions: informal networking over appetizers, a multi-course catered dinner, and conclude with a typical career fair.
        </p>
        <p>
          During our three-course dinner portion, 6-8 students will be assigned to sit with 1-2 company representatives of their choice. This format encourages unscripted conversations and genuine insights, in contrast to conventional high-stakes, fast-paced career fairs. For students looking to broaden their connections with other representatives, attendees are free to explore all companies during the career fair.
        </p>
        <p>
          While the event is traditionally oriented towards women in engineering, we welcome students of all genders and academic backgrounds relevant to the engineering field. Our primary goal is to ensure that every attendee gains an enriching and worthwhile experience.
        </p>
        <p>
          We are happy to continue hosting EWI in-person in 2026, as we believe the opportunity for participants to immerse themselves in the atmosphere of the event leads to a more impactful experience.
        </p>
      </div>

      <div className="carousel-buttons">
        <Link to="/students">
          <button className="carousel-register-btn">REGISTER</button>
        </Link>
        <Link to="/students">
          <button className="carousel-learn-more-btn">LEARN MORE</button>
        </Link>
      </div>
    </div>
  );
};

export default Carousel;
