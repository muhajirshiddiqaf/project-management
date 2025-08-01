const request = require('supertest');
const TestSetup = require('../helpers/testSetup');

describe('Client Integration Tests', () => {
  let testSetup;
  let server;
  let db;
  let authToken;

  beforeAll(async () => {
    testSetup = new TestSetup();
    server = await testSetup.createServer();
    db = await testSetup.createTestDatabase();

    // Register client routes
    const clientModule = require('../../src/modules/client');
    const clientValidator = require('../../src/modules/client/validator');
    const { ClientRepository } = require('../../src/infrastructure/repositories');

    const clientRepository = new ClientRepository(db);

    await server.register({
      plugin: clientModule,
      options: {
        service: clientRepository,
        validator: clientValidator,
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

    // Create test organization and user for authentication
    await testSetup.createTestOrganization();
    const testUser = await testSetup.createTestUser();
    authToken = testSetup.generateAuthToken(testUser);
  });

  describe('POST /api/clients', () => {
    it('should create a new client successfully', async () => {
      const clientData = {
        name: 'Test Client',
        email: 'client@example.com',
        phone: '+1234567890',
        address: '123 Client St',
        city: 'Client City',
        state: 'Client State',
        postal_code: '12345',
        country: 'Client Country',
        website: 'https://client.com',
        industry: 'Technology',
        billing_name: 'Test Client Billing',
        billing_address: '456 Billing Ave',
        billing_city: 'Billing City',
        billing_state: 'Billing State',
        billing_postal_code: '54321',
        billing_country: 'Billing Country',
        billing_email: 'billing@client.com',
        billing_phone: '+0987654321'
      };

      const response = await request(server.listener)
        .post('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .send(clientData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(clientData.name);
      expect(response.body.data.email).toBe(clientData.email);
      expect(response.body.data.phone).toBe(clientData.phone);
      expect(response.body.data.billing_name).toBe(clientData.billing_name);
      expect(response.body.data.billing_email).toBe(clientData.billing_email);
      expect(response.body.data.organization_id).toBeDefined();
    });

    it('should return 400 for missing required fields', async () => {
      const clientData = {
        email: 'client@example.com',
        phone: '+1234567890'
        // Missing name
      };

      const response = await request(server.listener)
        .post('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .send(clientData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('name');
    });

    it('should return 400 for invalid email format', async () => {
      const clientData = {
        name: 'Test Client',
        email: 'invalid-email',
        phone: '+1234567890'
      };

      const response = await request(server.listener)
        .post('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .send(clientData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email');
    });

    it('should return 401 without authentication', async () => {
      const clientData = {
        name: 'Test Client',
        email: 'client@example.com',
        phone: '+1234567890'
      };

      const response = await request(server.listener)
        .post('/api/clients')
        .send(clientData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/clients', () => {
    beforeEach(async () => {
      // Create test clients
      const clientData1 = {
        name: 'Client 1',
        email: 'client1@example.com',
        phone: '+1234567890',
        organization_id: testSetup.testOrganization.id
      };

      const clientData2 = {
        name: 'Client 2',
        email: 'client2@example.com',
        phone: '+0987654321',
        organization_id: testSetup.testOrganization.id
      };

      await db.query(
        'INSERT INTO clients (name, email, phone, organization_id) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)',
        [
          clientData1.name, clientData1.email, clientData1.phone, clientData1.organization_id,
          clientData2.name, clientData2.email, clientData2.phone, clientData2.organization_id
        ]
      );
    });

    it('should return all clients for the organization', async () => {
      const response = await request(server.listener)
        .get('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('email');
      expect(response.body.pagination).toBeDefined();
    });

    it('should support pagination', async () => {
      const response = await request(server.listener)
        .get('/api/clients?page=1&limit=1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(1);
      expect(response.body.pagination.total).toBe(2);
    });

    it('should support search', async () => {
      const response = await request(server.listener)
        .get('/api/clients?search=Client 1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Client 1');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(server.listener)
        .get('/api/clients')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/clients/{id}', () => {
    let testClient;

    beforeEach(async () => {
      // Create test client
      const clientData = {
        name: 'Test Client',
        email: 'client@example.com',
        phone: '+1234567890',
        organization_id: testSetup.testOrganization.id
      };

      const result = await db.query(
        'INSERT INTO clients (name, email, phone, organization_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [clientData.name, clientData.email, clientData.phone, clientData.organization_id]
      );
      testClient = result.rows[0];
    });

    it('should return client by id', async () => {
      const response = await request(server.listener)
        .get(`/api/clients/${testClient.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testClient.id);
      expect(response.body.data.name).toBe(testClient.name);
      expect(response.body.data.email).toBe(testClient.email);
    });

    it('should return 404 for non-existent client', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await request(server.listener)
        .get(`/api/clients/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(server.listener)
        .get(`/api/clients/${testClient.id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/clients/{id}', () => {
    let testClient;

    beforeEach(async () => {
      // Create test client
      const clientData = {
        name: 'Original Client',
        email: 'original@example.com',
        phone: '+1234567890',
        organization_id: testSetup.testOrganization.id
      };

      const result = await db.query(
        'INSERT INTO clients (name, email, phone, organization_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [clientData.name, clientData.email, clientData.phone, clientData.organization_id]
      );
      testClient = result.rows[0];
    });

    it('should update client successfully', async () => {
      const updateData = {
        name: 'Updated Client',
        email: 'updated@example.com',
        phone: '+0987654321',
        billing_name: 'Updated Billing Name',
        billing_email: 'billing@updated.com'
      };

      const response = await request(server.listener)
        .put(`/api/clients/${testClient.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.email).toBe(updateData.email);
      expect(response.body.data.phone).toBe(updateData.phone);
      expect(response.body.data.billing_name).toBe(updateData.billing_name);
      expect(response.body.data.billing_email).toBe(updateData.billing_email);
    });

    it('should return 404 for non-existent client', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const updateData = { name: 'Updated Client' };

      const response = await request(server.listener)
        .put(`/api/clients/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should return 400 for invalid data', async () => {
      const updateData = {
        email: 'invalid-email'
      };

      const response = await request(server.listener)
        .put(`/api/clients/${testClient.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email');
    });
  });

  describe('DELETE /api/clients/{id}', () => {
    let testClient;

    beforeEach(async () => {
      // Create test client
      const clientData = {
        name: 'Test Client',
        email: 'client@example.com',
        phone: '+1234567890',
        organization_id: testSetup.testOrganization.id
      };

      const result = await db.query(
        'INSERT INTO clients (name, email, phone, organization_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [clientData.name, clientData.email, clientData.phone, clientData.organization_id]
      );
      testClient = result.rows[0];
    });

    it('should delete client successfully', async () => {
      const response = await request(server.listener)
        .delete(`/api/clients/${testClient.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted');

      // Verify client is deleted
      const getResponse = await request(server.listener)
        .get(`/api/clients/${testClient.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent client', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await request(server.listener)
        .delete(`/api/clients/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });
});
