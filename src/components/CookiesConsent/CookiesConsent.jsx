// src/components/CookiesConsent/CookiesConsent.jsx
import { useState, useEffect } from 'react';
import { X, Cookie, ChevronDown, ChevronUp, Shield, Lock } from 'lucide-react';
import './CookiesConsent.css';

export function CookiesConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true and disabled
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    // Check if user has already set cookie preferences
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      // Show after a slight delay for better UX
      setTimeout(() => setIsVisible(true), 1500);
    }
  }, []);

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
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookies-consent">
      <div className="cookies-content">
        <div className="cookies-header">
          <div className="cookies-title">
            <Cookie className="cookie-icon" />
            <h3>Cookie Preferences</h3>
          </div>
          <button 
            className="close-button"
            onClick={() => setIsVisible(false)}
            aria-label="Close cookie preferences"
          >
            <X />
          </button>
        </div>

        <div className="cookies-body">
          <p className="cookies-description">
            We use cookies to enhance your browsing experience, serve personalized content, 
            and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
          </p>

          <button 
            className="details-toggle"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? <ChevronUp /> : <ChevronDown />}
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>

          {showDetails && (
            <div className="cookies-preferences">
              <div className="preference-item">
                <div className="preference-header">
                  <div className="preference-title">
                    <Shield className="preference-icon" />
                    <span>Necessary</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={preferences.necessary}
                    disabled
                    className="toggle"
                  />
                </div>
                <p>Essential cookies for site functionality</p>
              </div>

              <div className="preference-item">
                <div className="preference-header">
                  <div className="preference-title">
                    <Lock className="preference-icon" />
                    <span>Analytics</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      analytics: e.target.checked
                    })}
                    className="toggle"
                  />
                </div>
                <p>Help us understand how you use our site</p>
              </div>

            </div>
          )}
        </div>

        <div className="cookies-actions">
          <button 
            className="save-preferences"
            onClick={handleSavePreferences}
          >
            Save Preferences
          </button>
          <button 
            className="accept-all"
            onClick={handleAcceptAll}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}