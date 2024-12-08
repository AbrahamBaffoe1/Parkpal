// server/routes/protected.js
import express from 'express';
import { pool } from '../db/pool.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { ValidationError } from '../middleware/errorHandler.js';

const router = express.Router();

// Get user profile
router.get('/profile', asyncHandler(async (req, res) => {
  const result = await pool.query(
    `SELECT id, name, email, is_verified, created_at
     FROM users 
     WHERE id = $1`,
    [req.user.id]
  );

  if (result.rows.length === 0) {
    throw new ValidationError('User not found');
  }

  res.json({
    status: 'success',
    data: {
      user: {
        ...result.rows[0],
        isVerified: result.rows[0].is_verified,
        createdAt: result.rows[0].created_at
      }
    }
  });
}));

// Update user profile
router.put('/profile', asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new ValidationError('Name is required');
  }

  const result = await pool.query(
    `UPDATE users 
     SET name = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING id, name, email, is_verified, created_at, updated_at`,
    [name, req.user.id]
  );

  res.json({
    status: 'success',
    data: {
      user: {
        ...result.rows[0],
        isVerified: result.rows[0].is_verified,
        createdAt: result.rows[0].created_at,
        updatedAt: result.rows[0].updated_at
      }
    }
  });
}));

// Change password
router.put('/change-password', asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ValidationError('Current password and new password are required');
  }

  if (newPassword.length < 8) {
    throw new ValidationError('New password must be at least 8 characters long');
  }

  // Get current user's password hash
  const user = await pool.query(
    'SELECT password_hash FROM users WHERE id = $1',
    [req.user.id]
  );

  if (!await bcrypt.compare(currentPassword, user.rows[0].password_hash)) {
    throw new ValidationError('Current password is incorrect');
  }

  // Hash new password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password
  await pool.query(
    `UPDATE users 
     SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2`,
    [hashedPassword, req.user.id]
  );

  // Invalidate all refresh tokens for this user
  await pool.query(
    'DELETE FROM refresh_tokens WHERE user_id = $1',
    [req.user.id]
  );

  res.json({
    status: 'success',
    message: 'Password updated successfully'
  });
}));

// Delete account
router.delete('/account', asyncHandler(async (req, res) => {
  // Delete user (cascade will handle related records)
  await pool.query(
    'DELETE FROM users WHERE id = $1',
    [req.user.id]
  );

  res.json({
    status: 'success',
    message: 'Account deleted successfully'
  });
}));

export const protectedRoutes = router;