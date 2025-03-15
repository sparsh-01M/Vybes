// src/components/Hero.js
import React from 'react';
import '../styles/Hero.css';

const Hero = ({ bannerImage }) => {
  const heroStyle = {
    backgroundImage: bannerImage ? `url(${bannerImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '50vh', // Half screen height
  };

  return (
    <section className="hero" style={heroStyle}>
      <div className="hero-content">
      <h1>Explore. Connect. Inspire.</h1>  
      <p>A safe social platform with curated, categorized content—free from </p>
        <p>vulgarity, fostering meaningful connections and creativity.</p>
        <div className="cta-buttons">
          <a href="https://appstore.com/qpingr" target="_blank" rel="noopener noreferrer">
            Download the App
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;