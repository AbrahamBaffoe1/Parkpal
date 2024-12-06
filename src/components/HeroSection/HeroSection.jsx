import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Car, MapPin, ParkingSquare, Search } from 'lucide-react';
import './HeroSection.css';

export function HeroSection() {
  const carRef = useRef(null);
  const [isSearching, setIsSearching] = useState(true);

  useEffect(() => {
    // Simulate parking search animation loop
    const searchInterval = setInterval(() => {
      setIsSearching(prev => !prev);
    }, 3000);

    return () => clearInterval(searchInterval);
  }, []);

  return (
    <section className="hero">
      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="grid-overlay"></div>
      </div>

      <div className="hero-container">
        {/* Main Content */}
        <div className="hero-content">
          <h1 className="hero-title">
            Find Perfect
            <span className="gradient-text">Parking Spots </span> <br />
            In Seconds
          </h1>
          <p className="hero-description">
            Stop circling the block. ParkPal helps you find and reserve parking spots
            in real-time, saving you time and reducing stress.
          </p>
          <div className="button-group">
            <button className="btn-primary">
              <span className="button-text">Get Started</span>
              <ArrowRight className="button-icon" />
              <div className="button-glow"></div>
            </button>
            <button className="btn-secondary">
              <span className="button-text">View Demo</span>
              <ArrowRight className="button-icon" />
              <div className="button-glow"></div>
            </button>
          </div>
        </div>

        {/* 3D Car Animation Card */}
        <div className="car-animation-card">
          <div className="car-scene">
            {/* Parking Grid */}
            <div className="parking-grid">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="parking-spot">
                  <ParkingSquare size={20} className="parking-icon" />
                </div>
              ))}
            </div>
            
            {/* Animated Car */}
            <div className={`car-wrapper ${isSearching ? 'searching' : 'parked'}`} ref={carRef}>
              <div className="car-model">
                <Car size={48} className="car-icon" />
                <div className="car-shadow"></div>
                <div className="search-indicator">
                  <Search size={16} className="search-icon" />
                  <span className="search-pulse"></span>
                </div>
                <div className="location-pin">
                  <MapPin size={20} className="pin-icon" />
                </div>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="status-indicators">
              <div className="status-dot searching"></div>
              <span className="status-text">
                {isSearching ? 'Searching for spot...' : 'Perfect spot found!'}
              </span>
            </div>
          </div>

          {/* Card Details */}
          <div className="card-details">
            <div className="search-stats">
              <div className="stat">
                <span className="stat-value">5</span>
                <span className="stat-label">Spots Nearby</span>
              </div>
              <div className="stat">
                <span className="stat-value">2min</span>
                <span className="stat-label">Walking</span>
              </div>
              <div className="stat">
                <span className="stat-value">$4/h</span>
                <span className="stat-label">Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats">
        {[
          { number: "50K+", label: "Active Users", icon: "👥" },
          { number: "100+", label: "Cities", icon: "🏙️" },
          { number: "1M+", label: "Spots Found", icon: "🎯" },
          { number: "4.8/5", label: "User Rating", icon: "⭐" }
        ].map((stat, index) => (
          <div key={index} className="stat-card">
            <span className="stat-icon">{stat.icon}</span>
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}