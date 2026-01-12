import React, { useState, useEffect } from "react";
import "./Carousel.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import careerFair from "../../assets/career fair.png";
import dinner from "../../assets/dinner.png";
import ewi20xx from "../../assets/ewi_20xx.png";
import ewi2024 from "../../assets/ewi_2024.png";
import ewiCommittee from "../../assets/ewi_committee.png";

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
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
        </p>
      </div>

      <div className="carousel-buttons">
        <button className="carousel-register-btn">REGISTER</button>
        <button className="carousel-learn-more-btn">LEARN MORE</button>
      </div>
    </div>
  );
};

export default Carousel;
