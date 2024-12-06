// server/middleware/auth.js
import jwt from 'jsonwebtoken';
import { pool } from '../db/pool.js';

export const auth = async (req, res, next) => {
  try {
    // Check for token in Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Authorization token required' 
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if token exists in sessions table
      const session = await pool.query(
        'SELECT * FROM sessions WHERE user_id = $1 AND token = $2 AND expires_at > NOW()',
        [decoded.userId, token]
      );

      if (session.rows.length === 0) {
        return res.status(401).json({
          status: 'error',
          message: 'Session expired or invalid'
        });
      }

      // Get user data
      const user = await pool.query(
        'SELECT id, name, email FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (user.rows.length === 0) {
        return res.status(401).json({
          status: 'error',
          message: 'User not found'
        });
      }

      // Attach user to request object
      req.user = user.rows[0];
      next();

    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          message: 'Token expired'
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

