import React, { useState, useEffect } from 'react';
import './Gallery.css';

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('ambient');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imageData = {
    ambient: [
      { id: 1, src: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg', alt: 'Cozy ambient lighting' },
      { id: 2, src: 'https://images.pexels.com/photos/3887985/pexels-photo-3887985.jpeg', alt: 'Warm ambient space' },
      { id: 3, src: 'https://images.pexels.com/photos/827528/pexels-photo-827528.jpeg', alt: 'Evening ambient mood' },
      { id: 4, src: 'https://images.pexels.com/photos/1378424/pexels-photo-1378424.jpeg', alt: 'Modern ambient design' },
      { id: 5, src: 'https://images.pexels.com/photos/1546039/pexels-photo-1546039.jpeg', alt: 'Atmospheric lighting' }
    ],
    team: [
      { id: 1, src: 'https://images.pexels.com/photos/6605189/pexels-photo-6605189.jpeg', alt: 'Team collaboration' },
      { id: 2, src: 'https://images.pexels.com/photos/4253312/pexels-photo-4253312.jpeg', alt: 'Team meeting' },
      { id: 3, src: 'https://images.pexels.com/photos/3438708/pexels-photo-3438708.jpeg', alt: 'Team workspace' },
      { id: 4, src: 'https://images.pexels.com/photos/15441280/pexels-photo-15441280.jpeg', alt: 'Team discussion' },
      { id: 5, src: 'https://images.pexels.com/photos/32754747/pexels-photo-32754747.jpeg', alt: 'Team planning' }
    ],
    dishes: [
      { id: 1, src: 'https://theforkedspoon.com/wp-content/uploads/2025/04/Chicken-Gyro-22-scaled.jpg', alt: 'Gourmet dish' },
      { id: 2, src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=600&fit=crop', alt: 'Fine dining plate' },
      { id: 3, src: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=600&fit=crop', alt: 'Artisanal cuisine' },
      { id: 4, src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=600&fit=crop', alt: 'Chef special' },
      { id: 5, src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=600&fit=crop', alt: 'Signature dish' }
    ]
  };

  const currentImages = imageData[activeCategory];
  const totalImages = currentImages.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    }, 2000);
    return () => clearInterval(interval);
  }, [totalImages]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [activeCategory]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const progressPercentage = ((currentImageIndex + 1) / totalImages) * 100;
  const circumference = 2 * Math.PI * 16;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="gallery-container">
      
      {/* Category Navigation */}
      <div className="category-nav">
        <div className="category-buttons">
          {['ambient', 'team', 'dishes'].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Slideshow */}
      <div className="slideshow">
        {currentImages.map((image, idx) => {
          const offsetFromCurrent = (idx - currentImageIndex + totalImages) % totalImages;
          if (offsetFromCurrent > 2) return null;

          const translateX = offsetFromCurrent * 20;
          const translateY = -offsetFromCurrent * 10;
          const scale = 1 - offsetFromCurrent * 0.05;
          const opacity = 1 - offsetFromCurrent * 0.4;
          const zIndex = 10 - offsetFromCurrent;

          return (
            <img
              key={image.id}
              src={image.src}
              alt={image.alt}
              className="slideshow-image"
              style={{
                transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                opacity,
                zIndex
              }}
              draggable={false}
            />
          );
        })}
        <div className="slideshow-overlay" />
      </div>

      {/* Progress Indicator */}
      <div className="progress-indicator">
        <div className="progress-svg">
          <svg viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="progress-text">{Math.round(progressPercentage)}%</div>
        </div>
      </div>

      {/* Counter */}
      <div className="image-counter">
        <span>{currentImageIndex + 1} / {totalImages}</span>
      </div>
    </div>
  );
};

export default Gallery;
