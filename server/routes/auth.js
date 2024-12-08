// server/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db/pool.js';
import { ValidationError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { logger } from '../services/logger.js';

const router = express.Router();

// Register route
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    throw new ValidationError('Name, email and password are required');
  }

  if (password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters long');
  }

  // Check if user exists
  const existingUser = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  if (existingUser.rows.length > 0) {
    throw new ValidationError('Email already registered');
  }

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Start transaction
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create user
    const userResult = await client.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, full_name, email`,
      [name, email.toLowerCase(), hashedPassword]
    );

    const user = userResult.rows[0];

    // Get default role
    const roleResult = await client.query(
      'SELECT id FROM roles WHERE name = $1',
      ['user']
    );

    if (roleResult.rows.length === 0) {
      throw new Error('Default user role not found');
    }

    // Assign role
    await client.query(
      'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
      [user.id, roleResult.rows[0].id]
    );

    await client.query('COMMIT');

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Set session
    req.session.userId = user.id;
    await new Promise((resolve, reject) => {
      req.session.save(err => {
        if (err) reject(err);
        resolve();
      });
    });

    res.status(201).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.full_name
        }
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}));

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
      throw new ValidationError('Invalid credentials');
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      throw new ValidationError('Invalid credentials');
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