import React, { useState, useEffect } from 'react';

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
  const circumference = 2 * Math.PI * 16; // radius of 16
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden px-1"> {/* Added px-6 for horizontal padding */}

      {/* Category Navigation */}
      <div className="flex justify-center items-center pt-6 pb-4 z-20 relative mt-5">
        <div className="flex space-x-1 bg-gray-900/50 backdrop-blur-sm rounded-full p-1">
          {['ambient', 'team', 'dishes'].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-white text-black shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Slideshow Container */}
      <div className="flex-1 relative overflow-visible flex justify-center mt-12">
        {/* We'll stack last 3 images with offsets */}
        {currentImages.map((image, idx) => {
          // Show only last 3 images before and including current image
          const offsetFromCurrent = (idx - currentImageIndex + totalImages) % totalImages;
          if (offsetFromCurrent > 2) return null;

          // Calculate stacking styles
          const translateX = offsetFromCurrent * 20; // shift right for stacking
          const translateY = -offsetFromCurrent * 10; // shift up for stacking
          const scale = 1 - offsetFromCurrent * 0.05; // slightly smaller for deeper layers
          const opacity = 1 - offsetFromCurrent * 0.4; // fade out deeper layers
          const zIndex = 10 - offsetFromCurrent; // higher zIndex for current image

          return (
            <img
              key={image.id}
              src={image.src}
              alt={image.alt}
              className="absolute max-h-[90vh] max-w-[70vw] object-cover rounded-lg shadow-lg transition-all duration-700 ease-in-out"
              style={{
                transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                opacity,
                zIndex,
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))',
              }}
              draggable={false}
            />
          );
        })}
        {/* Add subtle overlay gradient on top */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 to-transparent rounded-lg" />
      </div>

      {/* Circular Progress Indicator */}
      <div className="absolute bottom-6 left-6 z-20">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="3"
            />
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
              className="transition-all duration-300 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>
      </div>

      {/* Image Counter */}
      <div className="absolute bottom-6 right-6 z-20">
        <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-xs text-white/80">
            {currentImageIndex + 1} / {totalImages}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
