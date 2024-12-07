
// server/routes/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { pool } from '../db/pool.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();

// Rate limiting middleware
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    status: 'error',
    message: 'Too many login attempts. Please try again later.'
  }
});

// Validation middleware
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
];

// Login route
router.post('/login', 
  loginLimiter,
  loginValidation,
  asyncHandler(async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: errors.array()[0].msg
      });
    }

    const { email, password } = req.body;

    // Check if user exists using parameterized query
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Store refresh token in database
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'7 days\')',
      [user.rows[0].id, refreshToken]
    );

    // Set httpOnly cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Send response without tokens in body
    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user.rows[0].id,
          name: user.rows[0].name,
          email: user.rows[0].email
        }
      }
    });
  })
);

// Token refresh route
router.post('/refresh',
  asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Refresh token not found'
      });
    }

    // Verify refresh token in database
    const tokenRecord = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
      [refreshToken]
    );

    if (tokenRecord.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid refresh token'
      });
    }

    try {
      // Verify token signature
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );

      // Generate new access token
      const accessToken = jwt.sign(
        { userId: decoded.userId },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
      );

      // Set new access token cookie
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
      });

      res.json({
        status: 'success',
        message: 'Token refreshed successfully'
      });
    } catch (error) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid refresh token'
      });
    }
  })
);

// Logout route
router.post('/logout',
  asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      // Remove refresh token from database
      await pool.query(
        'DELETE FROM refresh_tokens WHERE token = $1',
        [refreshToken]
      );
    }

    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' });

    res.json({
      status: 'success',
      message: 'Logged out successfully'
    });
  })
);

export { router as authRoutes };