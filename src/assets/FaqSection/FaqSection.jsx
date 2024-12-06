// src/components/sections/FaqSection.jsx
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './FaqSection.css';
import '../../components/sections/sections.css';

export function FaqSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How does ParkPal work?",
      answer: "ParkPal uses real-time data to help you find and reserve parking spots. Simply enter your destination, choose from available spots, and book with one tap. Our system guides you directly to your reserved spot."
    },
    {
      question: "Is my payment information secure?",
      answer: "Yes, absolutely! We use industry-standard encryption and secure payment processors to handle all transactions. Your payment details are never stored on our servers directly."
    },
    {
      question: "Can I cancel my reservation?",
      answer: "Yes, you can cancel your parking reservation up to 30 minutes before the scheduled time for a full refund. Cancellations can be made easily through the app or website."
    },
    {
      question: "What happens if someone is in my spot?",
      answer: "If you find someone in your reserved spot, simply contact our 24/7 support through the app. We'll help resolve the situation immediately and find you an alternative spot if needed."
    },
    {
      question: "Are there any subscription plans?",
      answer: "Yes, we offer various subscription plans for regular users, including monthly and annual options. These plans come with additional benefits like priority booking and discounted rates."
    },
    {
      question: "How do I extend my parking time?",
      answer: "You can easily extend your parking time through the app. Simply open your active reservation and select 'Extend Time'. Extensions are subject to spot availability."
    }
  ];

  return (
    <section className="faq-section">
      <div className="container">
        <h2 className="section-title animate-on-scroll">
          Frequently Asked Questions
        </h2>
        <p className="section-description animate-on-scroll">
          Everything you need to know about ParkPal
        </p>

        <div className="faq-grid">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`faq-card animate-on-scroll ${activeIndex === index ? 'active' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <button 
                className="faq-question"
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              >
                {faq.question}
                {activeIndex === index ? 
                  <ChevronUp className="faq-icon" /> : 
                  <ChevronDown className="faq-icon" />
                }
              </button>
              <div className={`faq-answer ${activeIndex === index ? 'show' : ''}`}>
                {faq.answer}
              </div>
            </div>
          ))}
        </div>

        <div className="faq-cta animate-on-scroll">
          <p>Still have questions?</p>
          <button className="btn-secondary magnetic-button">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}