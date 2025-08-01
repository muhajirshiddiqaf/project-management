const request = require('supertest');
const bcrypt = require('bcrypt');
const TestSetup = require('../helpers/testSetup');

describe('Authentication Integration Tests', () => {
  let testSetup;
  let server;
  let db;

  beforeAll(async () => {
    testSetup = new TestSetup();
    server = await testSetup.createServer();
    db = await testSetup.createTestDatabase();

    // Register auth routes
    const authModule = require('../../src/modules/auth');
    const authValidator = require('../../src/modules/auth/validator');
    const { UserRepository } = require('../../src/infrastructure/repositories');

    const userRepository = new UserRepository(db);

    await server.register({
      plugin: authModule,
      options: {
        service: userRepository,
        validator: authValidator,
        auth: 'jwt'
      },
      routes: { prefix: '/api' }
    });
  });

  afterAll(async () => {
    await testSetup.cleanup();
  });

  beforeEach(async () => {
    await testSetup.clearTestData();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        organization_name: 'New Company',
        organization_slug: 'new-company'
      };

      const response = await request(server.listener)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data.first_name).toBe(userData.first_name);
      expect(response.body.data.last_name).toBe(userData.last_name);
      expect(response.body.data.organization_id).toBeDefined();
      expect(response.body.data.role).toBe('admin');
      expect(response.body.data.is_active).toBe(true);
    });

    it('should return 400 for invalid email format', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        organization_name: 'New Company',
        organization_slug: 'new-company'
      };

      const response = await request(server.listener)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email');
    });

    it('should return 400 for weak password', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: '123',
        first_name: 'John',
        last_name: 'Doe',
        organization_name: 'New Company',
        organization_slug: 'new-company'
      };

      const response = await request(server.listener)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('password');
    });

    it('should return 409 for duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        organization_name: 'New Company',
        organization_slug: 'new-company'
      };

      // Register first user
      await request(server.listener)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Try to register with same email
      const response = await request(server.listener)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create test organization and user
      await testSetup.createTestOrganization();
      await testSetup.createTestUser();
    });

    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      // First, update the test user with a proper password hash
      const hashedPassword = await bcrypt.hash('password123', 10);
      await db.query(
        'UPDATE users SET password = $1 WHERE email = $2',
        [hashedPassword, 'test@example.com']
      );

      const response = await request(server.listener)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.user.role).toBe('admin');
    });

    it('should return 401 for invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(server.listener)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should return 401 for invalid password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(server.listener)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should return 400 for missing email', async () => {
      const loginData = {
        password: 'password123'
      };

      const response = await request(server.listener)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email');
    });

    it('should return 400 for missing password', async () => {
      const loginData = {
        email: 'test@example.com'
      };

      const response = await request(server.listener)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('password');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const token = testSetup.generateAuthToken();

      const response = await request(server.listener)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('logged out');
    });

    it('should return 401 without token', async () => {
      const response = await request(server.listener)
        .post('/api/auth/logout')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user profile', async () => {
      const testUser = await testSetup.createTestUser();
      const token = testSetup.generateAuthToken(testUser);

      const response = await request(server.listener)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.data.first_name).toBe(testUser.first_name);
      expect(response.body.data.last_name).toBe(testUser.last_name);
    });

    it('should return 401 without token', async () => {
      const response = await request(server.listener)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
