import React, { useEffect, useRef } from 'react';
import { MapPin, Car, Shield, Star, Clock, CreditCard } from 'lucide-react';
import './FeaturesGrid.css';

export function FeaturesGrid() {
  const features = [
    {
      icon: <MapPin />,
      title: "Real-time Location Intelligence",
      description: "Advanced GPS tracking shows real-time parking availability with 99.9% accuracy across all supported locations."
    },
    {
      icon: <Car />,
      title: "Smart Booking System",
      description: "AI-powered booking system learns from your preferences to suggest optimal parking spots and routes."
    },
    {
      icon: <Shield />,
      title: "Enterprise-grade Security",
      description: "Bank-level encryption and multi-factor authentication ensure your transactions are always protected."
    },
    {
      icon: <Star />,
      title: "Verified Reviews & Insights",
      description: "Make informed decisions with our curated review system featuring detailed ratings and user experiences."
    },
    {
      icon: <Clock />,
      title: "Predictive Availability",
      description: "Our machine learning algorithms predict parking spot availability up to 24 hours in advance."
    },
    {
      icon: <CreditCard />,
      title: "Seamless Payments",
      description: "Integrated payment system supports all major cards, digital wallets, and corporate accounts."
    }
  ];

  // Intersection Observer setup for animations
  const observerRef = useRef(null);
  
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    // Observe all animated elements
    document.querySelectorAll('.animate-on-scroll').forEach((element) => {
      observerRef.current.observe(element);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <section className="features-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title animate-on-scroll">
            Enterprise Solutions for Modern Parking
          </h2>
          <p className="section-description animate-on-scroll">
            ParkPal leverages cutting-edge technology to revolutionize the parking experience. 
            Our enterprise-grade platform delivers unmatched reliability, security, and convenience 
            to businesses and individuals alike.
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-card animate-on-scroll`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                transitionDelay: `${index * 0.1}s`
              }}
            >
              <div className="feature-icon-wrapper">
                {feature.icon}
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