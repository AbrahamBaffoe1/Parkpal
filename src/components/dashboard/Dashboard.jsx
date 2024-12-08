// src/components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  MapPin, Car, Clock, CreditCard, Bell, Settings, 
  LogOut, Search, Menu, X 
} from 'lucide-react';
import api from '../utils/api';
import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeBookings, setActiveBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }
        
        const response = await api.get('/user/profile');
        setUser(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    };

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await api.get('/bookings/active');
        setActiveBookings(response.data.data || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
    fetchBookings();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>ParkPal</h2>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <a href="/dashboard" className="nav-item active">
            <Car /> Dashboard
          </a>
          <a href="/bookings" className="nav-item">
            <Clock /> My Bookings
          </a>
          <a href="/payments" className="nav-item">
            <CreditCard /> Payments
          </a>
          <a href="/notifications" className="nav-item">
            <Bell /> Notifications
          </a>
          <a href="/settings" className="nav-item">
            <Settings /> Settings
          </a>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="search-bar">
            <Search size={20} />
            <input type="text" placeholder="Search for parking spots..." />
          </div>
          <div className="user-info">
            {user && (
              <>
                <span>{user.name}</span>
                <div className="avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              </>
            )}
          </div>
        </header>

        <div className="dashboard-content">
          {/* Quick Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Active Bookings</h3>
              <p className="stat-number">{activeBookings?.length || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Total Spent</h3>
              <p className="stat-number">$120.50</p>
            </div>
            <div className="stat-card">
              <h3>Favorite Spots</h3>
              <p className="stat-number">3</p>
            </div>
          </div>

          {/* Active Bookings */}
          <section className="bookings-section">
            <h2>Active Bookings</h2>
            <div className="bookings-grid">
              {isLoading ? (
                <div className="loading">Loading bookings...</div>
              ) : error ? (
                <div className="error">{error}</div>
              ) : activeBookings.length > 0 ? (
                activeBookings.map(booking => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-header">
                      <MapPin className="location-icon" />
                      <h3>{booking.spotName || 'Unnamed Spot'}</h3>
                    </div>
                    <div className="booking-details">
                      <p>Start: {new Date(booking.startTime).toLocaleString()}</p>
                      <p>End: {new Date(booking.endTime).toLocaleString()}</p>
                      <p className="booking-price">${booking.totalPrice}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-bookings">No active bookings found</div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export { Dashboard };