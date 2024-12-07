// server/models/user.js
import { db } from '../db/init.js';
import bcrypt from 'bcrypt';

export class User {
    // Create a new user
    static async create({ name, email, password, phone }) {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Insert user
            const result = await client.query(
                `INSERT INTO users (name, email, password, phone)
                 VALUES ($1, $2, $3, $4)
                 RETURNING id, name, email, phone, is_verified, created_at`,
                [name, email, hashedPassword, phone]
            );

            // Add default user role
            await client.query(
                `INSERT INTO user_roles (user_id, role_id)
                 SELECT $1, id FROM roles WHERE name = 'user'`,
                [result.rows[0].id]
            );

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            if (error.code === '23505') { // unique_violation error code
                throw new Error('Email already exists');
            }
            throw error;
        } finally {
            client.release();
        }
    }

    // Find user by ID
    static async findById(id) {
        const result = await db.query(
            `SELECT u.id, u.name, u.email, u.phone, u.avatar_url, u.is_verified, u.is_active, u.created_at,
                    array_agg(r.name) as roles
             FROM users u
             LEFT JOIN user_roles ur ON u.id = ur.user_id
             LEFT JOIN roles r ON ur.role_id = r.id
             WHERE u.id = $1 AND u.is_active = true
             GROUP BY u.id`,
            [id]
        );
        return result.rows[0];
    }

    // Find user by email
    static async findByEmail(email) {
        const result = await db.query(
            `SELECT u.*, array_agg(r.name) as roles
             FROM users u
             LEFT JOIN user_roles ur ON u.id = ur.user_id
             LEFT JOIN roles r ON ur.role_id = r.id
             WHERE u.email = $1 AND u.is_active = true
             GROUP BY u.id`,
            [email]
        );
        return result.rows[0];
    }

    // Update user
    static async update(id, updates) {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            const allowedUpdates = ['name', 'phone', 'avatar_url'];
            const updateFields = [];
            const values = [];
            let paramCount = 1;

            // Build update query dynamically
            Object.keys(updates).forEach(key => {
                if (allowedUpdates.includes(key)) {
                    updateFields.push(`${key} = $${paramCount}`);
                    values.push(updates[key]);
                    paramCount++;
                }
            });

            if (updateFields.length === 0) {
                throw new Error('No valid update fields provided');
            }

            values.push(id);
            const result = await client.query(
                `UPDATE users
                 SET ${updateFields.join(', ')}
                 WHERE id = $${paramCount} AND is_active = true
                 RETURNING id, name, email, phone, avatar_url, is_verified, created_at`,
                values
            );

            if (result.rows.length === 0) {
                throw new Error('User not found');
            }

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // Delete user (soft delete)
    static async delete(id) {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            const result = await client.query(
                `UPDATE users
                 SET is_active = false
                 WHERE id = $1 AND is_active = true
                 RETURNING id`,
                [id]
            );

            if (result.rows.length === 0) {
                throw new Error('User not found');
            }

            await client.query('COMMIT');
            return true;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // Verify user's password
    static async verifyPassword(user, password) {
        return await bcrypt.compare(password, user.password);
    }

    // Change password
    static async changePassword(id, oldPassword, newPassword) {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            // Get current user with password
            const user = await client.query(
                'SELECT * FROM users WHERE id = $1 AND is_active = true',
                [id]
            );

            if (user.rows.length === 0) {
                throw new Error('User not found');
            }

            // Verify old password
            const isValid = await bcrypt.compare(oldPassword, user.rows[0].password);
            if (!isValid) {
                throw new Error('Invalid password');
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update password
            await client.query(
                'UPDATE users SET password = $1 WHERE id = $2',
                [hashedPassword, id]
            );

            await client.query('COMMIT');
            return true;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // Get user roles
    static async getRoles(id) {
        const result = await db.query(
            `SELECT r.name
             FROM roles r
             JOIN user_roles ur ON r.id = ur.role_id
             WHERE ur.user_id = $1`,
            [id]
        );
        return result.rows.map(row => row.name);
    }
}

// server/models/parking.js
export const ParkingModel = {
  async create(spotData) {
    const {
      owner_id,
      address,
      city,
      state,
      zip_code,
      latitude,
      longitude,
      hourly_rate,
      description
    } = spotData;

    const result = await db.query(
      `INSERT INTO parking_spots 
       (owner_id, address, city, state, zip_code, latitude, longitude, hourly_rate, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [owner_id, address, city, state, zip_code, latitude, longitude, hourly_rate, description]
    );
    return result.rows[0];
  },

  async findNearby(latitude, longitude, radius) {
    const result = await db.query(
      `SELECT *, 
       point($1, $2) <@> point(latitude, longitude) as distance
       FROM parking_spots
       WHERE is_available = true
       AND point($1, $2) <@> point(latitude, longitude) < $3
       ORDER BY distance`,
      [latitude, longitude, radius]
    );
    return result.rows;
  }
};

// server/models/booking.js
export const BookingModel = {
  async create({ spot_id, user_id, start_time, end_time, total_price }) {
    const result = await db.query(
      `INSERT INTO bookings 
       (spot_id, user_id, start_time, end_time, total_price, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING *`,
      [spot_id, user_id, start_time, end_time, total_price]
    );
    return result.rows[0];
  },

  async updateStatus(id, status) {
    const result = await db.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  },

  async findUserBookings(user_id) {
    const result = await db.query(
      `SELECT b.*, ps.address, ps.city, ps.hourly_rate
       FROM bookings b
       JOIN parking_spots ps ON b.spot_id = ps.id
       WHERE b.user_id = $1
       ORDER BY b.start_time DESC`,
      [user_id]
    );
    return result.rows;
  }
};