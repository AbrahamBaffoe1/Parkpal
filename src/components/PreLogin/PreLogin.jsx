import React, { useState, useEffect } from 'react';
import { ChevronRight, Menu, X, Sun, Moon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import './PreLogin.css';

export function PreLoginPage() {
  return (
    <div className="prelogin-container">
      <div className="prelogin-content">
        <div className="prelogin-header">
          <h1>Welcome to ParkPal</h1>
          <p>Your smart parking companion for hassle-free parking management</p>
        </div>
        
        <div className="prelogin-cta">
          <a href="/auth/signin" className="prelogin-button signin">
            <span>Sign In</span>
            <ArrowRight size={20} />
          </a>
          
          <a href="/auth/register" className="prelogin-button register">
            <span>Register</span>
            <ArrowRight size={20} />
          </a>
          
          <p className="prelogin-subtext">
            By continuing, you agree to ParkPal's Terms of Service and Privacy Policy
          </p>
        </div>

        <div className="prelogin-features">
          <div className="feature-item">
            <div className="feature-icon">🚗</div>
            <p>Smart Parking Solutions</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⚡</div>
            <p>Real-time Availability</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🛡️</div>
            <p>Secure Payments</p>
          </div>
        </div>
      </div>

      <div className="prelogin-background">
        <div className="gradient-overlay"></div>
        <div className="pattern-overlay"></div>
      </div>
    </div>
  );
}