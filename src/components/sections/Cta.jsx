import React from "react";
import { ArrowRight } from 'lucide-react';

export function Cta() {
  return (
    <section className="cta">
      <div className="cta-content animate-on-scroll">
        <h2 className="cta-title gradient-text">Ready to Start Parking Smarter?</h2>
        <p className="cta-description">
          Join thousands of drivers who have already simplified their parking experience.
        </p>
        <button className="btn btn-primary magnetic-button hover-lift">
          Sign Up Now <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </section>
  );
}