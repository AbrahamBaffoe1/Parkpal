// server/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import pool from '../config/db.config.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database
      const result = await pool.query(
        'SELECT id, full_name, email FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({
          status: 'error',
          message: 'User not found'
        });
      }

      // Add user to request object
      req.user = result.rows[0];
      next();

    } catch (error) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

export const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      // Get user roles
      const result = await pool.query(
        `SELECT r.name 
         FROM roles r 
         JOIN user_roles ur ON r.id = ur.role_id 
         WHERE ur.user_id = $1`,
        [req.user.id]
      );

      const userRoles = result.rows.map(row => row.name);

      // Check if user has required role
      if (!roles.some(role => userRoles.includes(role))) {
        return res.status(403).json({
          status: 'error',
          message: 'Not authorized to access this route'
        });
      }

      next();
    } catch (error) {
      console.error('Role authorization error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  };
};