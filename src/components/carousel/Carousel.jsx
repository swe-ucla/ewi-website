import React, { useState, useEffect } from 'react';
import './Carousel.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Carousel = ({ images = [], autoPlay = true, interval = 3000 }) => {
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
    if (!autoPlay) return;
    const timer = setInterval(nextImage, interval);
    return () => clearInterval(timer);
  }, [currentIndex, autoPlay, interval]);

  if (images.length === 0) return <p>No images</p>;

  return (
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
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
