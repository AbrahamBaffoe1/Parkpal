// src/components/auth/Register/ParkingToy.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Car, ParkingSquare } from 'lucide-react';

const getRandomColor = () => {
  const colors = ['#60A5FA', '#34D399', '#F87171', '#FBBF24'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getRandomPosition = (min = 100, max) => {
  return min + Math.random() * (max - min);
};

const ParkingToy = () => {
  const [cars, setCars] = useState([]);
  const [parkingSpots, setParkingSpots] = useState([]);
  const [draggedCar, setDraggedCar] = useState(null);
  const [score, setScore] = useState(0);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize parking spots and cars
  useEffect(() => {
    const initializeElements = () => {
      // Create parking spots
      const spots = Array.from({ length: 6 }, (_, index) => ({
        id: `spot-${index}`,
        x: getRandomPosition(100, dimensions.width - 100),
        y: getRandomPosition(100, dimensions.height - 100),
        isOccupied: false
      }));
      setParkingSpots(spots);

      // Create cars
      const initialCars = Array.from({ length: 4 }, (_, index) => ({
        id: `car-${index}`,
        x: getRandomPosition(100, dimensions.width - 100),
        y: getRandomPosition(100, dimensions.height - 100),
        color: getRandomColor(),
        isParked: false,
        rotation: Math.random() * 360 // Add random rotation for variety
      }));
      setCars(initialCars);
    };

    initializeElements();
  }, [dimensions]);

  const handleMouseDown = (carId) => (e) => {
    e.preventDefault();
    const car = cars.find(c => c.id === carId);
    if (car && !car.isParked) {
      setDraggedCar({
        id: carId,
        offsetX: e.clientX - car.x,
        offsetY: e.clientY - car.y
      });
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (draggedCar) {
      e.preventDefault();
      setCars(prevCars => prevCars.map(car => {
        if (car.id === draggedCar.id) {
          return {
            ...car,
            x: e.clientX - draggedCar.offsetX,
            y: e.clientY - draggedCar.offsetY
          };
        }
        return car;
      }));
    }
  }, [draggedCar]);

  const showSuccessAnimation = (x, y, points) => {
    const successEl = document.createElement('div');
    successEl.className = 'parking-success-popup';
    successEl.textContent = `+${points}!`;
    successEl.style.left = `${x}px`;
    successEl.style.top = `${y}px`;
    document.body.appendChild(successEl);
    setTimeout(() => document.body.removeChild(successEl), 1000);
  };

  const handleMouseUp = useCallback(() => {
    if (draggedCar) {
      const car = cars.find(c => c.id === draggedCar.id);
      if (car) {
        // Check if car is near any parking spot
        const spot = parkingSpots.find(spot => 
          !spot.isOccupied &&
          Math.abs(spot.x - car.x) < 50 &&
          Math.abs(spot.y - car.y) < 50
        );

        if (spot) {
          const points = 100;
          // Park the car
          setCars(prevCars => prevCars.map(c => {
            if (c.id === draggedCar.id) {
              return { 
                ...c, 
                x: spot.x, 
                y: spot.y, 
                isParked: true,
                rotation: 0 // Straighten the car when parked
              };
            }
            return c;
          }));
          setParkingSpots(prevSpots => prevSpots.map(s => {
            if (s.id === spot.id) {
              return { ...s, isOccupied: true };
            }
            return s;
          }));
          setScore(prev => prev + points);
          
          // Show success animation
          showSuccessAnimation(spot.x, spot.y - 40, points);
        }
      }
      setDraggedCar(null);
    }
  }, [draggedCar, cars, parkingSpots]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className="interactive-background">
      <div className="score-display">
        Score: {score}
        <div className="score-hint">
          {cars.filter(car => !car.isParked).length > 0 
            ? '🎮 Park more cars to score!' 
            : '🌟 Perfect parking!'}
        </div>
      </div>
      
      {/* Parking spots */}
      {parkingSpots.map(spot => (
        <div
          key={spot.id}
          className={`parking-spot ${spot.isOccupied ? 'occupied' : ''}`}
          style={{
            left: spot.x,
            top: spot.y,
          }}
        >
          <ParkingSquare 
            size={48}
            className="parking-icon"
          />
        </div>
      ))}

      {/* Cars */}
      {cars.map(car => (
        <div
          key={car.id}
          className={`draggable-car ${car.isParked ? 'parked' : ''} ${draggedCar?.id === car.id ? 'dragging' : ''}`}
          style={{
            left: car.x,
            top: car.y,
            cursor: car.isParked ? 'default' : 'grab',
            transform: `rotate(${car.rotation}deg) scale(${draggedCar?.id === car.id ? 1.2 : 1})`,
          }}
          onMouseDown={!car.isParked ? handleMouseDown(car.id) : undefined}
        >
          <Car 
            size={40}
            style={{ color: car.color }}
            className="car-icon"
          />
        </div>
      ))}

      {/* Optional: Add instructional hint for new users */}
      {score === 0 && (
        <div className="instruction-hint">
          Drag the cars to park them in the parking spots! 🚗✨
        </div>
      )}
    </div>
  );
};

export default ParkingToy;