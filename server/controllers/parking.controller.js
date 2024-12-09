// server/controllers/parking.controller.js
import pool from '../config/db.config.js';

// Get all parking spots
export const getAllParkingSpots = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.full_name as owner_name
       FROM parking_spots p
       LEFT JOIN users u ON p.owner_id = u.id
       WHERE p.is_available = true
       ORDER BY p.created_at DESC`
    );

    res.json({
      status: 'success',
      data: {
        spots: result.rows
      }
    });
  } catch (error) {
    console.error('Get parking spots error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving parking spots'
    });
  }
};

// Create parking spot
export const createParkingSpot = async (req, res) => {
  try {
    const {
      name,
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
        (owner_id, name, address, city, state, zip_code, latitude, longitude, hourly_rate, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [req.user.id, name, address, city, state, zip_code, latitude, longitude, hourly_rate, description]
    );

    res.status(201).json({
      status: 'success',
      data: {
        spot: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Create parking spot error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating parking spot'
    });
  }
};

// Update parking spot
export const updateParkingSpot = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      address,
      city,
      state,
      zip_code,
      hourly_rate,
      description,
      is_available
    } = req.body;

    // Check if spot exists and belongs to user
    const spot = await pool.query(
      'SELECT * FROM parking_spots WHERE id = $1 AND owner_id = $2',
      [id, req.user.id]
    );

    if (spot.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Parking spot not found or unauthorized'
      });
    }

    const result = await pool.query(
      `UPDATE parking_spots 
       SET name = COALESCE($1, name),
           address = COALESCE($2, address),
           city = COALESCE($3, city),
           state = COALESCE($4, state),
           zip_code = COALESCE($5, zip_code),
           hourly_rate = COALESCE($6, hourly_rate),
           description = COALESCE($7, description),
           is_available = COALESCE($8, is_available),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 AND owner_id = $10
       RETURNING *`,
      [name, address, city, state, zip_code, hourly_rate, description, is_available, id, req.user.id]
    );

    res.json({
      status: 'success',
      data: {
        spot: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Update parking spot error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating parking spot'
    });
  }
};

// Delete parking spot
export const deleteParkingSpot = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if spot exists and belongs to user
    const spot = await pool.query(
      'SELECT * FROM parking_spots WHERE id = $1 AND owner_id = $2',
      [id, req.user.id]
    );

    if (spot.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Parking spot not found or unauthorized'
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
    console.error('Delete parking spot error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting parking spot'
    });
  }
};