import React, { useEffect, useRef } from 'react';
import { MapPin, Car, Shield, Star, Clock, CreditCard } from 'lucide-react';
import './FeaturesGrid.css';



export function FeaturesGrid() {
// Add this to your useEffect
useEffect(() => {
  const cards = document.querySelectorAll('.parkpal-feature-card');
  
  const handleMouseMove = (e) => {
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  };

  document.addEventListener('mousemove', handleMouseMove);
  
  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
  };
}, []);


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

  const observerRef = useRef(null);
  const featuresSectionRef = useRef(null);
  
  useEffect(() => {
    // Intersection Observer for fade-in animations
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

    document.querySelectorAll('.parkpal-animate').forEach((element) => {
      observerRef.current.observe(element);
    });

    // Particle animation setup
    const createParticle = () => {
      if (!featuresSectionRef.current) return;
      
      const particle = document.createElement('div');
      particle.className = 'cyber-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
      particle.style.opacity = Math.random() * 0.5 + 0.2;
      
      featuresSectionRef.current.appendChild(particle);
      
      setTimeout(() => {
        if (particle.parentNode === featuresSectionRef.current) {
          featuresSectionRef.current.removeChild(particle);
        }
      }, 5000);
    };

    // Create particles periodically
    const particleInterval = setInterval(createParticle, 1000);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      clearInterval(particleInterval);
    };
  }, []);

  return (
    <section className="parkpal-features" ref={featuresSectionRef}>
      {/* Cyber grid and effects */}
      <div className="cyber-particles">
        <div className="cyber-particle-container"></div>
      </div>
      <div className="neon-lines">
        <div className="neon-line"></div>
        <div className="neon-line"></div>
        <div className="neon-line"></div>
      </div>

      <div className="parkpal-container">
        <div className="parkpal-features-header">
          <h2 className="parkpal-features-title parkpal-animate">
            Enterprise Solutions for Modern Parking
          </h2>
          <p className="parkpal-features-description parkpal-animate">
            ParkPal leverages cutting-edge technology to revolutionize the parking experience. 
            Our enterprise-grade platform delivers unmatched reliability, security, and convenience 
            to businesses and individuals alike.
          </p>
        </div>
        <div className="parkpal-features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="parkpal-feature-card parkpal-animate"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                transitionDelay: `${index * 0.1}s`
              }}
            >
              <div className="parkpal-feature-icon-wrapper">
                <div className="parkpal-feature-icon">
                  {feature.icon}
                </div>
                {/* Additional holographic effect */}
                <div className="icon-hologram"></div>
              </div>
              <div className="parkpal-feature-content">
                <h3 className="parkpal-feature-title">{feature.title}</h3>
                <p className="parkpal-feature-description">{feature.description}</p>
              </div>
              {/* Card border glow effect */}
              <div className="card-glow"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}