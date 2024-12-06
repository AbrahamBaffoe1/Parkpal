import React from 'react';
import './IntegrationsSection.css';





  export function IntegrationsSection() {
    const integrations = [
      {
        icon: "google-maps.svg",
        name: "Google Maps",
        description: "Seamless navigation and location services"
      },
      {
        icon: "stripe.svg",
        name: "Stripe",
        description: "Secure payment processing"
      },
      {
        icon: "slack.svg",
        name: "Slack",
        description: "Team notifications and updates"
      },
    
    ];
  
    return (
      <section className="integrations-section">
        <div className="container">
          <h2 className="section-title animate-on-scroll">
            Integrate with Your Favorite Tools
          </h2>
          <p className="section-description animate-on-scroll">
            ParkPal works seamlessly with the tools you already use
          </p>
  
          <div className="integrations-grid">
            {integrations.map((integration) => (
              <div key={integration.name} className="integration-card animate-on-scroll">
                <img 
                  src={`/icons/${integration.icon}`} 
                  alt={integration.name} 
                  className="integration-icon"
                />
                <h3>{integration.name}</h3>
                <p>{integration.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
