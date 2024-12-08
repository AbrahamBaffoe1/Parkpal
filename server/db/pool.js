// db/pool.js
import pg from 'pg';
import dotenv from 'dotenv';
import { logger } from '../services/logger.js';

dotenv.config();

const { Pool } = pg;

// Simple pool configuration for passwordless PostgreSQL
const poolConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'parkpal',
  port: parseInt(process.env.DB_PORT, 10) || 5432
};

// Create pool
const pool = new Pool(poolConfig);

// Error handling
pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Initialize database
export async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Create session table
    await client.query(`
      DROP TABLE IF EXISTS session;
      CREATE TABLE IF NOT EXISTS session (
        sid VARCHAR NOT NULL COLLATE "default" PRIMARY KEY,
        sess JSON NOT NULL,
        expire TIMESTAMP(6) NOT NULL
      );
      CREATE INDEX IF NOT EXISTS IDX_session_expire ON session (expire);
    `);

    logger.info('Database initialized successfully');
    return true;
  } catch (error) {
    logger.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

export { pool };