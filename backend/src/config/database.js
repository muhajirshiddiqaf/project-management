const { Pool } = require('pg');
const config = require('./index');

class Database {
  constructor() {
    this.pool = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.pool = new Pool({
        connectionString: config.database.url,
        max: 20, // Maximum number of clients in the pool
        idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
        connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
        ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
      });

      // Test the connection
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();

      this.isConnected = true;
      console.log('✅ Database connected successfully');

      // Handle pool errors
      this.pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
        this.isConnected = false;
      });

    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect() {
    if (this.pool) {
      await this.pool.end();
      this.isConnected = false;
      console.log('✅ Database disconnected');
    }
  }

  async query(text, params) {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    try {
      const start = Date.now();
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;

      // Log slow queries in development
      if (config.nodeEnv === 'development' && duration > 100) {
        console.log(`🐌 Slow query (${duration}ms):`, text);
      }

      return result;
    } catch (error) {
      console.error('❌ Database query error:', error.message);
      throw error;
    }
  }

  async transaction(callback) {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Health check
  async healthCheck() {
    try {
      const result = await this.query('SELECT NOW() as timestamp');
      return {
        status: 'healthy',
        timestamp: result.rows[0].timestamp,
        isConnected: this.isConnected,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        isConnected: this.isConnected,
      };
    }
  }

  // Get pool stats
  getPoolStats() {
    if (!this.pool) return null;

    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
    };
  }
}

// Create singleton instance
const database = new Database();

module.exports = database;
