// src/components/sections/TestimonialsSection.jsx
import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import './TestimonialsSection.css';

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

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

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000);
    return () => clearInterval(timer);
  }, []);

  // Handle touch events for mobile swipe
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextTestimonial();
    }
    if (isRightSwipe) {
      prevTestimonial();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-background"></div>
      <div className="container">
        <h2 className="section-title">What Our Users Say</h2>
        
        <div className="testimonials-wrapper">
          <button 
            className="nav-button prev"
            onClick={prevTestimonial}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            className="nav-button next"
            onClick={nextTestimonial}
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>

          <div 
            className="testimonials-carousel"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`testimonial-slide ${index === activeIndex ? 'active' : ''}`}
                style={{
                  transform: `translateX(${(index - activeIndex) * 100}%)`,
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
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        loading="lazy"
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