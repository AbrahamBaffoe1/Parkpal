// src/components/Error404/Error404.jsx
import { useNavigate } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import './Error404.css';

export function Error404() {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      {/* Animated background */}
      <div className="error-background">
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              '--delay': `${Math.random() * 5}s`,
              '--position': `${Math.random() * 100}%`
            }}></div>
          ))}
        </div>
      </div>

      <div className="error-content">
        <div className="error-header">
          <h1 className="error-title">404</h1>
          <div className="error-divider"></div>
          <p className="error-subtitle">Oops! Page not found</p>
        </div>

        <div className="error-description">
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <p>Here are some helpful links instead:</p>
        </div>

        <div className="error-actions">
          <button 
            className="error-button primary"
            onClick={() => navigate('/')}
          >
            <Home className="button-icon" />
            Back to Home
          </button>

          <button 
            className="error-button secondary"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="button-icon" />
            Go Back
          </button>

          <div className="search-container">
            <div className="search-wrapper">
              <Search className="search-icon" />
              <input 
                type="text" 
                placeholder="Search ParkPal..." 
                className="search-input"
              />
            </div>
          </div>
        </div>

        {/* Interactive 404 Illustration */}
        <div className="error-illustration">
          <div className="car-container">
            <div className="car">
              <div className="car-body">
                <div className="car-top"></div>
                <div className="car-base"></div>
                <div className="wheel front"></div>
                <div className="wheel back"></div>
              </div>
              <div className="car-shadow"></div>
            </div>
            <div className="road">
              <div className="line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}