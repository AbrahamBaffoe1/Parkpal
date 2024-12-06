// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Landing } from './components/landing/Landing';
import { Error404 } from './components/Error404/Error404';
import ConsentBanner from './components/ConsentBanner/ConsentBanner';  // Changed to default import
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Error404 />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/parking" element={<ParkingSearch />} /> */}
        {/* <Route path="/bookings" element={<Bookings />} /> */}
      </Routes>
      <ConsentBanner />
    </Router>
  );
}

export default App;