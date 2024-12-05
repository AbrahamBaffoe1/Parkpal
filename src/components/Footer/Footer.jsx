// src/components/Footer/Footer.jsx
import { useState } from 'react';
import { 
  Github, Twitter, Instagram, Linkedin, 
  ArrowRight, Globe, MessageCircle, Mail, 
  CheckCircle, Heart
} from 'lucide-react';
import './Footer.css';

export function Footer() {
  const [emailInput, setEmailInput] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState(null);
  const [animatedIcon, setAnimatedIcon] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribeStatus('subscribed');
    setTimeout(() => setSubscribeStatus(null), 3000);
  };

  const handleIconHover = (iconName) => {
    setAnimatedIcon(iconName);
  };

  const navigationLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "/features", icon: <CheckCircle size={16} /> },
        { name: "Pricing", href: "/pricing", icon: <Heart size={16} /> },
        { name: "API", href: "/api", icon: <Globe size={16} /> },
        { name: "Documentation", href: "/docs", icon: <MessageCircle size={16} /> }
      ]
    },
  ];

  return (
    <footer className="footer-container">
      {/* Animated Background */}
      <div className="footer-background">
        <div className="glow-1"></div>
        <div className="glow-2"></div>
      </div>

      <div className="footer-content">
        {/* Newsletter Section */}
        <div className="newsletter-section">
          <h3 className="newsletter-title">Stay Updated</h3>
          <p className="newsletter-description">
            Get notified about the latest parking spots and features
          </p>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <div className="input-group">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                placeholder="Enter your email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="newsletter-input"
              />
              <button type="submit" className="subscribe-button">
                Subscribe
                <ArrowRight size={16} />
              </button>
            </div>
            {subscribeStatus === 'subscribed' && (
              <div className="success-message">
                <CheckCircle size={16} />
                Thanks for subscribing!
              </div>
            )}
          </form>
        </div>

        {/* Enhanced Brand Section */}
        <div className="footer-brand">
          <h2 className="brand-title">
            <span className="gradient-text">Park</span>
            <span className="gradient-text-alt">Pal</span>
          </h2>
          <p className="brand-description">
            Making parking smarter, one spot at a time. Find and reserve parking spots in real-time.
          </p>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100+</span>
              <span className="stat-label">Cities</span>
            </div>
          </div>
        </div>

        {/* Navigation with Enhanced Hover */}
        <nav className="footer-navigation">
          {navigationLinks.map((category, index) => (
            <div 
              key={index} 
              className="nav-category"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="category-title">{category.title}</h3>
              <ul className="category-links">
                {category.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href} 
                      className="footer-link"
                      onMouseEnter={() => handleIconHover(`${category.title}-${linkIndex}`)}
                      onMouseLeave={() => handleIconHover(null)}
                    >
                      <span className="link-icon">{link.icon}</span>
                      {link.name}
                      <ArrowRight 
                        className={`link-arrow ${
                          animatedIcon === `${category.title}-${linkIndex}` ? 'active' : ''
                        }`}
                        size={14}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Social Section with Enhanced Interactions */}
        <div className="social-section">
          <div className="social-links">
            {[Github, Twitter, Instagram, Linkedin].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="social-link"
                onMouseEnter={() => handleIconHover(`social-${index}`)}
                onMouseLeave={() => handleIconHover(null)}
              >
                <Icon 
                  size={20} 
                  className={animatedIcon === `social-${index}` ? 'bounce' : ''}
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">
            © {new Date().getFullYear()} ParkPal. All rights reserved.
          </p>
          <div className="bottom-links">
            <a href="/privacy" className="bottom-link">Privacy</a>
            <span className="separator">·</span>
            <a href="/terms" className="bottom-link">Terms</a>
            <span className="separator">·</span>
            <a href="/cookies" className="bottom-link">Cookies</a>
          </div>
          <div className="locale-selector">
            <Globe size={16} />
            <select className="locale-select">
              <option value="en">English (US)</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}