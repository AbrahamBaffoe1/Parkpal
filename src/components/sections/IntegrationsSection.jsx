// src/components/sections/IntegrationsSection.jsx
import { Globe, CreditCard, MessageSquare, Bell, Zap, Lock } from 'lucide-react';
import './sections.css';

export function IntegrationsSection() {
  const integrations = [
    {
      icon: <CreditCard className="integration-icon" />,
      name: "Payment Processing",
      description: "Secure payment handling with major providers",
      partners: ["Stripe", "Paystack", "Flutterwave"]
    },
    {
      icon: <Globe className="integration-icon" />,
      name: "Maps Integration",
      description: "Real-time location and navigation services",
      partners: ["Google Maps", "Mapbox", "OpenStreetMap"]
    },
    {
      icon: <MessageSquare className="integration-icon" />,
      name: "Communication",
      description: "Instant notifications and updates",
      partners: ["SMS", "Email", "Push Notifications"]
    },
    {
      icon: <Lock className="integration-icon" />,
      name: "Authentication",
      description: "Secure user authentication and authorization",
      partners: ["Auth0", "OAuth", "JWT"]
    },
    {
      icon: <Bell className="integration-icon" />,
      name: "Notifications",
      description: "Real-time alerts and reminders",
      partners: ["Firebase", "OneSignal", "Twilio"]
    },
    {
      icon: <Zap className="integration-icon" />,
      name: "Analytics",
      description: "Detailed insights and reporting",
      partners: ["Google Analytics", "Mixpanel", "Amplitude"]
    }
  ];

  return (
    <section className="integrations-section">
      <div className="container">
        <h2 className="section-title animate-on-scroll">
          Powerful Integrations
        </h2>
        <p className="section-description animate-on-scroll">
          Seamlessly connect with your favorite tools and services
        </p>

        <div className="integrations-grid">
          {integrations.map((integration, index) => (
            <div 
              key={index} 
              className="integration-card animate-on-scroll"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="integration-icon-wrapper">
                {integration.icon}
              </div>
              <h3 className="integration-title">{integration.name}</h3>
              <p className="integration-description">{integration.description}</p>
              <div className="integration-partners">
                {integration.partners.map((partner, idx) => (
                  <span key={idx} className="partner-tag">
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}