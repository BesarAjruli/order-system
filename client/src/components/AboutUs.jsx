import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-contentBox">
        <h1 className="about-heading">Welcome to Aplos Flavour</h1>
        <p className="about-paragraph">
          Nestled in the heart of the city, <span className="about-highlight">Aplos Flavour</span> was born from a passion for authentic tastes and heartfelt hospitality. Our journey started in 2010, when two friends, Alex and Sofia, decided to blend their love for traditional recipes and modern culinary twists. 
        </p>
        <p className="about-paragraph">
          Inspired by the vibrant aromas of their grandmothers’ kitchens and the rich diversity of global flavours, Aplos Flavour is a celebration of food that connects people. Every dish is crafted with fresh, locally-sourced ingredients and a sprinkle of love, promising a dining experience that feels both familiar and exciting.
        </p>
        <p className="about-paragraph">
          Whether you're joining us for a cozy family dinner, a lively night out with friends, or a quiet moment of indulgence, our warm and welcoming team is here to make every visit memorable. At Aplos Flavour, we don’t just serve food — we share stories, create memories, and bring flavours to life.
        </p>
        <p className="about-paragraph about-italic">
          Come taste the magic. Your table is waiting.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
