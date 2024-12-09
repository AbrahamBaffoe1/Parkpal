// server/controllers/user.controller.js
import bcrypt from 'bcryptjs';
import pool from '../config/db.config.js';

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, phone, is_verified, created_at
       FROM users 
       WHERE id = $1`,
      [req.user.id]
    );

    const user = result.rows[0];

    // Get user roles
    const rolesResult = await pool.query(
      `SELECT r.name 
       FROM roles r 
       JOIN user_roles ur ON r.id = ur.role_id 
       WHERE ur.user_id = $1`,
      [req.user.id]
    );

    const roles = rolesResult.rows.map(row => row.name);

    res.json({
      status: 'success',
      data: {
        user: {
          ...user,
          roles
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving user profile'
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { full_name, phone } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET full_name = COALESCE($1, full_name),
           phone = COALESCE($2, phone),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, full_name, email, phone, is_verified`,
      [full_name, phone, req.user.id]
    );

    res.json({
      status: 'success',
      data: {
        user: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating profile'
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Both current and new password are required'
      });
    }

    // Get current password hash
    const result = await pool.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [req.user.id]
    );

    const user = result.rows[0];

    // Verify current password
    if (!(await bcrypt.compare(currentPassword, user.password_hash))) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await pool.query(
      `UPDATE users 
       SET password_hash = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [hashedPassword, req.user.id]
    );

    // Delete all refresh tokens for this user
    await pool.query(
      'DELETE FROM refresh_tokens WHERE user_id = $1',
      [req.user.id]
    );

    res.json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error changing password'
    });
  }
};

// Delete account
export const deleteAccount = async (req, res) => {
  try {
    // Start a transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Delete refresh tokens
      await client.query(
        'DELETE FROM refresh_tokens WHERE user_id = $1',
        [req.user.id]
      );

      // Delete user roles
      await client.query(
        'DELETE FROM user_roles WHERE user_id = $1',
        [req.user.id]
      );

      // Delete user
      await client.query(
        'DELETE FROM users WHERE id = $1',
        [req.user.id]
      );

      await client.query('COMMIT');

      res.json({
        status: 'success',
        message: 'Account deleted successfully'
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting account'
    });
  }
};