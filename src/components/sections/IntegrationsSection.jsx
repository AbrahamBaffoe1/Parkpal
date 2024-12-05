// src/components/sections/IntegrationsSection.jsx
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
      // Add more integrations
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
  
  // src/components/sections/FaqSection.jsx
  export function FaqSection() {
    const faqs = [
      {
        question: "How does ParkPal work?",
        answer: "ParkPal uses real-time data to help you find and reserve parking spots. Simply enter your destination, choose from available spots, and book with one tap."
      },
      {
        question: "Is my payment information secure?",
        answer: "Yes, all payment information is encrypted and processed securely through Stripe, our PCI-compliant payment processor."
      },
      // Add more FAQs
    ];
  
    return (
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title animate-on-scroll">
            Frequently Asked Questions
          </h2>
  
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-card animate-on-scroll">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }