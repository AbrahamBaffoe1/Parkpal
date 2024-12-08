// src/pages/Login/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, AtSign, Lock } from 'lucide-react';
import api from '../../utils/api.js';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import SuccessScreen from '../../SuccessScreen/SuccessScreen';
import './Login.css';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Clear any existing auth tokens on mount
    localStorage.removeItem('user');
  }, []);

  useEffect(() => {
    let redirectTimer;
    if (isSuccess) {
      redirectTimer = setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
    return () => clearTimeout(redirectTimer);
  }, [isSuccess, navigate]);

  const validateForm = () => {
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password || formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', formData);
      
      if (response.data?.data?.user) {
        // User data stored in localStorage, token handled by httpOnly cookie
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        setIsSuccess(true);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.status === 429) {
        setError('Too many login attempts. Please try again later.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return <SuccessScreen 
      message="Login successful!" 
      redirectTo="/dashboard" 
      delay={2000} 
    />;
  }

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Yup You're Back!</h2>
          <p className="login-subtitle">Login to your account</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-content">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <div className="input-wrapper">
              <AtSign className="input-icon" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="login-footer">
            <button 
              type="submit" 
              className="login-button" 
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="button-icon" />
                </>
              )}
            </button>

            <Link to="/forgot-password" className="forgot-password-link">
              Forgot your password?
            </Link>

            <Link to="/register" className="register-link">
              Don't have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
