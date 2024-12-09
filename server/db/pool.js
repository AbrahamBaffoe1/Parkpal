// db/pool.js
import pg from 'pg';
import dotenv from 'dotenv';
import { logger } from '../services/logger.js';

dotenv.config();

const { Pool } = pg;

// Pool configuration with empty password
const poolConfig = {
  user: 'kwamebaffoe',
  host: 'localhost',
  database: 'parkpal_db',
  password: '', // Empty string password
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
};

// Create pool instance
const pool = new Pool(poolConfig);

// Log connection status
pool.on('connect', () => {
  logger.info('Connected to the database');
});

// Error handling for idle clients
pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
});

// Database initialization function
export async function initializeDatabase() {
  let client;
  try {
    client = await pool.connect();
    // Test connection
    await client.query('SELECT NOW()');
    logger.info('Database connection test successful');
    
    return true;
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  } finally {
    if (client) client.release();
  }
}

// Export the pool for use in other modules
export { pool };