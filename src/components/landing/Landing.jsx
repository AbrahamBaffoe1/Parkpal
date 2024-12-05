// src/components/landing/Landing.jsx
import { ArrowRight, MapPin, Car, Shield, Star } from 'lucide-react';
import './Landing.css';

export function Landing() {
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

  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "100+", label: "Cities" },
    { number: "1M+", label: "Spots Found" },
    { number: "4.8/5", label: "User Rating" }
  ];

  return (
    <div className="landing-page">
      {/* Banner */}
      <div className="banner">
        <span>🎉 Now available in 100+ cities!</span>
        <button className="banner-button">Learn More</button>
      </div>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <a href="/" className="nav-logo">ParkPal</a>
          <div className="nav-links">
            <a href="/about" className="nav-link">About</a>
            <a href="/features" className="nav-link">Features</a>
            <a href="/pricing" className="nav-link">Pricing</a>
            <a href="/login" className="nav-button">Get Started</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content fade-up">
          <h1 className="hero-title">
            Find Perfect
            <span>Parking Spots</span>
            In Seconds
          </h1>
          <p className="hero-description">
            Stop circling the block. ParkPal helps you find and reserve parking spots
            in real-time, saving you time and reducing stress.
          </p>
          <div className="button-group">
            <button className="btn btn-primary">
              Get Started <ArrowRight />
            </button>
            <button className="btn btn-secondary">
              View Demo
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`stat-card fade-up fade-up-delay-${index + 1}`}
            >
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <h2 className="section-title text-center fade-up">Why Choose ParkPal?</h2>
        <p className="section-description text-center fade-up fade-up-delay-1">
          Our smart parking solution makes finding and reserving parking spots effortless.
        </p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`feature-card glass-card fade-up fade-up-delay-${index + 1}`}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content fade-up">
          <h2 className="cta-title">Ready to Start Parking Smarter?</h2>
          <p className="cta-description">
            Join thousands of drivers who have already simplified their parking experience.
          </p>
          <button className="btn btn-primary hover-glow">
            Sign Up Now
          </button>
        </div>
      </section>
    </div>
  );
}