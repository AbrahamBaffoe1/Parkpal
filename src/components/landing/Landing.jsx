// src/components/landing/Landing.jsx
import { useEffect, useRef } from 'react';
import { ArrowRight, MapPin, Car, Shield, Star, ChevronRight, Quote } from 'lucide-react';
import { CustomCursor } from '../cursor/CustomCursor';
import { PricingSection } from '../sections/PricingSection';
import { IntegrationsSection } from '../sections/IntegrationsSection';
import { TestimonialsSection } from '../sections/Testimonials';
import { FaqSection } from '../sections/FaqSection';
import { FeaturesGrid } from '../sections/FeaturesGrid';
import { Banner } from '../Banner/Banner';
import { Navigation } from '../Navigation/Navigation';
import { Cta } from '../sections/Cta';
// footer
import { Footer } from '../Footer/Footer';

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

  


  return (
    <div className="landing-page" ref={parallaxRef}>
      <CustomCursor />
      
      {/* Banner */}
      <Banner />


      {/* Navigation */}
      <Navigation />


      {/* <nav className="nav">
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
      </nav> */}

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
      <FeaturesGrid />

      {/* CTA Section */}
      <Cta />

      {/* Pricing Section */}
      <PricingSection />

      {/* Integrations Section */}
      <IntegrationsSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FaqSection />

      {/* Footer */}
      <Footer />
    </div>
   
  );
}