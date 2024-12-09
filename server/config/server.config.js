// config/server.config.js
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { pool } from '../db/pool.js';

const isProduction = process.env.NODE_ENV === 'production';
const ONE_HOUR = 3600000;
const ONE_DAY = ONE_HOUR * 24;

// Enhanced rate limiting configuration
export const rateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isProduction ? 100 : 1000, // Limit each IP
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting for health checks
        return req.path === '/health';
    },
    keyGenerator: (req) => {
        // Use X-Forwarded-For header if behind proxy, else IP
        return req.headers['x-forwarded-for'] || req.ip;
    }
};

// Enhanced session configuration with security best practices
export const sessionConfig = {
    store: new (connectPgSimple(session))({
        pool,
        tableName: 'session',
        createTableIfMissing: true,
        pruneSessionInterval: 60,
        errorLog: console.error
    }),
    name: 'sid', // Changed from default 'connect.sid'
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true, // Refresh session with each request
    cookie: {
        maxAge: ONE_DAY,
        secure: isProduction,
        httpOnly: true,
        sameSite: 'lax',
        domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
        path: '/'
    },
    proxy: isProduction // Trust proxy in production
};

// Enhanced security configuration
export const securityConfig = {
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'", process.env.API_URL, process.env.FRONTEND_URL],
            fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
            sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin']
        }
    },
    crossOriginEmbedderPolicy: isProduction,
    crossOriginOpenerPolicy: isProduction,
    crossOriginResourcePolicy: { 
        policy: isProduction ? "same-origin" : "cross-origin" 
    },
    dnsPrefetchControl: true,
    frameguard: { 
        action: "deny" 
    },
    hidePoweredBy: true,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { 
        policy: "strict-origin-when-cross-origin" 
    },
    xssFilter: true
};

// Enhanced CORS configuration
export const corsConfig = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            'http://localhost:5173',
            'http://localhost:3000'
        ];
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin'
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600 // Cache preflight requests for 10 minutes
};

// Enhanced compression configuration
export const compressionConfig = {
    level: 6,
    threshold: 1024, // Only compress responses bigger than 1KB
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
};

// Enhanced logging configuration
export const morganConfig = isProduction 
    ? 'combined'
    : ':method :url :status :response-time ms - :res[content-length]';

// Export default configuration
export default {
    rateLimitConfig,
    sessionConfig,
    securityConfig,
    corsConfig,
    compressionConfig,
    morganConfig
};