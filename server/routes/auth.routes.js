// server/routes/auth.routes.js
import express from 'express';
import { register, login, refreshToken, logout } from '../controllers/auth.controller.js';

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

export default router;