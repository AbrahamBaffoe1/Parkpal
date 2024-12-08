// LoadingSpinner.jsx
import React from 'react';
import './LoadingSpinner.css';

export const LoadingSpinner = ({ size = 'default', color = 'primary', fullScreen = false }) => {
  const sizeClasses = {
    small: 'spinner-small',
    default: 'spinner-default',
    large: 'spinner-large'
  };

  const colorClasses = {
    primary: 'spinner-primary',
    white: 'spinner-white',
    gray: 'spinner-gray',
    success: 'spinner-success',
    warning: 'spinner-warning',
    danger: 'spinner-danger'
  };

  return (
    <div className={`loading-spinner-wrapper ${fullScreen ? 'full-screen' : ''}`}>
      <div className={`spinner ${sizeClasses[size]} ${colorClasses[color]}`}>
        <div className="spinner-inner"></div>
      </div>
    </div>
  );
};

// Add a default export as well for flexibility
export default LoadingSpinner;