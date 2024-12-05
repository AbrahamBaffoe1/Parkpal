// src/components/parking/ParkingSearch/ParkingSearch.jsx
import { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import './ParkingSearch.css';

export function ParkingSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [spots] = useState([
    { id: 1, name: "Downtown Parking", available: 5, price: "₦2.50" },
    { id: 2, name: "Mall Parking", available: 12, price: "₦3.00" },
    { id: 3, name: "Station Parking", available: 3, price: "₦2.00" },
  ]);

  return (
    <div className="parking-container">
      {/* Search Section */}
      <div className="search-section">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search for parking spots..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Results Grid */}
      <div className="spots-grid">
        {spots.map((spot) => (
          <div key={spot.id} className="spot-card">
            <div className="spot-header">
              <MapPin className="spot-icon" />
              <h3 className="spot-name">{spot.name}</h3>
            </div>
            <div className="spot-info">
              <span className="availability">
                {spot.available} spots available
              </span>
              <span className="price">
                {spot.price}/hour
              </span>
            </div>
            <button className="book-button">
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


