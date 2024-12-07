// server/routes/parkingSpots.js
import express from 'express';
import { auth } from '../middleware/auth.js';
import { pool } from '../db/pool.js';

const router = express.Router();

// Get all parking spots with optional filters
router.get('/', async (req, res) => {
  try {
    const { city, maxPrice, available } = req.query;
    let query = 'SELECT * FROM parking_spots WHERE 1=1';
    const values = [];
    let valueIndex = 1;

    if (city) {
      query += ` AND LOWER(city) = LOWER($${valueIndex})`;
      values.push(city);
      valueIndex++;
    }

    if (maxPrice) {
      query += ` AND hourly_rate <= $${valueIndex}`;
      values.push(maxPrice);
      valueIndex++;
    }

    if (available) {
      query += ` AND is_available = $${valueIndex}`;
      values.push(available === 'true');
      valueIndex++;
    }

    const result = await pool.query(query, values);
    res.json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching parking spots'
    });
  }
});

// Get parking spot by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM parking_spots WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Parking spot not found'
      });
    }

    res.json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching parking spot'
    });
  }
});

// Create new parking spot (protected route)
router.post('/', auth, async (req, res) => {
  try {
    const {
      address,
      city,
      state,
      zip_code,
      latitude,
      longitude,
      hourly_rate,
      description
    } = req.body;

    const result = await pool.query(
      `INSERT INTO parking_spots 
      (owner_id, address, city, state, zip_code, latitude, longitude, hourly_rate, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [req.user.id, address, city, state, zip_code, latitude, longitude, hourly_rate, description]
    );

    res.status(201).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error creating parking spot'
    });
  }
});

// Update parking spot (protected route)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      address,
      city,
      state,
      zip_code,
      latitude,
      longitude,
      hourly_rate,
      description,
      is_available
    } = req.body;

    // Check if user owns the parking spot
    const spot = await pool.query(
      'SELECT * FROM parking_spots WHERE id = $1 AND owner_id = $2',
      [id, req.user.id]
    );

    if (spot.rows.length === 0) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this parking spot'
      });
    }

    const result = await pool.query(
      `UPDATE parking_spots 
      SET address = $1, city = $2, state = $3, zip_code = $4,
          latitude = $5, longitude = $6, hourly_rate = $7,
          description = $8, is_available = $9
      WHERE id = $10 AND owner_id = $11
      RETURNING *`,
      [address, city, state, zip_code, latitude, longitude,
       hourly_rate, description, is_available, id, req.user.id]
    );

    res.json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating parking spot'
    });
  }
});

// Delete parking spot (protected route)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user owns the parking spot
    const spot = await pool.query(
      'SELECT * FROM parking_spots WHERE id = $1 AND owner_id = $2',
      [id, req.user.id]
    );

    if (spot.rows.length === 0) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this parking spot'
      });
    }

    await pool.query(
      'DELETE FROM parking_spots WHERE id = $1 AND owner_id = $2',
      [id, req.user.id]
    );

    res.json({
      status: 'success',
      message: 'Parking spot deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting parking spot'
    });
  }
});

export { router as parkingSpotRoutes };
