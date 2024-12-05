import React from 'react';
import { ChevronRight } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="nav">
      <div className="nav-container">
        <a href="/" className="nav-logo magnetic-button">ParkPal</a>
        <div className="nav-links">
          <a href="/about" className="nav-link hover-lift">About</a>
          <a href="/features" className="nav-link hover-lift">Features</a>
          <a href="/pricing" className="nav-link hover-lift">Pricing</a>
          <a href="/login" className="nav-button magnetic-button">
            Get Started <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </nav>
  );
}