import React from 'react';
import { ChevronRight } from 'lucide-react';

export function Banner() {
  return (
    <div className="banner">
      <span className="animate-on-scroll">🎉 Now available in 100+ cities!</span>
      <button className="banner-button magnetic-button">
        Learn More <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}