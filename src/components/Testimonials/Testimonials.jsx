// src/components/sections/TestimonialsSection.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import './TestimonialsSection.css';

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const slideRef = useRef(null);
  const autoplayRef = useRef(null);
  const progressRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Daily Commuter",
      content: "ParkPal has transformed my daily commute. Finding parking is now effortless! The real-time availability feature saves me so much time every morning.",
      rating: 5,
      location: "Lagos, Nigeria",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Business Owner",
      content: "As a business owner, managing employee parking was a hassle until we found ParkPal. The business features are exactly what we needed for our growing team.",
      rating: 5,
      location: "Abuja, Nigeria",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
    },
    {
      id: 3,
      name: "Emma Wilson",
      role: "City Explorer",
      content: "Love the real-time updates and user-friendly interface. ParkPal makes exploring new areas of the city stress-free. It's truly a game-changer!",
      rating: 4,
      location: "Port Harcourt, Nigeria",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
    }
  ];

  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      handleNext();
    }, 5000);
  }, []);

  const stopAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  };

  const resetProgress = useCallback(() => {
    setProgress(0);
    if (progressRef.current) {
      progressRef.current.style.width = '0%';
      requestAnimationFrame(() => {
        progressRef.current.style.width = '100%';
      });
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [activeIndex, startAutoplay]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 0.5;
      });
    }, 25);

    return () => clearInterval(timer);
  }, [activeIndex]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    resetProgress();
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    resetProgress();
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    setDragStart(e.type === 'touchstart' ? e.touches[0].clientX : e.clientX);
    stopAutoplay();
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const currentPosition = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const diff = currentPosition - dragStart;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = window.innerWidth * 0.2;
    
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    setDragOffset(0);
    startAutoplay();
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-background">
        <div className="background-gradient"></div>
        <div className="background-patterns"></div>
      </div>

      <div className="testimonials-container">
        <h2 className="section-title">
          What Our Users Say
          <div className="title-decoration"></div>
        </h2>

        <div className="testimonials-wrapper"
             onMouseDown={handleDragStart}
             onMouseMove={handleDragMove}
             onMouseUp={handleDragEnd}
             onMouseLeave={handleDragEnd}
             onTouchStart={handleDragStart}
             onTouchMove={handleDragMove}
             onTouchEnd={handleDragEnd}>
          
          <div className="testimonials-track" ref={slideRef}
               style={{
                 transform: `translateX(${-activeIndex * 100 + (dragOffset / window.innerWidth) * 100}%)`
               }}>
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className={`testimonial-slide ${index === activeIndex ? 'active' : ''}`}
              >
                <div className="testimonial-card">
                  <div className="testimonial-image-container">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="testimonial-image"
                    />
                    <div className="image-decoration"></div>
                  </div>

                  <div className="testimonial-content">
                    <Quote className="quote-icon" size={40} />
                    <p className="testimonial-text">{testimonial.content}</p>
                    
                    <div className="testimonial-author">
                      <div className="author-info">
                        <h3 className="author-name">{testimonial.name}</h3>
                        <p className="author-role">{testimonial.role}</p>
                        <p className="author-location">{testimonial.location}</p>
                      </div>
                      
                      <div className="rating-container">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i}
                            className={`star ${i < testimonial.rating ? 'filled' : ''}`}
                            size={20}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            className="nav-button prev" 
            onClick={handlePrev}
            disabled={isAnimating || activeIndex === 0}
          >
            <ChevronLeft />
            <div className="button-glow"></div>
          </button>

          <button 
            className="nav-button next" 
            onClick={handleNext}
            disabled={isAnimating || activeIndex === testimonials.length - 1}
          >
            <ChevronRight />
            <div className="button-glow"></div>
          </button>

          <div className="progress-bar">
            <div className="progress-fill" ref={progressRef}></div>
          </div>

          <div className="testimonial-indicators">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === activeIndex ? 'active' : ''}`}
                onClick={() => {
                  setActiveIndex(index);
                  resetProgress();
                }}
              >
                <span className="indicator-fill"></span>
                <span className="indicator-pulse"></span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}