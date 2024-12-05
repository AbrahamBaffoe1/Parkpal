// src/components/sections/PricingSection.jsx
import { Check } from 'lucide-react'; 
import './sections.css';

export function PricingSection() {
    const plans = [
      {
        name: "Free",
        price: "₦0",
        period: "/month",
        description: "Perfect for trying out ParkPal",
        features: [
          "5 parking searches per day",
          "Basic spot information",
          "Community reviews",
          "Email support"
        ],
        cta: "Get Started",
        popular: false
      },
      {
        name: "Pro",
        price: "₦2,999",
        period: "/month",
        description: "Best for regular drivers",
        features: [
          "Unlimited parking searches",
          "Real-time availability",
          "Spot reservation",
          "Premium support",
          "Mobile app access",
          "Payment history"
        ],
        cta: "Start Pro Trial",
        popular: true
      },
      {
        name: "Business",
        price: "₦7,999",
        period: "/month",
        description: "For businesses & teams",
        features: [
          "Everything in Pro",
          "Fleet management",
          "Team accounts",
          "API access",
          "Custom integrations",
          "24/7 phone support"
        ],
        cta: "Contact Sales",
        popular: false
      }
    ];
  
    return (
      <section className="pricing-section" id="pricing">
        <div className="container">
          <h2 className="section-title animate-on-scroll">Simple, Transparent Pricing</h2>
          <p className="section-description animate-on-scroll">
            Choose the perfect plan for your parking needs
          </p>
          
          <div className="pricing-grid">
            {plans.map((plan) => (
              <div 
                key={plan.name} 
                className={`pricing-card ${plan.popular ? 'popular' : ''} animate-on-scroll`}
              >
                {plan.popular && <div className="popular-tag">Most Popular</div>}
                <div className="plan-header">
                  <h3>{plan.name}</h3>
                  <div className="plan-price">
                    <span className="amount">{plan.price}</span>
                    <span className="period">{plan.period}</span>
                  </div>
                  <p className="plan-description">{plan.description}</p>
                </div>
  
                <ul className="plan-features">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="feature-item">
                        <Check className="feature-icon" size={18} />
                      {feature}
                    </li>
                  ))}
                </ul>
  
                <button className={`plan-cta ${plan.popular ? 'cta-popular' : ''}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
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