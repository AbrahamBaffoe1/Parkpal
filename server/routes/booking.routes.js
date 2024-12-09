// server/routes/booking.routes.js
import express from 'express';
import {
  createBooking,
  getUserBookings,
  updateBookingStatus,
  cancelBooking
} from '../controllers/booking.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/', createBooking);
router.get('/my-bookings', getUserBookings);
router.put('/:id/status', updateBookingStatus);
router.put('/:id/cancel', cancelBooking);

export default router;