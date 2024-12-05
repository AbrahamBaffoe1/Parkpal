// src/components/sections/PricingSection.jsx
import { useState } from 'react';
import { Check, X, Sparkles, ArrowRight, Shield, Zap } from 'lucide-react';
import './PricingSection.css';

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [hoveredPlan, setHoveredPlan] = useState(null);
  
  const plans = [
    {
      name: "Basic",
      description: "Perfect for trying out ParkPal",
      price: {
        monthly: "₦0",
        yearly: "₦0"
      },
      features: [
        { text: "5 parking searches/day", included: true },
        { text: "Basic spot information", included: true },
        { text: "Community reviews", included: true },
        { text: "Email support", included: true },
        { text: "Real-time availability", included: false },
        { text: "Spot reservation", included: false }
      ],
      ctaText: "Get Started",
      popular: false,
      icon: <Shield className="w-6 h-6" />
    },
    {
      name: "Pro",
      description: "Best for regular drivers",
      price: {
        monthly: "₦2,999",
        yearly: "₦29,990"
      },
      features: [
        { text: "Unlimited searches", included: true },
        { text: "Real-time availability", included: true },
        { text: "Spot reservation", included: true },
        { text: "Premium support", included: true },
        { text: "Mobile app access", included: true },
        { text: "Payment history", included: true }
      ],
      ctaText: "Start Pro Trial",
      popular: true,
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      name: "Enterprise",
      description: "For businesses & teams",
      price: {
        monthly: "₦7,999",
        yearly: "₦79,990"
      },
      features: [
        { text: "Everything in Pro", included: true },
        { text: "Fleet management", included: true },
        { text: "Team accounts", included: true },
        { text: "API access", included: true },
        { text: "Custom integrations", included: true },
        { text: "24/7 phone support", included: true }
      ],
      ctaText: "Contact Sales",
      popular: false,
      icon: <Zap className="w-6 h-6" />
    }
  ];

  const getYearlySavings = (plan) => {
    if (plan.price.yearly === "₦0") return null;
    const monthly = parseInt(plan.price.monthly.replace(/[^\d]/g, ''));
    const yearly = parseInt(plan.price.yearly.replace(/[^\d]/g, ''));
    const savings = (monthly * 12 - yearly) / 12;
    return `Save ₦${savings.toLocaleString()}/mo`;
  };

  return (
    <section className="pricing-section" id="pricing">
      <div className="pricing-container">
        <div className="pricing-header">
          <h2 className="pricing-title">Simple, Transparent Pricing</h2>
          <p className="pricing-description">
            Choose the perfect plan for your parking needs
          </p>

          {/* Billing Toggle */}
          <div className="billing-toggle">
            <button
              className={`billing-option ${billingCycle === 'monthly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`billing-option ${billingCycle === 'yearly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly
              <span className="yearly-badge">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="pricing-grid">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`pricing-card ${plan.popular ? 'popular' : ''}`}
              onMouseEnter={() => setHoveredPlan(plan.name)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {plan.popular && (
                <div className="popular-badge">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Most Popular
                </div>
              )}
              
              <div className="plan-header">
                <div className="plan-icon">{plan.icon}</div>
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
              </div>

              <div className="plan-price">
                <span className="currency">₦</span>
                <span className="amount">
                  {plan.price[billingCycle].replace('₦', '')}
                </span>
                <span className="period">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              
              {billingCycle === 'yearly' && getYearlySavings(plan) && (
                <div className="yearly-savings">
                  {getYearlySavings(plan)}
                </div>
              )}

              <div className="feature-list">
                {plan.features.map((feature, index) => (
                  <div 
                    key={index} 
                    className={`feature-item ${!feature.included ? 'disabled' : ''}`}
                  >
                    {feature.included ? (
                      <Check className="feature-icon included" />
                    ) : (
                      <X className="feature-icon not-included" />
                    )}
                    {feature.text}
                  </div>
                ))}
              </div>

              <button 
                className={`cta-button ${plan.popular ? 'popular' : ''} ${
                  hoveredPlan === plan.name ? 'hovered' : ''
                }`}
              >
                {plan.ctaText}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          ))}
        </div>

        <div className="pricing-footer">
          <p className="guarantee">
            <Shield className="w-5 h-5 mr-2" />
            30-day money-back guarantee
          </p>
          <p className="support-text">
            Questions? <a href="#contact">Contact our team</a>
          </p>
        </div>
      </div>
    </section>
  );
}