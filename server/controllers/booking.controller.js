// server/controllers/booking.controller.js
import pool from '../config/db.config.js';

// Create booking
export const createBooking = async (req, res) => {
  try {
    const { spot_id, start_time, end_time } = req.body;

    // Check if spot exists and is available
    const spotResult = await pool.query(
      'SELECT hourly_rate FROM parking_spots WHERE id = $1 AND is_available = true',
      [spot_id]
    );

    if (spotResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Parking spot not found or unavailable'
      });
    }

    // Calculate total price
    const hourlyRate = spotResult.rows[0].hourly_rate;
    const hours = (new Date(end_time) - new Date(start_time)) / (1000 * 60 * 60);
    const totalPrice = hourlyRate * hours;

    const result = await pool.query(
      `INSERT INTO bookings (spot_id, user_id, start_time, end_time, total_price)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [spot_id, req.user.id, start_time, end_time, totalPrice]
    );

    res.status(201).json({
      status: 'success',
      data: {
        booking: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating booking'
    });
  }
};

// Get user's bookings
export const getUserBookings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, p.name as spot_name, p.address, p.city, p.state
       FROM bookings b
       JOIN parking_spots p ON b.spot_id = p.id
       WHERE b.user_id = $1
       ORDER BY b.start_time DESC`,
      [req.user.id]
    );

    res.json({
      status: 'success',
      data: {
        bookings: result.rows
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving bookings'
    });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid booking status'
      });
    }

    const result = await pool.query(
      `UPDATE bookings 
       SET status = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [status, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found or unauthorized'
      });
    }

    res.json({
      status: 'success',
      data: {
        booking: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating booking'
    });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE bookings 
       SET status = 'cancelled',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2 AND status = 'pending'
       RETURNING *`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found, unauthorized, or cannot be cancelled'
      });
    }

    res.json({
      status: 'success',
      data: {
        booking: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error cancelling booking'
    });
  }
};