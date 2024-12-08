// Register.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, AtSign, Lock, User } from 'lucide-react';
import api from '../../utils/api';
import SuccessScreen from '../../SuccessScreen/SuccessScreen';
import './Register.css';

function RegisterPage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Interactive Background Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
      
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: Math.random() * 2 - 1,
          speedY: Math.random() * 2 - 1,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
      particlesRef.current = particles;
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        const distance = Math.sqrt(
          Math.pow(mouseRef.current.x - particle.x, 2) +
          Math.pow(mouseRef.current.y - particle.y, 2)
        );

        if (distance < 100) {
          const angle = Math.atan2(mouseRef.current.y - particle.y, mouseRef.current.x - particle.x);
          particle.x -= Math.cos(angle) * 0.5;
          particle.y -= Math.sin(angle) * 0.5;
        }

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79, 70, 229, ${particle.opacity})`;
        ctx.fill();
      });

      // Draw connections between particles
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach((otherParticle) => {
          const distance = Math.sqrt(
            Math.pow(particle.x - otherParticle.x, 2) +
            Math.pow(particle.y - otherParticle.y, 2)
          );

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(79, 70, 229, ${0.2 * (1 - distance / 100)})`;
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    
    resizeCanvas();
    createParticles();
    drawParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const validateName = (name) => {
    if (name.length < 2) return 'Name must be at least 2 characters long';
    if (name.length > 50) return 'Name must be less than 50 characters';
    if (!/^[a-zA-Z\s'-]+$/.test(name)) return 'Name can only contain letters, spaces, hyphens and apostrophes';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'name') {
      setNameError(validateName(value));
    }
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    const nameValidationError = validateName(formData.name);
    if (nameValidationError) {
      setNameError(nameValidationError);
      return;
    }

    if (!formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
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
      <canvas
        ref={canvasRef}
        className="background-canvas"
      />
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
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${nameError ? 'error' : ''}`}
                placeholder="Enter your full name"
                required
              />
            </div>
            {nameError && (
              <div className="input-error">
                {nameError}
              </div>
            )}
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