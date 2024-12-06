// src/components/sections/TestimonialsSection.jsx
import { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, ArrowLeft, ArrowRight, Loader } from 'lucide-react';
import './TestimonialsSection.css';

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const carouselRef = useRef(null);
  const progressRef = useRef(null);
  const autoPlayRef = useRef(null);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Daily Commuter",
      content: "ParkPal has transformed my daily commute. Finding parking is now effortless! The real-time availability feature saves me so much time every morning.",
      rating: 5,
      location: "Lagos, Nigeria",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Michael Chen",
      role: "Business Owner",
      content: "As a business owner, managing employee parking was a hassle until we found ParkPal. The business features are exactly what we needed for our growing team.",
      rating: 5,
      location: "Abuja, Nigeria",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Emma Wilson",
      role: "City Explorer",
      content: "Love the real-time updates and user-friendly interface. ParkPal makes exploring new areas of the city stress-free. It's truly a game-changer!",
      rating: 4,
      location: "Port Harcourt, Nigeria",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "David Okonjo",
      role: "Ride Share Driver",
      content: "This app is a lifesaver for ride-share drivers! Quick parking between rides and the rates are very reasonable.",
      rating: 5,
      location: "Ibadan, Nigeria",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    }
  ];

  // Enhanced navigation with progress reset
  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    resetProgress();
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    resetProgress();
  };

  // Progress bar handling
  const resetProgress = () => {
    setProgress(0);
    if (progressRef.current) {
      progressRef.current.style.width = '0%';
      setTimeout(() => {
        progressRef.current.style.width = '100%';
      }, 50);
    }
  };

  // Auto-advance and progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          nextTestimonial();
          return 0;
        }
        return prev + 2; // Adjust speed here
      });
    }, 100);

    return () => clearInterval(timer);
  }, [activeIndex]);

  // Image loading handler
  const handleImageLoad = (index) => {
    setImagesLoaded(prev => ({
      ...prev,
      [index]: true
    }));
    if (Object.keys(imagesLoaded).length === testimonials.length - 1) {
      setIsLoading(false);
    }
  };

  // Enhanced touch handling with resistance
  const handleTouchStart = (e) => {
    setIsDragging(true);
    const touch = e.touches[0];
    setDragOffset(0);
    setSwipeDirection(null);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const currentOffset = touch.clientX - e.target.getBoundingClientRect().left;
    const delta = currentOffset - dragOffset;

    // Add resistance at edges
    if ((activeIndex === 0 && delta > 0) || 
        (activeIndex === testimonials.length - 1 && delta < 0)) {
      setDragOffset(delta * 0.3);
    } else {
      setDragOffset(delta);
    }

    // Show swipe direction indicator
    if (Math.abs(delta) > 50) {
      setSwipeDirection(delta > 0 ? 'right' : 'left');
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const threshold = 100; // Minimum distance for swipe
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        prevTestimonial();
      } else {
        nextTestimonial();
      }
    }

    setIsDragging(false);
    setDragOffset(0);
    setSwipeDirection(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevTestimonial();
      if (e.key === 'ArrowRight') nextTestimonial();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="testimonials-section">
      <div className="testimonials-background"></div>
      <div className="container">
        <h2 className="section-title">What Our Users Say</h2>
        
        <div className="testimonials-wrapper">
          <button 
            className={`nav-button prev ${activeIndex === 0 ? 'disabled' : ''}`}
            onClick={prevTestimonial}
            disabled={activeIndex === 0}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            className={`nav-button next ${activeIndex === testimonials.length - 1 ? 'disabled' : ''}`}
            onClick={nextTestimonial}
            disabled={activeIndex === testimonials.length - 1}
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>

          {/* Swipe Direction Indicators */}
          {swipeDirection && (
            <div className={`swipe-indicator ${swipeDirection}`}>
              {swipeDirection === 'left' ? <ArrowLeft /> : <ArrowRight />}
            </div>
          )}

          <div 
            className={`testimonials-carousel ${isDragging ? 'dragging' : ''}`}
            ref={carouselRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`testimonial-slide ${index === activeIndex ? 'active' : ''}`}
                style={{
                  transform: `translateX(${(index - activeIndex) * 100 + (index === activeIndex ? dragOffset : 0)}%)`,
                  opacity: index === activeIndex ? 1 : 0,
                  visibility: index === activeIndex ? 'visible' : 'hidden'
                }}
              >
                <div className="testimonial-content">
                  <Quote className="quote-icon" size={40} />
                  <blockquote>{testimonial.content}</blockquote>
                  
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`star ${i < testimonial.rating ? 'filled' : ''}`}
                        size={24}
                      />
                    ))}
                  </div>
                  
                  <div className="testimonial-author">
                    <div className="author-image">
                      {!imagesLoaded[index] && (
                        <div className="image-loader">
                          <Loader className="animate-spin" size={24} />
                        </div>
                      )}
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        loading="lazy"
                        onLoad={() => handleImageLoad(index)}
                        className={imagesLoaded[index] ? 'loaded' : ''}
                      />
                    </div>
                    <div className="author-info">
                      <h4>{testimonial.name}</h4>
                      <p className="role">{testimonial.role}</p>
                      <p className="location">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <div 
              className="progress-bar" 
              ref={progressRef}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Enhanced Indicators */}
          <div className="testimonial-indicators">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}