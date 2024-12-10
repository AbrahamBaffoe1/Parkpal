// auth.routes.js
import express from 'express';
import { register, login, refreshToken, logout } from '../controllers/auth.controller.js';
import pool from '../config/db.config.js';

const router = express.Router();

// Validation middleware
const validateRegistration = (req, res, next) => {
    const { name, email, password } = req.body;

    // Log the incoming request body (excluding sensitive info)
    console.log('Registration request received:', {
        name: name ? 'provided' : 'missing',
        email: email ? 'provided' : 'missing',
        password: password ? 'provided' : 'missing'
    });

    // Check if all required fields are present
    if (!name || !email || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'All fields are required',
            details: {
                name: !name ? 'Name is required' : null,
                email: !email ? 'Email is required' : null,
                password: !password ? 'Password is required' : null
            }
        });
    }

    // Validate name
    if (typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid name format',
            details: 'Name must be at least 2 characters long'
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid email format'
        });
    }

    // Validate password
    if (typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid password',
            details: 'Password must be at least 8 characters long'
        });
    }

    next();
};

// Validation middleware for login
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'Email and password are required'
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid email format'
        });
    }

    next();
};

// Error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
        console.error('Route error:', {
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
        
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    });
};

// Database test endpoint
router.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            status: 'success',
            message: 'Database connection successful',
            timestamp: result.rows[0].now
        });
    } catch (error) {
        console.error('Database test error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'Auth service is running',
        timestamp: new Date().toISOString()
    });
});

// Auth routes with validation and error handling
router.post('/register', validateRegistration, asyncHandler(register));
router.post('/login', validateLogin, asyncHandler(login));
router.post('/refresh', asyncHandler(refreshToken));
router.post('/logout', asyncHandler(logout));

// Export the router as default
export default router;