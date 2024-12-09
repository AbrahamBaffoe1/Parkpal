// models/user.js
import { pool } from '../db/pool.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export class User {
    // Enhanced password hashing with proper salt rounds
    static async hashPassword(password) {
        const SALT_ROUNDS = 12;
        return await bcrypt.hash(password, SALT_ROUNDS);
    }

    // Create a new user with transaction
    static async create({ name, email, password, phone }) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('Invalid email format');
            }

            // Hash password with enhanced security
            const hashedPassword = await this.hashPassword(password);

            // Generate verification token
            const verificationToken = crypto.randomBytes(32).toString('hex');

            const userResult = await client.query(
                `INSERT INTO users (
                    full_name, email, password_hash, phone, verification_token
                ) VALUES ($1, $2, $3, $4, $5)
                RETURNING id, full_name, email, phone, is_verified, created_at`,
                [name, email.toLowerCase(), hashedPassword, phone, verificationToken]
            );

            // Add default user role with error handling
            const roleResult = await client.query(
                `INSERT INTO user_roles (user_id, role_id)
                SELECT $1, id FROM roles WHERE name = 'user'
                RETURNING role_id`,
                [userResult.rows[0].id]
            );

            if (!roleResult.rows.length) {
                throw new Error('Failed to assign default role');
            }

            await client.query('COMMIT');
            return {
                ...userResult.rows[0],
                verificationToken
            };
        } catch (error) {
            await client.query('ROLLBACK');
            if (error.code === '23505') {
                throw new Error('Email already registered');
            }
            throw error;
        } finally {
            client.release();
        }
    }

    // Enhanced password verification with timing attack protection
    static async verifyPassword(hashedPassword, plainTextPassword) {
        try {
            return await bcrypt.compare(plainTextPassword, hashedPassword);
        } catch (error) {
            return false;
        }
    }

    // Secure password change with validation
    static async changePassword(userId, oldPassword, newPassword) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const userResult = await client.query(
                'SELECT password_hash FROM users WHERE id = $1 AND is_active = true',
                [userId]
            );

            if (!userResult.rows.length) {
                throw new Error('User not found');
            }

            const isValidOld = await this.verifyPassword(
                userResult.rows[0].password_hash,
                oldPassword
            );

            if (!isValidOld) {
                throw new Error('Current password is incorrect');
            }

            // Password strength validation
            if (newPassword.length < 8) {
                throw new Error('Password must be at least 8 characters long');
            }

            const hashedNewPassword = await this.hashPassword(newPassword);

            await client.query(
                `UPDATE users 
                SET password_hash = $1,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $2`,
                [hashedNewPassword, userId]
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

    // Find user by ID with role information
    static async findById(id) {
        const result = await pool.query(
            `SELECT 
                u.id,
                u.full_name,
                u.email,
                u.phone,
                u.is_verified,
                u.created_at,
                ARRAY_AGG(DISTINCT r.name) as roles
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            WHERE u.id = $1 AND u.is_active = true
            GROUP BY u.id`,
            [id]
        );
        return result.rows[0];
    }

    // Find user by email with role information
    static async findByEmail(email) {
        const result = await pool.query(
            `SELECT 
                u.*,
                ARRAY_AGG(DISTINCT r.name) as roles
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            WHERE u.email = $1 AND u.is_active = true
            GROUP BY u.id`,
            [email.toLowerCase()]
        );
        return result.rows[0];
    }
}