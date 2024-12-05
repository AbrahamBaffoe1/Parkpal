// src/components/sections/Testimonials.jsx
import { useEffect, useRef } from 'react';
import { Star, Quote } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Daily Commuter",
      content: "ParkPal has completely transformed my daily commute. No more circling blocks looking for parking!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Business Owner",
      content: "The best parking solution I've ever used. Simple, efficient, and reliable.",
      rating: 5
    },
    {
      name: "Emma Wilson",
      role: "City Explorer",
      content: "Makes exploring the city so much easier. I love the real-time availability feature!",
      rating: 4
    }
  ];

  const sectionRef = useRef(null);

  useEffect(() => {
    const observeSection = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        { threshold: 0.1 }
      );

      const elements = sectionRef.current.querySelectorAll('.testimonial-card');
      elements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    };

    observeSection();
  }, []);

  return (
    <section className="testimonials py-20" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center mb-16">
          What Our Users Say
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="testimonial-card hover-lift"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <Quote className="text-purple-500 w-8 h-8 mb-4" />
              <p className="mb-6">{testimonial.content}</p>
              
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i}
                      className="w-4 h-4 text-yellow-500 fill-current"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}