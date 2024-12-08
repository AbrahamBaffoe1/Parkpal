import React, { useState, useEffect } from 'react';
import { X, Cookie, ChevronDown, ChevronUp, Shield, Lock } from 'lucide-react';
import './ConsentBanner.css';

const ConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      setTimeout(() => setIsVisible(true), 1500);
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 600);
  };

  const handleAcceptAll = () => {
    setPreferences({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    });
    saveCookiePreferences(true);
  };

  const handleSavePreferences = () => {
    saveCookiePreferences(false);
  };

  const saveCookiePreferences = (acceptAll) => {
    localStorage.setItem('cookieConsent', 'true');
    localStorage.setItem('cookiePreferences', JSON.stringify(
      acceptAll ? {
        necessary: true,
        analytics: true,
        marketing: true,
        preferences: true
      } : preferences
    ));
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div className={`consent-banner ${isClosing ? 'closing' : ''}`}>
      <div className="consent-container">
        <div className="consent-content">
          <header className="consent-header">
            <div className="consent-title">
              <Cookie size={28} className="consent-icon" />
              <h3>Cookie Preferences</h3>
            </div>
            <button 
              className="close-button"
              onClick={handleClose}
              aria-label="Close cookie preferences"
            >
              <X size={20} />
            </button>
          </header>

          <div className="consent-body">
            <p className="consent-description">
              We value your privacy. We use cookies to enhance your browsing experience, 
              serve personalized content, and analyze our traffic. Your choice matters.
            </p>

            <button 
              className="details-toggle"
              onClick={() => setShowDetails(!showDetails)}
              aria-expanded={showDetails}
            >
              {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>

            {showDetails && (
              <div className="consent-preferences">
                <div className="preference-item">
                  <div className="preference-header">
                    <div className="preference-title">
                      <Shield size={20} />
                      <span>Essential Cookies</span>
                    </div>
                    <div className="toggle-wrapper">
                      <input 
                        type="checkbox" 
                        checked={preferences.necessary}
                        disabled
                        className="toggle"
                        aria-label="Toggle essential cookies"
                      />
                    </div>
                  </div>
                  <p>Required for core site functionality. These cookies cannot be disabled.</p>
                </div>

                <div className="preference-item">
                  <div className="preference-header">
                    <div className="preference-title">
                      <Lock size={20} />
                      <span>Analytics</span>
                    </div>
                    <div className="toggle-wrapper">
                      <input 
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          analytics: e.target.checked
                        })}
                        className="toggle"
                        aria-label="Toggle analytics cookies"
                      />
                    </div>
                  </div>
                  <p>Help us understand how you use our site to improve your experience.</p>
                </div>
              </div>
            )}
          </div>

          <div className="consent-actions">
            <button 
              className="save-preferences"
              onClick={handleSavePreferences}
              aria-label="Save cookie preferences"
            >
              Save Preferences
            </button>
            <button 
              className="accept-all"
              onClick={handleAcceptAll}
              aria-label="Accept all cookies"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ConsentBanner };