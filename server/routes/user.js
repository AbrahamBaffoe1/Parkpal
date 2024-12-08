// server/routes/user.js
import express from 'express';
import { User } from '../models/user.js';
import { checkAuth } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();

// Get user profile
router.get('/profile', 
  checkAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatarUrl: user.avatar_url,
          isVerified: user.is_verified,
          roles: user.roles
        }
      }
    });
  })
);

// Update user profile
router.put('/profile',
  checkAuth,
  asyncHandler(async (req, res) => {
    const { name, phone } = req.body;
    const updatedUser = await User.update(req.session.userId, { name, phone });

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          avatarUrl: updatedUser.avatar_url,
          isVerified: updatedUser.is_verified,
          roles: updatedUser.roles
        }
      }
    });
  })
);

export const userRoutes = router;
