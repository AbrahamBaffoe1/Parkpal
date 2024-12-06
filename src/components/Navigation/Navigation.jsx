import React, { useState, useEffect } from 'react';
import { ChevronRight, Menu, X, Sun, Moon } from 'lucide-react';
import './Navigation.css';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  // Navigation links data
  const navLinks = [
    { href: "/about", text: "About" },
    { href: "/features", text: "Features" },
    { href: "/pricing", text: "Pricing" },
    { href: "/contact", text: "Contact" }
  ];

  return (
    <nav className={`nav ${isScrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-container">
        <a href="/" className="nav-logo">
          <span className="logo-text">ParkPal</span>
        </a>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <div className={`nav-links ${isMobileMenuOpen ? 'nav-links-mobile-open' : ''}`}>
          <div className="nav-links-group">
            {navLinks.map((link, index) => (
              <a 
                key={index}
                href={link.href}
                className="nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.text}
              </a>
            ))}
          </div>
          
          {/* Theme Toggle */}
          <button
            className="theme-toggle"
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            aria-label="Toggle theme"
          >
            {isDarkTheme ? 
              <Sun className="theme-icon" size={20} /> : 
              <Moon className="theme-icon" size={20} />
            }
          </button>
          
          <a 
            href="/login" 
            className="nav-button"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="button">Get Started</span>
            <ChevronRight className="button-icon" />
          </a>
        </div>
      </div>
    </nav>
  );
}