// src/components/cursor/CustomCursor.jsx
import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    
    const moveCursor = (e) => {
      const { clientX, clientY } = e;
      cursor.style.transform = `translate(${clientX - 10}px, ${clientY - 10}px)`;
      follower.style.transform = `translate(${clientX - 20}px, ${clientY - 20}px)`;
    };

    const addHoverEffect = (e) => {
      cursor.classList.add('hover-effect');
      if (e.target.classList.contains('magnetic-button')) {
        handleMagneticEffect(e);
      }
    };

    const removeHoverEffect = () => {
      cursor.classList.remove('hover-effect');
    };

    const handleMagneticEffect = (e) => {
      const magnetic = e.target;
      const bounding = magnetic.getBoundingClientRect();
      const magnetsStrength = 40;
      
      const x = (e.clientX - bounding.left) / magnetic.offsetWidth - 0.5;
      const y = (e.clientY - bounding.top) / magnetic.offsetHeight - 0.5;
      
      magnetic.style.transform = `translate(${x * magnetsStrength}px, ${y * magnetsStrength}px)`;
    };

    document.addEventListener('mousemove', moveCursor);
    
    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, .interactive-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', addHoverEffect);
      el.addEventListener('mouseleave', removeHoverEffect);
    });

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', addHoverEffect);
        el.removeEventListener('mouseleave', removeHoverEffect);
      });
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={followerRef} className="custom-cursor-follower" />
    </>
  );
}