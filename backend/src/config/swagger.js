const swaggerOptions = {
  info: {
    title: 'SaaS Project Management & Quotation System API',
    version: '1.0.0',
    description: 'Complete API documentation for SaaS Project Management and Quotation System with multi-tenancy support',
    contact: {
      name: 'API Support',
      email: 'support@example.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  host: 'localhost:3000',
  basePath: '/api',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'JWT Authorization header using the Bearer scheme. Example: "Bearer {token}"'
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ],
  tags: [
    {
      name: 'auth',
      description: 'Authentication endpoints'
    },
    {
      name: 'users',
      description: 'User management endpoints'
    },
    {
      name: 'organizations',
      description: 'Organization management endpoints'
    },
    {
      name: 'clients',
      description: 'Client management endpoints'
    },
    {
      name: 'projects',
      description: 'Project management endpoints'
    },
    {
      name: 'quotations',
      description: 'Quotation management endpoints'
    },
    {
      name: 'orders',
      description: 'Order management endpoints'
    },
    {
      name: 'tickets',
      description: 'Ticket management endpoints'
    },
    {
      name: 'invoices',
      description: 'Invoice management endpoints'
    },
    {
      name: 'services',
      description: 'Service management endpoints'
    },
    {
      name: 'analytics',
      description: 'Analytics and reporting endpoints'
    },
    {
      name: 'reports',
      description: 'Report generation endpoints'
    },
    {
      name: 'email',
      description: 'Email management endpoints'
    },
    {
      name: 'pdf',
      description: 'PDF generation endpoints'
    },
    {
      name: 'system',
      description: 'System configuration endpoints'
    },
    {
      name: 'docs',
      description: 'Documentation endpoints'
    },
    {
      name: 'integration',
      description: 'Third-party integration endpoints'
    },
    {
      name: 'migration',
      description: 'Data migration endpoints'
    }
  ]
};

module.exports = swaggerOptions;
