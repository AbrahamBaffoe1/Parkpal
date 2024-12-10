// server/controllers/auth.controller.js

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.config.js';

// Helper function to generate tokens
const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES }
    );
    
    const refreshToken = jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES }
    );
    
    return { accessToken, refreshToken };
};

// Register endpoint
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log('Registration attempt with:', {
            name: name ? 'provided' : 'missing',
            email: email ? 'provided' : 'missing',
            password: password ? 'provided' : 'missing'
        });

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'All fields are required'
            });
        }

        // Check if user exists
        const userExists = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Email already registered'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        try {
            // Create user with schema-matching fields
            const result = await pool.query(
                `INSERT INTO users (
                    full_name,
                    email,
                    password_hash,
                    phone,
                    is_verified,
                    is_active
                ) VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id, full_name, email, is_verified, is_active, created_at, updated_at`,
                [
                    name.trim(),
                    email.toLowerCase(),
                    password_hash,
                    null,        // phone
                    false,       // is_verified
                    true        // is_active
                ]
            );

            const user = result.rows[0];
            console.log('User created successfully:', user);

            const { accessToken, refreshToken } = generateTokens(user.id);

            // Store refresh token
            await pool.query(
                `INSERT INTO refresh_tokens (
                    user_id,
                    token,
                    expires_at,
                    is_revoked
                ) VALUES ($1, $2, NOW() + INTERVAL '7 days', false)`,
                [user.id, refreshToken]
            );

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            return res.status(201).json({
                status: 'success',
                data: {
                    user: {
                        id: user.id,
                        name: user.full_name,  // Map full_name to name for frontend
                        email: user.email,
                        is_verified: user.is_verified,
                        is_active: user.is_active,
                        created_at: user.created_at,
                        updated_at: user.updated_at
                    },
                    token: accessToken
                }
            });

        } catch (dbError) {
            console.error('Database error details:', {
                code: dbError.code,
                message: dbError.message,
                detail: dbError.detail,
                constraint: dbError.constraint
            });
            throw dbError;
        }

    } catch (error) {
        console.error('Registration error:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        
        return res.status(500).json({
            status: 'error',
            message: 'Error creating user account',
            details: process.env.NODE_ENV === 'development' ? {
                error: error.message,
                code: error.code
            } : undefined
        });
    }
};

// Login endpoint
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email and password are required'
            });
        }

        // Get user using correct schema fields
        const result = await pool.query(
            `SELECT id, full_name, email, password_hash, is_active, is_verified, created_at, updated_at
             FROM users 
             WHERE email = $1`,
            [email.toLowerCase()]
        );

        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        if (!user.is_active) {
            return res.status(401).json({
                status: 'error',
                message: 'Account is deactivated'
            });
        }

        const { accessToken, refreshToken } = generateTokens(user.id);

        // Store refresh token
        await pool.query(
            `INSERT INTO refresh_tokens (user_id, token, expires_at, is_revoked)
             VALUES ($1, $2, NOW() + INTERVAL '7 days', false)
             ON CONFLICT (user_id) 
             DO UPDATE SET token = $2, expires_at = NOW() + INTERVAL '7 days'`,
            [user.id, refreshToken]
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            status: 'success',
            data: {
                user: {
                    id: user.id,
                    name: user.full_name,  // Map full_name to name for frontend
                    email: user.email,
                    is_verified: user.is_verified,
                    is_active: user.is_active,
                    created_at: user.created_at,
                    updated_at: user.updated_at
                },
                token: accessToken
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Login failed',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Refresh Token endpoint
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({
                status: 'error',
                message: 'Refresh token required'
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Check if token exists in database
        const result = await pool.query(
            `SELECT user_id FROM refresh_tokens 
             WHERE token = $1 AND expires_at > NOW() AND is_revoked = false`,
            [refreshToken]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid refresh token'
            });
        }

        // Generate new tokens
        const tokens = generateTokens(decoded.userId);

        // Update refresh token in database
        await pool.query(
            `UPDATE refresh_tokens 
             SET token = $1, expires_at = NOW() + INTERVAL '7 days'
             WHERE user_id = $2`,
            [tokens.refreshToken, decoded.userId]
        );

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            status: 'success',
            data: {
                token: tokens.accessToken
            }
        });

    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(401).json({
            status: 'error',
            message: 'Invalid refresh token'
        });
    }
};

// Logout endpoint
export const logout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (refreshToken) {
            // Delete refresh token from database
            await pool.query(
                'DELETE FROM refresh_tokens WHERE token = $1',
                [refreshToken]
            );
        }

        // Clear refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.json({
            status: 'success',
            message: 'Logged out successfully'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error during logout'
        });
    }
};