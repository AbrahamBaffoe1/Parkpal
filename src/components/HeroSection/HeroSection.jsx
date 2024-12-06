import React from 'react';
import { ArrowRight } from 'lucide-react';
import './HeroSection.css';

export function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content parallax" data-rate="0.5">
        <h1 className="hero-title animate-on-scroll">
          Find Perfect
          <span className="text-gradient">Parking Spots</span>
          In Seconds
        </h1>
        <p className="hero-description animate-on-scroll">
          Stop circling the block. ParkPal helps you find and reserve parking spots
          in real-time, saving you time and reducing stress.
        </p>
        <div className="button-group animate-on-scroll">
          <button className="btn btn-primary magnetic-button tooltip" data-tooltip="Start your journey">
            Get Started <ArrowRight />
          </button>
          <button className="btn btn-secondary magnetic-button">
            View Demo
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats">
        {[
          { number: "50K+", label: "Active Users" },
          { number: "100+", label: "Cities" },
          { number: "1M+", label: "Spots Found" },
          { number: "4.8/5", label: "User Rating" }
        ].map((stat, index) => (
          <div 
            key={index}
            className="stat-card interactive-card animate-on-scroll"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="stat-number gradient-text">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}