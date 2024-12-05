import { Link } from 'react-router-dom';
import './Header.css';

export function Header() {
  return (
    <header className="header-container bg-gradient-to-r from-[#0A0A0A] to-[#1A1A1A]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="logo-text">
            ParkPal
          </Link>
          <div className="nav-links">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/parking" className="nav-link">Find Parking</Link>
            <Link to="/bookings" className="nav-link">My Bookings</Link>
            <button className="auth-button">
              Sign In
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}