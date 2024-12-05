// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Landing } from './components/landing/Landing';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* Add other routes here later */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/parking" element={<ParkingSearch />} /> */}
        {/* <Route path="/bookings" element={<Bookings />} /> */}
      </Routes>
    </Router>
  );
}

export default App;