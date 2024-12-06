import React from 'react';
import { MapPin, Car, Shield, Star } from 'lucide-react';

export function FeaturesGrid() {
  const features = [
    {
      icon: <MapPin />,
      title: "Real-time Availability",
      description: "Find open parking spots instantly in your desired location."
    },
    {
      icon: <Car />,
      title: "Easy Booking",
      description: "Reserve your spot in advance with just a few taps."
    },
    {
      icon: <Shield />,
      title: "Secure Payments",
      description: "Safe and encrypted transactions for peace of mind."
    },
    {
      icon: <Star />,
      title: "User Reviews",
      description: "Make informed decisions with community feedback."
    }
  ];

  return (
    <section className="features-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title animate-on-scroll">Why Choose ParkPal?</h2>
          <p className="section-description animate-on-scroll">
            Our platform offers a seamless parking experience with real-time availability, easy booking, secure payments, and trusted user reviews.
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-card glass-card animate-on-scroll fade-up-delay-${index + 1}`}
            >
              <div className="feature-icon-wrapper">
                <div className="feature-icon">{feature.icon}</div>
              </div>
              <div className="feature-content">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}