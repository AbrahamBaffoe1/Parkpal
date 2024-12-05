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
    <section className="features">
      <h2 className="section-title animate-on-scroll">Why Choose ParkPal?</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="feature-card glass-card animate-on-scroll"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}