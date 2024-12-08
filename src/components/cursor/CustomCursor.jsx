// src/components/cursor/CustomCursor.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './CustomCursor.css';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [cursorType, setCursorType] = useState('default');

  const handleMouseMove = useCallback((e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseEnterInteractive = useCallback(() => {
    setIsHovering(true);
    setCursorType('interactive');
  }, []);

  const handleMouseLeaveInteractive = useCallback(() => {
    setIsHovering(false);
    setCursorType('default');
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    // Add event listeners for interactive elements
    const interactiveElements = document.querySelectorAll([
      'button', 
      'a', 
      '.nav-button', 
      '.testimonial-card', 
      '.indicator', 
      '.testimonial-image'
    ].join(', '));

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnterInteractive);
      el.addEventListener('mouseleave', handleMouseLeaveInteractive);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnterInteractive);
        el.removeEventListener('mouseleave', handleMouseLeaveInteractive);
      });
    };
  }, [handleMouseMove, handleMouseEnterInteractive, handleMouseLeaveInteractive]);

  return (
    <>
      <div 
        className={`custom-cursor ${cursorType} ${isHovering ? 'hovering' : ''}`}
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px)`,
          '--cursor-x': `${position.x}px`,
          '--cursor-y': `${position.y}px`
        }}
      >
        <div className="cursor-dot"></div>
        <div className="cursor-outline"></div>
      </div>
      <div 
        className="cursor-trail"
        style={{ 
          '--trail-x': `${position.x}px`,
          '--trail-y': `${position.y}px`
        }}
      />
    </>
  );
}