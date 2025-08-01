const request = require('supertest');
const TestSetup = require('../helpers/testSetup');

describe('Project Integration Tests', () => {
  let testSetup;
  let server;
  let db;
  let authToken;
  let testClient;

  beforeAll(async () => {
    testSetup = new TestSetup();
    server = await testSetup.createServer();
    db = await testSetup.createTestDatabase();

    // Register project routes
    const projectModule = require('../../src/modules/project');
    const projectValidator = require('../../src/modules/project/validator');
    const { ProjectRepository } = require('../../src/infrastructure/repositories');

    const projectRepository = new ProjectRepository(db);

    await server.register({
      plugin: projectModule,
      options: {
        service: projectRepository,
        validator: projectValidator,
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

  describe('POST /api/projects', () => {
    it('should create a new project successfully', async () => {
      const projectData = {
        name: 'Test Project',
        description: 'A test project description',
        client_id: testClient.id,
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        status: 'active',
        budget: 50000,
        currency: 'USD',
        priority: 'high',
        tags: ['web', 'development'],
        notes: 'Project notes here'
      };

      const response = await request(server.listener)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send(projectData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(projectData.name);
      expect(response.body.data.description).toBe(projectData.description);
      expect(response.body.data.client_id).toBe(testClient.id);
      expect(response.body.data.status).toBe(projectData.status);
      expect(response.body.data.budget).toBe(projectData.budget);
      expect(response.body.data.organization_id).toBeDefined();
    });

    it('should return 400 for missing required fields', async () => {
      const projectData = {
        description: 'A test project description',
        client_id: testClient.id
        // Missing name
      };

      const response = await request(server.listener)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send(projectData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('name');
    });

    it('should return 400 for invalid client_id', async () => {
      const projectData = {
        name: 'Test Project',
        description: 'A test project description',
        client_id: '00000000-0000-0000-0000-000000000000'
      };

      const response = await request(server.listener)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send(projectData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('client');
    });

    it('should return 401 without authentication', async () => {
      const projectData = {
        name: 'Test Project',
        description: 'A test project description',
        client_id: testClient.id
      };

      const response = await request(server.listener)
        .post('/api/projects')
        .send(projectData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/projects', () => {
    beforeEach(async () => {
      // Create test projects
      const projectData1 = {
        name: 'Project 1',
        description: 'First test project',
        client_id: testClient.id,
        status: 'active',
        organization_id: testSetup.testOrganization.id
      };

      const projectData2 = {
        name: 'Project 2',
        description: 'Second test project',
        client_id: testClient.id,
        status: 'completed',
        organization_id: testSetup.testOrganization.id
      };

      await db.query(
        'INSERT INTO projects (name, description, client_id, status, organization_id) VALUES ($1, $2, $3, $4, $5), ($6, $7, $8, $9, $10)',
        [
          projectData1.name, projectData1.description, projectData1.client_id, projectData1.status, projectData1.organization_id,
          projectData2.name, projectData2.description, projectData2.client_id, projectData2.status, projectData2.organization_id
        ]
      );
    });

    it('should return all projects for the organization', async () => {
      const response = await request(server.listener)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('status');
      expect(response.body.pagination).toBeDefined();
    });

    it('should support pagination', async () => {
      const response = await request(server.listener)
        .get('/api/projects?page=1&limit=1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(1);
      expect(response.body.pagination.total).toBe(2);
    });

    it('should support filtering by status', async () => {
      const response = await request(server.listener)
        .get('/api/projects?status=active')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe('active');
    });

    it('should support search', async () => {
      const response = await request(server.listener)
        .get('/api/projects?search=Project 1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Project 1');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(server.listener)
        .get('/api/projects')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/projects/{id}', () => {
    let testProject;

    beforeEach(async () => {
      // Create test project
      const projectData = {
        name: 'Test Project',
        description: 'A test project description',
        client_id: testClient.id,
        status: 'active',
        organization_id: testSetup.testOrganization.id
      };

      const result = await db.query(
        'INSERT INTO projects (name, description, client_id, status, organization_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [projectData.name, projectData.description, projectData.client_id, projectData.status, projectData.organization_id]
      );
      testProject = result.rows[0];
    });

    it('should return project by id', async () => {
      const response = await request(server.listener)
        .get(`/api/projects/${testProject.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testProject.id);
      expect(response.body.data.name).toBe(testProject.name);
      expect(response.body.data.description).toBe(testProject.description);
      expect(response.body.data.client_id).toBe(testClient.id);
    });

    it('should return 404 for non-existent project', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await request(server.listener)
        .get(`/api/projects/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(server.listener)
        .get(`/api/projects/${testProject.id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/projects/{id}', () => {
    let testProject;

    beforeEach(async () => {
      // Create test project
      const projectData = {
        name: 'Original Project',
        description: 'Original description',
        client_id: testClient.id,
        status: 'active',
        organization_id: testSetup.testOrganization.id
      };

      const result = await db.query(
        'INSERT INTO projects (name, description, client_id, status, organization_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [projectData.name, projectData.description, projectData.client_id, projectData.status, projectData.organization_id]
      );
      testProject = result.rows[0];
    });

    it('should update project successfully', async () => {
      const updateData = {
        name: 'Updated Project',
        description: 'Updated description',
        status: 'completed',
        budget: 75000,
        priority: 'medium'
      };

      const response = await request(server.listener)
        .put(`/api/projects/${testProject.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.description).toBe(updateData.description);
      expect(response.body.data.status).toBe(updateData.status);
      expect(response.body.data.budget).toBe(updateData.budget);
      expect(response.body.data.priority).toBe(updateData.priority);
    });

    it('should return 404 for non-existent project', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const updateData = { name: 'Updated Project' };

      const response = await request(server.listener)
        .put(`/api/projects/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should return 400 for invalid data', async () => {
      const updateData = {
        status: 'invalid-status'
      };

      const response = await request(server.listener)
        .put(`/api/projects/${testProject.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('status');
    });
  });

  describe('DELETE /api/projects/{id}', () => {
    let testProject;

    beforeEach(async () => {
      // Create test project
      const projectData = {
        name: 'Test Project',
        description: 'A test project description',
        client_id: testClient.id,
        status: 'active',
        organization_id: testSetup.testOrganization.id
      };

      const result = await db.query(
        'INSERT INTO projects (name, description, client_id, status, organization_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [projectData.name, projectData.description, projectData.client_id, projectData.status, projectData.organization_id]
      );
      testProject = result.rows[0];
    });

    it('should delete project successfully', async () => {
      const response = await request(server.listener)
        .delete(`/api/projects/${testProject.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted');

      // Verify project is deleted
      const getResponse = await request(server.listener)
        .get(`/api/projects/${testProject.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent project', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await request(server.listener)
        .delete(`/api/projects/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });
});
