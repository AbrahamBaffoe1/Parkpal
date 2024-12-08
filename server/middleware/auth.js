// server/middleware/auth.js
import { UnauthorizedError, SessionExpiredError } from './errorHandler.js';
import { pool } from '../db/pool.js';

export const auth = async (req, res, next) => {
  try {
    // Check if user is authenticated via session
    if (!req.session || !req.session.userId) {
      throw new UnauthorizedError('Authentication required');
    }

    // Get user data
    const result = await pool.query(
      'SELECT id, email, full_name FROM users WHERE id = $1',
      [req.session.userId]
    );

    if (result.rows.length === 0) {
      throw new UnauthorizedError('User not found');
    }

    // Check session expiry
    if (req.session.cookie.expires && new Date() > req.session.cookie.expires) {
      throw new SessionExpiredError();
    }

    // Attach user to request object
    req.user = result.rows[0];
    next();
  } catch (error) {
    next(error);
  }
};
