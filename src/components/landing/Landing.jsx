// src/components/landing/Landing.jsx
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, MapPin, Car, Shield, Star, ChevronRight, Quote } from 'lucide-react';
import { CustomCursor } from '../cursor/CustomCursor';
import { PricingSection } from '../sections/PricingSection';
import { IntegrationsSection } from '../IntegrationsSection/IntegrationsSection';
import { TestimonialsSection } from '../Testimonials/Testimonials';
import { FAQSection } from '../FAQSection/FAQSection';
import { FeaturesGrid } from '../FeaturesGrid/FeaturesGrid';
import { Banner } from '../Banner/Banner';
import { Navigation } from '../Navigation/Navigation';
import { Cta } from '../sections/Cta';
import { HeroSection } from '../HeroSection/HeroSection';
import { Footer } from '../Footer/Footer';
import { ConsentBanner } from '../ConsentBanner/ConsentBanner';
import './Landing.css';
import '../../styles/colorScheme.css';

function useColorScheme() {
  const [colorScheme, setColorScheme] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorScheme((prev) => (prev % 5) + 1);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return colorScheme;
}

function Landing() {
  const parallaxRef = useRef(null);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.parallax');
      elements.forEach(el => {
        const scrolled = window.pageYOffset;
        const rate = el.dataset.rate || 0.3;
        const yPos = -(scrolled * rate);
        el.style.setProperty('--parallax-y', `${yPos}px`);
      });
    };

    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`landing-page color-scheme-${colorScheme}`}>
      <div className="landing-page" ref={parallaxRef}>
        <CustomCursor />
        <Banner />
        <Navigation />
        <HeroSection />
        <FeaturesGrid />
        <Cta />
        <PricingSection />
        <IntegrationsSection />
        <TestimonialsSection />
        <FAQSection />
        <Footer />
        <ConsentBanner />
      </div>
    </div>
  );
}

export { Landing };