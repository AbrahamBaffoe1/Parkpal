import React from 'react';
import './LoadingSpinner.css';

export const LoadingSpinner = ({ 
  size = 'default', 
  color = 'primary', 
  fullScreen = false,
  text = 'Loading...'
}) => {
  return (
    <div className={`loading-spinner-wrapper ${fullScreen ? 'full-screen' : ''}`}>
      {fullScreen && (
        <>
          <div className="loading-background">
            <div className="background-gradient"></div>
            <div className="background-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
          </div>
        </>
      )}

      <div className="spinner-container">
        <div className={`spinner ${size ? `spinner-${size}` : ''} ${color ? `spinner-${color}` : ''}`}>
          <div className="glow"></div>
          <div className="spinner-ring ring-outer"></div>
          <div className="spinner-ring ring-middle"></div>
          <div className="spinner-ring ring-inner"></div>
          
          <div className="logo-container">
            <span className="logo-text">P</span>
          </div>
        </div>
      </div>

      {fullScreen && (
        <>
          <div className="loading-text">{text}</div>
          <div className="loading-progress">
            <div className="progress-bar"></div>
          </div>
        </>
      )}
    </div>
  );
};

export default LoadingSpinner;