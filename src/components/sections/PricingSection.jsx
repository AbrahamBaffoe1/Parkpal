import { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Star, 
  Zap, 
  Shield, 
  Building2, 
  Clock, 
  Car,
  Users,
  Settings,
  ArrowRight,
  Search,
  MessageSquare,
  Phone,
  Database,
  Key
} from 'lucide-react';
import './PricingSection.css';

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [hoveredPlan, setHoveredPlan] = useState(null);

  const plans = [
    {
      name: "Basic",
      description: "Perfect for trying out ParkPal",
      highlight: "Essential Features",
      price: {
        monthly: "$0",
        yearly: "$0"
      },
      features: [
        { text: "5 parking searches/day", included: true, icon: Search },
        { text: "Basic spot information", included: true, icon: Car },
        { text: "Community reviews", included: true, icon: MessageSquare },
        { text: "Email support", included: true, icon: Phone },
        { text: "Mobile app access", included: false, icon: Key }
      ],
      ctaText: "Get Started Free",
      popular: false,
      theme: "basic"
    },
    {
      name: "Pro",
      description: "Best for regular drivers",
      highlight: "Most Popular",
      price: {
        monthly: "$29.99",
        yearly: "$299.90"
      },
      features: [
        { text: "Unlimited searches", included: true, icon: Search },
        { text: "Real-time availability", included: true, icon: Clock },
        { text: "Priority booking", included: true, icon: Star },
        { text: "Premium support", included: true, icon: Phone },
        { text: "Multiple vehicles", included: true, icon: Car }
      ],
      ctaText: "Start Pro Trial",
      popular: true,
      theme: "premium"
    },
    {
      name: "Enterprise",
      description: "For businesses & teams",
      highlight: "Full Features",
      price: {
        monthly: "$79.99",
        yearly: "$799.90"
      },
      features: [
        { text: "Everything in Pro", included: true, icon: CheckCircle2 },
        { text: "Fleet management", included: true, icon: Car },
        { text: "Team accounts", included: true, icon: Users },
        { text: "API access", included: true, icon: Database },
        { text: "Custom integration", included: true, icon: Settings }
      ],
      ctaText: "Contact Sales",
      popular: false,
      theme: "enterprise"
    }
  ];

  const getYearlySavings = (plan) => {
    if (plan.price.yearly === "$0") return null;
    const monthly = parseFloat(plan.price.monthly.replace('$', ''));
    const yearly = parseFloat(plan.price.yearly.replace('$', ''));
    const savings = Math.round((monthly * 12 - yearly) / 12);
    return `Save $${savings}/mo`;
  };

  return (
    <section className="pricing-section">
      <div className="pricing-container">
        <div className="pricing-header">
          <h2 className="pricing-title">Choose Your Perfect Plan</h2>
          <p className="pricing-description">
            Simple, transparent pricing that grows with you. No hidden fees.
          </p>

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
              Annual
              <span className="yearly-badge">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="pricing-grid">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`pricing-card ${plan.popular ? 'popular' : ''} ${plan.theme}`}
              onMouseEnter={() => setHoveredPlan(plan.name)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {plan.popular && (
                <div className="popular-badge">
                  <Star size={16} /> Most Popular
                </div>
              )}

              <div className="plan-header">
                <div className={`plan-highlight ${plan.theme}`}>
                  {plan.highlight}
                </div>
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>

                <div className="plan-price">
                  <span className="currency">$</span>
                  <span className="amount">
                    {plan.price[billingCycle].replace('$', '')}
                  </span>
                  <span className="period">
                    /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </div>

                {billingCycle === 'yearly' && getYearlySavings(plan) && (
                  <div className="yearly-savings">
                    {getYearlySavings(plan)}
                  </div>
                )}
              </div>

              <div className="feature-list">
                {plan.features.map((feature, index) => (
                  <div 
                    key={index} 
                    className={`feature-item ${!feature.included ? 'disabled' : ''}`}
                  >
                    <feature.icon size={20} className="feature-icon" />
                    <span className="feature-text">{feature.text}</span>
                    {feature.included ? (
                      <CheckCircle2 size={18} className="status-icon included" />
                    ) : (
                      <XCircle size={18} className="status-icon not-included" />
                    )}
                  </div>
                ))}
              </div>

              <button className={`cta-button ${plan.theme}`}>
                {plan.ctaText}
                <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="pricing-footer">
          <div className="guarantee">
            <Shield size={20} />
            30-day money-back guarantee
          </div>
          <p className="support-text">
            Questions? <a href="#contact">Contact our team</a>
          </p>
        </div>
      </div>
    </section>
  );
}