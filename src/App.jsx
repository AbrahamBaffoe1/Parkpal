// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/auth/Login/Login';
import RegisterPage from './components/auth/Register/Register';
import PreLoginPage from './components/PreLogin/PreLogin';
import Landing from './components/landing/Landing';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/prelogin" element={<PreLoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;