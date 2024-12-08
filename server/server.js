// server/server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import session from 'express-session';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

// Import routes
import { authRoutes } from './routes/auth.js';
import { protectedRoutes } from './routes/protected.js';
import { userRoutes } from './routes/user.js';

// Import middleware and utilities
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { auth } from './middleware/auth.js';
import { logger } from './services/logger.js';
import { initializeDatabase } from './db/pool.js';
import config from './config/server.config.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet(config.securityConfig));
app.use(compression(config.compressionConfig));

// CORS configuration
app.use(cors(config.corsConfig));

// Rate limiting
app.use('/api/', rateLimit(config.rateLimitConfig));

// Session configuration
app.use(session(config.sessionConfig));

// Request logging
app.use(morgan(config.morganConfig));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files configuration
const rootDir = path.join(__dirname, '..');

// Configure proper MIME types
express.static.mime.define({
  'application/javascript': ['js', 'mjs', 'jsx'],
  'text/javascript': ['js', 'mjs', 'jsx']
});

// API routes first
app.use('/api/auth', authRoutes);
app.use('/api/protected', auth, protectedRoutes);
app.use('/api/user', auth, userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files and handle client-side routing
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React build directory
  app.use(express.static(path.join(rootDir, 'dist'), {
    setHeaders: (res, path) => {
      if (path.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      } else if (path.endsWith('.jsx')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
    }
  }));
  
  // Handle React routing by serving index.html for all non-API routes
  app.get('/*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(rootDir, 'dist', 'index.html'));
    }
  });
} else {
  // In development, proxy requests to Vite dev server
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
      // Forward to Vite dev server (typically running on port 5173)
      res.redirect(`http://localhost:5173${req.path}`);
    } else {
      next();
    }
  });
}

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
  
  // Close database connections and perform cleanup
  try {
    await pool.end();
    console.log('Database connections closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();