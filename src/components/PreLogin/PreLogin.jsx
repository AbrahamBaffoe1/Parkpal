// src/components/PreLogin/PreLogin.jsx
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './PreLogin.css';

function PreLoginPage() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/auth/login');
  };

  const handleRegister = () => {
    navigate('/auth/register');
  };

  return (
    <div className="prelogin-container">
      <div className="prelogin-content">
        <div className="prelogin-header">
          <h1>Welcome to ParkPal</h1>
          <p>Your smart parking companion for hassle-free parking management</p>
        </div>
        
        <div className="prelogin-cta">
          <button className="prelogin-button signin" onClick={handleSignIn}>
            <span>Log In</span>
            <ArrowRight size={20} />
          </button>
          
          <button className="prelogin-button register" onClick={handleRegister}>
            <span>Register</span>
            <ArrowRight size={20} />
          </button>
          
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

export { PreLoginPage };