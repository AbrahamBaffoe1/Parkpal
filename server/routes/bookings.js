// server/routes/bookings.js
import express from 'express';
import { auth } from '../middleware/auth.js';
import { pool } from '../db/pool.js';

const router = express.Router();

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, ps.address, ps.city, ps.hourly_rate
       FROM bookings b
       JOIN parking_spots ps ON b.spot_id = ps.id
       WHERE b.user_id = $1
       ORDER BY b.start_time DESC`,
      [req.user.id]
    );

    res.json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching bookings'
    });
  }
});

// Get specific booking
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT b.*, ps.address, ps.city, ps.hourly_rate
       FROM bookings b
       JOIN parking_spots ps ON b.spot_id = ps.id
       WHERE b.id = $1 AND b.user_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }

    res.json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching booking'
    });
  }
});

// Create new booking
router.post('/', auth, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { spot_id, start_time, end_time } = req.body;

    // Check if spot exists and is available
    const spotResult = await client.query(
      'SELECT * FROM parking_spots WHERE id = $1 AND is_available = true',
      [spot_id]
    );

    if (spotResult.rows.length === 0) {
      throw new Error('Parking spot not available');
    }

    // Check for conflicting bookings
    const conflictResult = await client.query(
      `SELECT * FROM bookings 
       WHERE spot_id = $1 
       AND status = 'confirmed'
       AND (
         (start_time <= $2 AND end_time >= $2)
         OR (start_time <= $3 AND end_time >= $3)
         OR (start_time >= $2 AND end_time <= $3)
       )`,
      [spot_id, start_time, end_time]
    );

    if (conflictResult.rows.length > 0) {
      throw new Error('Time slot not available');
    }

    // Calculate total price
    const duration = (new Date(end_time) - new Date(start_time)) / (1000 * 60 * 60); // hours
    const total_price = duration * spotResult.rows[0].hourly_rate;

    // Create booking
    const result = await client.query(
      `INSERT INTO bookings 
       (spot_id, user_id, start_time, end_time, total_price, status)
       VALUES ($1, $2, $3, $4, $5, 'confirmed')
       RETURNING *`,
      [spot_id, req.user.id, start_time, end_time, total_price]
    );

    await client.query('COMMIT');

    res.status(201).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  } finally {
    client.release();
  }
});

// Cancel booking
router.post('/:id/cancel', auth, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { id } = req.params;

    // Check if booking exists and belongs to user
    const booking = await client.query(
      'SELECT * FROM bookings WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (booking.rows.length === 0) {
      throw new Error('Booking not found');
    }

    if (booking.rows[0].status !== 'confirmed') {
      throw new Error('Booking cannot be cancelled');
    }

    // Update booking status
    const result = await client.query(
      `UPDATE bookings 
       SET status = 'cancelled'
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    await client.query('COMMIT');

    res.json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  } finally {
    client.release();
  }
});

export { router as bookingRoutes };
