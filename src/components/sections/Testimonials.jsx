// src/components/sections/TestimonialsSection.jsx
import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
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
      image: "/testimonials/sarah.jpg" // Add placeholder image path
    },
    {
      name: "Michael Chen",
      role: "Business Owner",
      content: "As a business owner, managing employee parking was a hassle until we found ParkPal. The business features are exactly what we needed for our growing team.",
      rating: 5,
      location: "Abuja, Nigeria",
      image: "/testimonials/michael.jpg"
    },
    {
      name: "Emma Wilson",
      role: "City Explorer",
      content: "Love the real-time updates and user-friendly interface. ParkPal makes exploring new areas of the city stress-free. It's truly a game-changer!",
      rating: 4,
      location: "Port Harcourt, Nigeria",
      image: "/testimonials/emma.jpg"
    }
  ];

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="testimonials-section">
      <div className="testimonials-background"></div>
      <div className="container">
        <h2 className="section-title">What Our Users Say</h2>
        
        <div className="testimonials-wrapper">
          {/* Navigation Buttons */}
          <button 
            className="nav-button prev"
            onClick={prevTestimonial}
            aria-label="Previous testimonial"
          >
            <ChevronLeft />
          </button>
          
          <button 
            className="nav-button next"
            onClick={nextTestimonial}
            aria-label="Next testimonial"
          >
            <ChevronRight />
          </button>

          {/* Testimonials Carousel */}
          <div className="testimonials-carousel">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`testimonial-slide ${index === activeIndex ? 'active' : ''}`}
                style={{
                  transform: `translateX(${(index - activeIndex) * 100}%)`,
                  opacity: index === activeIndex ? 1 : 0
                }}
              >
                <div className="testimonial-content">
                  <blockquote>{testimonial.content}</blockquote>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`star ${i < testimonial.rating ? 'filled' : ''}`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="testimonial-author">
                  <div className="author-image">
                    <img src="/api/placeholder/64/64" alt={testimonial.name} />
                  </div>
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p className="role">{testimonial.role}</p>
                    <p className="location">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Indicators */}
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

export default TestimonialsSection;