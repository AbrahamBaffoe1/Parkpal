// src/components/auth/Register/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, AtSign, Lock, User } from 'lucide-react';
import api from '../../utils/api';
import SuccessScreen from '../../SuccessScreen/SuccessScreen';
import './Register.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/register', formData);
      
      if (response.data?.status === 'success') {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        setIsSuccess(true);
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return <SuccessScreen 
      message="Registration successful!" 
      redirectTo="/dashboard" 
      delay={2000} 
    />;
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2 className="register-title">Welcome to ParkPal</h2>
          <p className="register-subtitle">Sign up to start your journey</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form className="register-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                disabled={isLoading}
              />
            </div>
          </div>

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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                disabled={isLoading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={`register-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            <span>{isLoading ? 'Registering...' : 'Sign Up'}</span>
            {!isLoading && <ArrowRight className="button-icon" />}
          </button>

          <p className="terms-text">
            By signing up, you agree to ParkPal's{' '}
            <Link to="/terms" className="link">Terms of Service</Link>{' '}
            and{' '}
            <Link to="/privacy" className="link">Privacy Policy</Link>
          </p>

          <Link to="/login" className="login-link">
            Already have an account? Login
          </Link>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;