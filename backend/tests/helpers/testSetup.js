const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

class TestSetup {
  constructor() {
    this.server = null;
    this.db = null;
    this.testUser = null;
    this.testOrganization = null;
  }

  async createServer() {
    const server = Hapi.server({
      port: 0, // Use random port
      host: 'localhost',
      routes: {
        cors: {
          origin: ['*'],
          credentials: true
        }
      }
    });

    // Register JWT plugin
    await server.register(Jwt);

    // Add JWT strategy
    server.auth.strategy('jwt', 'jwt', {
      keys: process.env.JWT_SECRET || 'test-jwt-secret',
      verify: {
        aud: false,
        iss: false,
        sub: false,
        maxAgeSec: 14400
      },
      validate: async (artifacts, request, h) => {
        const { userId, email, role, organizationId } = artifacts.decoded.payload;
        return {
          isValid: true,
          credentials: {
            id: userId,
            email,
            role,
            organizationId,
            userId
          }
        };
      }
    });

    server.auth.default('jwt');

    this.server = server;
    return server;
  }

  async createTestDatabase() {
    const testDbConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.TEST_DB_NAME || 'project_management',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '17101997'
    };

    this.db = new Pool(testDbConfig);

    // Test connection
    try {
      await this.db.query('SELECT NOW()');
      console.log('✅ Test database connected');
    } catch (error) {
      console.error('❌ Test database connection failed:', error.message);
      throw error;
    }

    return this.db;
  }

  async createTestOrganization() {
    const orgData = {
      name: 'Test Organization',
      slug: 'test-org',
      phone: '+1234567890',
      address: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      postal_code: '12345',
      country: 'Test Country',
      website: 'https://test.com',
      industry: 'Technology',
      size: '10-50',
      status: 'active'
    };

    const query = `
      INSERT INTO organizations (name, slug, phone, address, city, state, postal_code, country, website, industry, size, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const values = Object.values(orgData);
    const result = await this.db.query(query, values);
    this.testOrganization = result.rows[0];

    return this.testOrganization;
  }

  async createTestUser(organizationId = null) {
    const orgId = organizationId || this.testOrganization?.id;
    if (!orgId) {
      throw new Error('Organization ID required for test user creation');
    }

    const userData = {
      organization_id: orgId,
      email: 'test@example.com',
      password: '$2b$10$test.hash.for.testing',
      first_name: 'Test',
      last_name: 'User',
      role: 'admin',
      is_active: true,
      email_verified: true
    };

    const query = `
      INSERT INTO users (organization_id, email, password, first_name, last_name, role, is_active, email_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = Object.values(userData);
    const result = await this.db.query(query, values);
    this.testUser = result.rows[0];

    return this.testUser;
  }

  generateAuthToken(user = null) {
    const testUser = user || this.testUser;
    if (!testUser) {
      throw new Error('Test user required for token generation');
    }

    const payload = {
      userId: testUser.id,
      email: testUser.email,
      role: testUser.role,
      organizationId: testUser.organization_id
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'test-jwt-secret', { expiresIn: '4h' });
  }

  async cleanup() {
    if (this.db) {
      await this.db.end();
    }
    if (this.server) {
      await this.server.stop();
    }
  }

  async clearTestData() {
    if (!this.db) return;

    const tables = [
      'quotation_items',
      'quotations',
      'projects',
      'clients',
      'users',
      'organizations'
    ];

    for (const table of tables) {
      try {
        await this.db.query(`DELETE FROM ${table} WHERE id IS NOT NULL`);
      } catch (error) {
        console.warn(`Warning: Could not clear table ${table}:`, error.message);
      }
    }
  }
}

module.exports = TestSetup;
