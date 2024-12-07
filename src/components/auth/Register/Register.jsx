import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, AtSign, Lock, User } from 'lucide-react';
import api from '../../utils/api';
import SuccessScreen from '../../SuccessScreen/SuccessScreen';
import './Register.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (isSuccess) {
    return <SuccessScreen message="Registration successful!" redirectTo="/dashboard" delay={3000} />;
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await api.post('/auth/register', { 
        name, 
        email, 
        password 
      });
      
      if (response.data?.status === 'success') {
        // Store the token
        localStorage.setItem('token', response.data.data.token);
        // Store user data
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        setIsSuccess(true);
        
        // Navigate to dashboard after delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-card">
        <div className="register-header">
          <h2 className="register-title">Welcome to ParkPal</h2>
          <p className="register-subtitle">Sign up to start your journey</p>
        </div>
        <div className="register-content">
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
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
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
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
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>
        <div className="register-footer">
          <button className="register-button" onClick={handleRegister}>
            <span>Sign Up</span>
            <ArrowRight className="button-icon" />
          </button>
          <p className="register-subtext">
            By signing up, you agree to ParkPal's{' '}
            <a href="/terms" className="register-link">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="register-link">
              Privacy Policy
            </a>
            .
          </p>
          <Link to="/login" className="login-link">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;