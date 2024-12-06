import React, { useState } from 'react';
import { Plus, Minus, MessageCircle } from 'lucide-react';
import './FAQSection.css';

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "How does ParkPal's parking system work?",
      answer: "ParkPal uses real-time tracking and smart algorithms to identify available parking spots. Users can easily find and reserve spots through our mobile app or website."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, Apple Pay, and Google Pay. All payments are processed securely through our encrypted payment system."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Yes! Our mobile app is available for both iOS and Android devices. You can download it from the App Store or Google Play Store."
    },
    {
      question: "How do I cancel a parking reservation?",
      answer: "You can cancel your reservation up to 30 minutes before the scheduled time through the app or website. Full refunds are provided for cancellations made within this timeframe."
    },
    {
      question: "Are there any subscription plans?",
      answer: "Yes, we offer various subscription plans including monthly and annual options. Each plan comes with exclusive benefits and discounted rates."
    }
  ];

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="section-header">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-subtitle">Everything you need to know about ParkPal</p>
      </div>

      <div className="faq-grid">
        {faqData.map((faq, index) => (
          <div 
            key={index} 
            className={`faq-card ${openIndex === index ? 'active' : ''}`}
            style={{ 
              animationDelay: `${index * 0.1}s` 
            }}
          >
            <button 
              className="faq-question"
              onClick={() => toggleQuestion(index)}
              aria-expanded={openIndex === index}
            >
              <span className="question-text">{faq.question}</span>
              <span className="question-icon">
                {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
              </span>
            </button>
            <div className={`faq-answer ${openIndex === index ? 'show' : ''}`}>
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="faq-cta">
        <p>Still have questions? We're here to help!</p>
        <a href="/contact" className="cta-button">
          <MessageCircle size={20} />
          <span>Contact Support</span>
        </a>
      </div>
    </section>
  );
};

export default FAQSection;