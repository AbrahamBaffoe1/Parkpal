// src/components/landing/Landing.jsx
import { ArrowRight, MapPin, Car, Shield, Star } from 'lucide-react';
import '../landing/Landing.css';

export function Landing() {
  const features = [
    {
      icon: <MapPin className="feature-icon" />,
      title: "Real-time Availability",
      description: "Find open parking spots instantly in your desired location."
    },
    {
      icon: <Car className="feature-icon" />,
      title: "Easy Booking",
      description: "Reserve your spot in advance with just a few taps."
    },
    {
      icon: <Shield className="feature-icon" />,
      title: "Secure Payments",
      description: "Safe and encrypted transactions for peace of mind."
    },
    {
      icon: <Star className="feature-icon" />,
      title: "User Reviews",
      description: "Make informed decisions with community feedback."
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "100+", label: "Cities" },
    { number: "1M+", label: "Spots Found" },
    { number: "4.8/5", label: "User Rating" }
  ];

  return (
    <div className="landing-container">
      {/* Top Banner */}
      <div className="top-banner">
        <span>🎉 Now available in 100+ cities!</span>
        <button className="banner-button">Learn More</button>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">
          Find Perfect
          <span className="gradient-text block">Parking Spots</span>
          In Seconds
        </h1>
        <p className="hero-description">
          Stop circling the block. ParkPal helps you find and reserve parking spots
          in real-time, saving you time and reducing stress.
        </p>
        <div className="hero-buttons">
          <button className="primary-button">
            Get Started <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          <button className="secondary-button">
            View Demo
          </button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose ParkPal?</h2>
        <p className="section-description">
          Our smart parking solution makes finding and reserving parking spots effortless.
        </p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2 className="cta-title">Ready to Start Parking Smarter?</h2>
        <p className="cta-description">
          Join thousands of drivers who have already simplified their parking experience.
        </p>
        <button className="cta-button">
          Sign Up Now
        </button>
      </section>
    </div>
  );
}