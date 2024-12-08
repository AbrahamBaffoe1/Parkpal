// server/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db/pool.js';
import { ValidationError, UnauthorizedError } from '../middleware/errorHandler.js';
import { logger } from '../services/logger.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Register route
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      throw new ValidationError('Email, password and name are required');
    }

    if (password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long');
    }

    // Check if email already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new ValidationError('Email already registered');
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with proper error handling
    try {
      const result = await pool.query(
        `INSERT INTO users (email, password_hash, full_name, created_at, updated_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING id, email, full_name as name, created_at`,
        [email, hashedPassword, name]
      );

      const user = result.rows[0];

      // Create session
      req.session.userId = user.id;

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Assign default user role
      await pool.query(
        `INSERT INTO user_roles (user_id, role_id)
         SELECT $1, id FROM roles WHERE name = 'user'`,
        [user.id]
      );

      res.status(201).json({
        status: 'success',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            created_at: user.created_at
          }
        }
      });
    } catch (dbError) {
      console.error('Database error during user creation:', dbError);
      if (dbError.code === '23505') { // Unique violation
        throw new ValidationError('Email already registered');
      }
      throw new Error('Failed to create user account');
    }
  } catch (error) {
    next(error);
  }
});

// Login route
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    // Get user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Create session
    req.session.userId = user.id;

    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.full_name
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Logout route
router.post('/logout', async (req, res, next) => {
  try {
    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        logger.error('Error destroying session:', err);
        throw err;
      }
      res.clearCookie('sessionId');
      res.json({
        status: 'success',
        message: 'Logged out successfully'
      });
    });
  } catch (error) {
    next(error);
  }
});

// Check auth status
router.get('/check', async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.json({
        status: 'success',
        data: {
          authenticated: false
        }
      });
    }

    const result = await pool.query(
      'SELECT id, email, full_name as name FROM users WHERE id = $1',
      [req.session.userId]
    );

    if (result.rows.length === 0) {
      req.session.destroy();
      return res.json({
        status: 'success',
        data: {
          authenticated: false
        }
      });
    }

    res.json({
      status: 'success',
      data: {
        authenticated: true,
        user: result.rows[0]
      }
    });
  } catch (error) {
    next(error);
  }
});

export { router as authRoutes };