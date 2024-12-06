import React, { useEffect, useRef } from 'react';
import { 
  MapPin, CreditCard, MessageSquare, Bell, Shield, 
  Calendar, LineChart, Settings, Database, Cloud
} from 'lucide-react';
import './IntegrationsSection.css';

export function IntegrationsSection() {
  const integrations = [
    {
      icon: <MapPin size={28} />,
      name: "Location Intelligence",
      description: "Enterprise-grade location services powered by Google Maps Platform",
      category: "Core Infrastructure"
    },
    {
      icon: <CreditCard size={28} />,
      name: "Payment Solutions",
      description: "Secure global payments with Stripe Connect and custom processing",
      category: "Financial Services"
    },
    {
      icon: <MessageSquare size={28} />,
      name: "Communication Hub",
      description: "Real-time notifications via Slack, Teams, and custom webhooks",
      category: "Enterprise Tools"
    },
    {
      icon: <Shield size={28} />,
      name: "Security Suite",
      description: "Advanced encryption and authentication with OAuth 2.0",
      category: "Security"
    },
    {
      icon: <Calendar size={28} />,
      name: "Scheduling Engine",
      description: "Smart booking system with calendar integrations",
      category: "Core Features"
    },
    {
      icon: <LineChart size={28} />,
      name: "Analytics Platform",
      description: "Real-time data insights and custom reporting tools",
      category: "Business Intelligence"
    },
    {
      icon: <Database size={28} />,
      name: "Data Infrastructure",
      description: "Enterprise database solutions with automated backups",
      category: "Cloud Services"
    },
    {
      icon: <Cloud size={28} />,
      name: "Cloud Solutions",
      description: "Scalable cloud infrastructure with AWS and Azure",
      category: "Infrastructure"
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
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((element) => {
      observerRef.current.observe(element);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <section className="integrations-section">
      <div className="integration-background">
        <div className="gradient-sphere sphere-1"></div>
        <div className="gradient-sphere sphere-2"></div>
        <div className="gradient-sphere sphere-3"></div>
        <div className="grid-overlay"></div>
      </div>

      <div className="container">
        <div className="section-header">
          <h2 className="section-title animate-on-scroll">
            Enterprise-Grade
            <span className="gradient-text">Integrations</span>
          </h2>
          <p className="section-description animate-on-scroll">
            Seamlessly connect with industry-leading platforms and tools. Our enterprise
            solutions offer unparalleled flexibility and security for your business needs.
          </p>
        </div>

        <div className="integration-categories">
          {['Core Infrastructure', 'Security', 'Enterprise Tools', 'Cloud Services'].map((category) => (
            <button key={category} className="category-tag">
              {category}
            </button>
          ))}
        </div>

        <div className="integrations-grid">
          {integrations.map((integration, index) => (
            <div 
              key={integration.name} 
              className="integration-card animate-on-scroll"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="integration-content">
                <div className="integration-icon-wrapper">
                  {integration.icon}
                  <div className="icon-glow"></div>
                </div>
                <div className="integration-details">
                  <span className="integration-category">{integration.category}</span>
                  <h3>{integration.name}</h3>
                  <p>{integration.description}</p>
                </div>
              </div>
              <div className="integration-footer">
                <button className="learn-more-btn">
                  Learn More
                  <Settings size={16} className="settings-icon" />
                </button>
              </div>
              <div className="card-glow"></div>
            </div>
          ))}
        </div>

        <div className="enterprise-cta">
          <h3>Ready to Scale Your Enterprise?</h3>
          <p>Connect with our solutions team for custom integration support</p>
          <button className="enterprise-btn">
            Schedule Consultation
            <div className="btn-glow"></div>
          </button>
        </div>
      </div>
    </section>
  );
}