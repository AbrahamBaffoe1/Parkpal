// server/middleware/errorHandler.js

// Request logger middleware
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

// Authentication check middleware
export const checkAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required'
    });
  }
  next();
};

// Not found handler middleware
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Resource not found'
  });
};

// Custom error classes
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

export class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.status = 401;
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

export class DatabaseError extends Error {
  constructor(message = 'Database error occurred') {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class SessionExpiredError extends Error {
  constructor(message = 'Session has expired') {
    super(message);
    this.name = 'SessionExpiredError';
  }
}

import { logger } from '../services/logger.js';

export const asyncHandler = fn => (req, res, next) => {
  return Promise
    .resolve(fn(req, res, next))
    .catch(next);
};

export const errorHandler = (err, req, res, next) => {
  // If headers already sent, delegate to default Express error handler
  if (res.headersSent) {
    return next(err);
  }

  // Log error
  logger.error('Error:', {
    message: err.message,
    name: err.name,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Handle specific error types
  let status = 500;
  let message = 'Internal Server Error';

  if (err instanceof ValidationError) {
    status = err.status;
    message = err.message;
  } else if (err.code === '23505') { // Unique violation
    status = 409;
    message = 'Resource already exists';
  }

  // Send response
  res.status(status).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && {
      details: {
        name: err.name,
        code: err.code,
        stack: err.stack
      }
    })
  });
};

// Export all middleware and error classes
export const middleware = {
  requestLogger,
  checkAuth,
  notFoundHandler,
  errorHandler
};