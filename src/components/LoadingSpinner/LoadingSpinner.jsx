import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'default', color = 'primary' }) => {
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
    <div className="loading-spinner-wrapper">
      <div className={`spinner ${sizeClasses[size]} ${colorClasses[color]}`}>
        <div className="spinner-inner"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;