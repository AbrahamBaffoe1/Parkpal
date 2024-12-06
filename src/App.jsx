// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './components/landing/Landing';
import { Error404 } from './components/Error404/Error404';
import ConsentBanner from './components/ConsentBanner/ConsentBanner';  
import { PreLoginPage } from './components/PreLogin/PreLogin';
import LoginPage from './components/auth/Login/Login';
import RegisterPage from './components/auth/Register/Register';
// import { isAuthenticated } from './utils/auth';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Error404 />} />
        <Route path="/PreLogin" element={<PreLoginPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/parking" element={<ParkingSearch />} /> */}
        {/* <Route path="/bookings" element={<Bookings />} /> */}
      </Routes>
      <ConsentBanner />
    </Router>
  );
}

export default App;