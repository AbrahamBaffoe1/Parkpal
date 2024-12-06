// server/routes/protected.js
import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Dashboard route
router.get('/dashboard', auth, (req, res) => {
  res.json({ 
    status: 'success',
    message: 'Welcome to the dashboard!',
    data: {
      user: req.user
    }
  });
});

// User profile route
router.get('/profile', auth, (req, res) => {
  res.json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

// Update profile route
router.put('/profile', auth, (req, res) => {
  res.json({
    status: 'success',
    message: 'Profile updated successfully'
  });
});

// Settings route
router.get('/settings', auth, (req, res) => {
  res.json({
    status: 'success',
    message: 'User settings retrieved'
  });
});

export { router as protectedRoutes };