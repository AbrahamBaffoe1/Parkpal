// src/components/SuccessScreen/SuccessScreen.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import './SuccessScreen.css';

function SuccessScreen({ message, redirectTo, delay = 3000 }) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(redirectTo);
    }, delay);

    return () => clearTimeout(timer);
  }, [navigate, redirectTo, delay]);

  return (
    <div className="success-screen">
      <div className="success-content">
        <CheckCircle className="success-icon" size={64} />
        <h1>Success!</h1>
        <p>{message}</p>
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
        <p className="redirect-text">
          Redirecting you in {Math.ceil(delay / 1000)} seconds...
        </p>
      </div>
    </div>
  );
}

export default SuccessScreen;