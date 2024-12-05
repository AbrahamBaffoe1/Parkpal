// src/components/landing/Landing.jsx
import { useEffect, useRef } from 'react';
import { ArrowRight, MapPin, Car, Shield, Star, ChevronRight, Quote } from 'lucide-react';
import { CustomCursor } from '../cursor/CustomCursor';
import { PricingSection } from '../sections/PricingSection';
import { IntegrationsSection } from '../sections/IntegrationsSection';
import './Landing.css';

export function Landing() {
  const parallaxRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.parallax');
      elements.forEach(el => {
        const scrolled = window.pageYOffset;
        const rate = el.dataset.rate || 0.3;
        const yPos = -(scrolled * rate);
        el.style.setProperty('--parallax-y', `${yPos}px`);
      });
    };

    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

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

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Daily Commuter",
      content: "ParkPal has transformed my daily commute. Finding parking is now effortless!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Business Owner",
      content: "The best parking solution for my business needs. Highly recommended!",
      rating: 5
    },
    {
      name: "Emma Wilson",
      role: "City Explorer",
      content: "Love the real-time updates and user-friendly interface. A must-have app!",
      rating: 4
    }
  ];

  return (
    <div className="landing-page" ref={parallaxRef}>
      <CustomCursor />
      
      {/* Banner */}
      <div className="banner">
        <span className="animate-on-scroll">🎉 Now available in 100+ cities!</span>
        <button className="banner-button magnetic-button">
          Learn More
        </button>
      </div>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <a href="/" className="nav-logo magnetic-button">ParkPal</a>
          <div className="nav-links">
            <a href="/about" className="nav-link hover-lift">About</a>
            <a href="/features" className="nav-link hover-lift">Features</a>
            <a href="/pricing" className="nav-link hover-lift">Pricing</a>
            <a href="/login" className="nav-button magnetic-button">
              Get Started <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content parallax" data-rate="0.5">
          <h1 className="hero-title animate-on-scroll">
            Find Perfect
            <span className="gradient-text">Parking Spots</span>
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

      {/* Features Grid */}
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

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2 className="section-title animate-on-scroll">What Users Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="testimonial-card animate-on-scroll"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <Quote className="testimonial-icon" />
              <p className="testimonial-content">{testimonial.content}</p>
              <div className="testimonial-author">
                <div>
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="star-icon" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content animate-on-scroll">
          <h2 className="cta-title gradient-text">Ready to Start Parking Smarter?</h2>
          <p className="cta-description">
            Join thousands of drivers who have already simplified their parking experience.
          </p>
          <button className="btn btn-primary magnetic-button hover-lift">
            Sign Up Now <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Integrations Section */}
      <IntegrationsSection />
    </div>
   
  );
}