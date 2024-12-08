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

// Main error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    name: err.name
  });

  // Handle specific error types
  switch (err.name) {
    case 'ValidationError':
      return res.status(400).json({
        status: 'error',
        message: 'Validation Error',
        errors: err.errors
      });

    case 'UnauthorizedError':
      return res.status(401).json({
        status: 'error',
        message: err.message || 'Unauthorized'
      });

    case 'SessionExpiredError':
      return res.status(401).json({
        status: 'error',
        message: err.message || 'Session has expired'
      });

    case 'DatabaseError':
      if (err.code === '23505') { // Unique violation
        return res.status(409).json({
          status: 'error',
          message: 'Resource already exists'
        });
      }
      break;

    default:
      // Default error response
      return res.status(err.status || 500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'production' 
          ? 'Internal Server Error'
          : err.message,
        ...(process.env.NODE_ENV === 'development' && {
          stack: err.stack
        })
      });
  }
};

// Custom error classes
export class ValidationError extends Error {
  constructor(errors) {
    super('Validation Error');
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
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

// Export all middleware and error classes
export const middleware = {
  requestLogger,
  checkAuth,
  notFoundHandler,
  errorHandler
};