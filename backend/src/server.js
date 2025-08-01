const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const Good = require('@hapi/good');
const GoodConsole = require('@hapi/good-console');
const swagger = require('hapi-swagger');
const swaggerOptions = require('./config/swagger');
// const GoodFile = require('@hapi/good-file'); // Commented out as it's not available

const config = require('./config');
const database = require('./config/database');

// Import repositories and validators
const { UserRepository, ClientRepository, OrderRepository, TicketRepository, ProjectRepository, InvoiceRepository, QuotationRepository, ServiceRepository, OrganizationRepository, SystemRepository, EmailRepository, PDFRepository, AnalyticsRepository, ReportsRepository, DocsRepository, MigrationRepository } = require('./infrastructure/repositories');
const CompanyConfigurationRepository = require('./infrastructure/repositories/companyConfigurationRepository');
const authValidator = require('./modules/auth/validator');
const clientValidator = require('./modules/client/validator');
const orderValidator = require('./modules/order/validator');
const ticketValidator = require('./modules/ticket/validator');
const projectValidator = require('./modules/project/validator');
const invoiceValidator = require('./modules/invoice/validator');
const quotationValidator = require('./modules/quotation/validator');
const serviceValidator = require('./modules/service/validator');
const userValidator = require('./modules/user/validator');
const organizationValidator = require('./modules/organization/validator');
const systemValidator = require('./modules/system/validator');
const emailValidator = require('./modules/email/validator');
const pdfValidator = require('./modules/pdf/validator');
const analyticsValidator = require('./modules/analytics/validator');
const reportsValidator = require('./modules/reports/validator');
const docsValidator = require('./modules/docs/validator');
const migrationValidator = require('./modules/migration/validator');
const companyConfigurationValidator = require('./modules/companyConfiguration/validator');

// Import modules
const authModule = require('./modules/auth');
const clientModule = require('./modules/client');
const orderModule = require('./modules/order');
const ticketModule = require('./modules/ticket');
const projectModule = require('./modules/project');
const invoiceModule = require('./modules/invoice');
const quotationModule = require('./modules/quotation');
const serviceModule = require('./modules/service');
const emailModule = require('./modules/email');
const pdfModule = require('./modules/pdf');
const analyticsModule = require('./modules/analytics');
const reportsModule = require('./modules/reports');
const docsModule = require('./modules/docs');
const userModule = require('./modules/user');
const organizationModule = require('./modules/organization'); // New import
const systemModule = require('./modules/system'); // New import
const integrationModule = require('./modules/integration'); // New import
const migrationModule = require('./modules/migration'); // New import
const companyConfigurationModule = require('./modules/companyConfiguration'); // New import

// Import plugins
const plugins = [
  {
    plugin: Inert
  },
  {
    plugin: Vision
  },
  {
    plugin: Jwt
  },
  {
    plugin: Good,
    options: {
      reporters: {
        console: [
          {
            module: GoodConsole,
            args: [{ log: '*', response: '*' }]
          },
          'stdout'
        ]
      }
    }
  },
  {
    plugin: swagger,
    options: swaggerOptions
  }
];

// Create Hapi server
const createServer = async () => {
  const server = Hapi.server({
    port: config.port,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:5173'],
        credentials: true,
        additionalHeaders: ['x-organization-id'],
        additionalExposedHeaders: ['x-organization-id']
      },
      validate: {
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation failed',
            errors: err.details.map(detail => ({
              field: detail.path.join('.'),
              message: detail.message
            })),
            code: 'VALIDATION_ERROR'
          }).code(400).takeover();
        }
      }
    }
  });



  // Register plugins
  await server.register(plugins);

  // Connect to database
  try {
    await database.connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }

  // Add database to server app context
  server.app.db = database;

  // Initialize repositories
  const userRepository = new UserRepository(database);
  const clientRepository = new ClientRepository(database);
  const orderRepository = new OrderRepository(database);
  const ticketRepository = new TicketRepository(database);
  const projectRepository = new ProjectRepository(database);
  const invoiceRepository = new InvoiceRepository(database);
  const quotationRepository = new QuotationRepository(database);
  const serviceRepository = new ServiceRepository(database);
  const organizationRepository = new OrganizationRepository(database);
  const systemRepository = new SystemRepository(database);
  const emailRepository = new EmailRepository(database);
  const pdfRepository = new PDFRepository(database);
  const analyticsRepository = new AnalyticsRepository(database);
  const reportsRepository = new ReportsRepository(database);
  const docsRepository = new DocsRepository(database);
  const migrationRepository = new MigrationRepository(database);
  const companyConfigurationRepository = new CompanyConfigurationRepository(database);

  // Add repositories to server.app for access in handlers
  server.app.companyConfigurationRepository = companyConfigurationRepository;

      // Register JWT authentication strategy
  server.auth.strategy('jwt', 'jwt', {
    keys: process.env.JWT_SECRET || 'your_jwt_secret_here',
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: 14400 // 4 hours
    },
        validate: async (artifacts, request, h) => {
      try {
        console.log('JWT artifacts:', JSON.stringify(artifacts.decoded, null, 2));

        const { userId, email, role, organizationId } = artifacts.decoded.payload;

        if (!userId) {
          console.error('No userId in JWT token');
          return { credentials: null, isValid: false };
        }

        // Use repository to validate user
        const user = await userRepository.findById(userId);
        console.log('Found user:', user ? user.id : 'null');

        if (!user || !user.is_active) {
          console.error('User not found or inactive:', userId);
          return { credentials: null, isValid: false };
        }

        return {
          isValid: true,
          credentials: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            permissions: user.permissions || {},
            organizationId: user.organization_id,
            organizationName: user.organization_name,
            organizationSlug: user.organization_slug,
            userId: user.id // Add this for compatibility
          }
        };
      } catch (error) {
        console.error('JWT validation error:', error);
        return { credentials: null, isValid: false };
      }
    }
  });

  // Set default auth strategy
  server.auth.default('jwt');

  // Add CORS preflight handler
  server.route({
    method: 'OPTIONS',
    path: '/{p*}',
    handler: (request, h) => {
      const response = h.response('success');
      response.header('Access-Control-Allow-Origin', request.headers.origin);
      response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-organization-id');
      response.header('Access-Control-Allow-Credentials', 'true');
      return response;
    },
    options: {
      auth: false
    }
  });

        // Register modules with /api prefix
  await server.register({
    plugin: authModule,
    options: {
      service: userRepository,
      validator: authValidator,
      auth: 'jwt'
    },
    routes: { prefix: '/api' }
  });
  await server.register({
    plugin: clientModule,
    options: {
      service: clientRepository,
      validator: clientValidator,
      auth: 'jwt'
    },
    routes: { prefix: '/api' }
  });
  await server.register({
    plugin: orderModule,
    options: {
      service: orderRepository,
      validator: orderValidator,
      auth: 'jwt'
    },
    routes: { prefix: '/api' }
  });
  await server.register({
    plugin: ticketModule,
    options: {
      service: ticketRepository,
      validator: ticketValidator,
      auth: 'jwt'
    },
    routes: { prefix: '/api' }
  });
  await server.register({
    plugin: projectModule,
    options: {
      service: projectRepository,
      validator: projectValidator,
      auth: 'jwt'
    },
    routes: { prefix: '/api' }
  });
  await server.register({
    plugin: invoiceModule,
    options: {
      service: invoiceRepository,
      validator: invoiceValidator,
      auth: 'jwt'
    },
    routes: { prefix: '/api' }
  });
  await server.register({
    plugin: quotationModule,
    options: {
      service: quotationRepository,
      validator: quotationValidator,
      auth: 'jwt'
    },
    routes: { prefix: '/api' }
  });
  await server.register({
    plugin: serviceModule,
    options: {
      service: serviceRepository,
      validator: serviceValidator,
      auth: 'jwt'
    },
    routes: { prefix: '/api' }
  });
  await server.register({
    plugin: userModule,
    options: {
      service: userRepository,
      validator: userValidator,
      auth: 'jwt'
    },
    routes: { prefix: '/api' }
  });
  await server.register({
    plugin: emailModule,
    options: {
      service: emailRepository,
      validator: emailValidator,
      auth: 'jwt'
    },
    routes: { prefix: '/api' }
  });
  await server.register({
    plugin: pdfModule,
    options: {
      service: pdfRepository,
      validator: pdfValidator,
      auth: 'jwt'
    },
    routes: { prefix: '/api' }
  });
  // Create analytics service with all required repositories
  const analyticsService = new (require('./modules/analytics/service'))(
    clientRepository,
    projectRepository,
    orderRepository,
    invoiceRepository,
    ticketRepository
  );

  await server.register({
    plugin: analyticsModule,
    options: {
      service: analyticsService,
      validator: analyticsValidator,
      auth: 'jwt'
    },
    routes: { prefix: '/api' }
  });
  await server.register({
    plugin: reportsModule,
    options: {
      service: reportsRepository,
      validator: reportsValidator,
      auth: 'jwt'
    },
    routes: { prefix: '/api' }
  });
  await server.register({
    plugin: docsModule,
    options: {
      service: docsRepository,
      validator: docsValidator,
      auth: 'jwt'
    },
    routes: { prefix: '/api' }
  });
  await server.register({
    plugin: organizationModule,
    options: {
      service: organizationRepository,
      validator: organizationValidator,
      auth: 'jwt'
    },
    routes: { prefix: '/api' }
  });
  await server.register({
    plugin: systemModule,
    options: {
      service: systemRepository,
      validator: systemValidator,
      auth: 'jwt'
    },
    routes: { prefix: '/api' }
  });
  await server.register({ plugin: integrationModule, routes: { prefix: '/api' } });
  await server.register({
    plugin: migrationModule,
    options: {
      service: migrationRepository,
      validator: migrationValidator,
      auth: 'jwt'
    },
    routes: { prefix: '/api' }
  });
  await server.register({
    plugin: companyConfigurationModule,
    options: {
      service: companyConfigurationRepository,
      validator: companyConfigurationValidator,
      auth: companyConfigurationValidator
    },
    routes: { prefix: '/api' }
  });



  // Health check route
  server.route({
    method: 'GET',
    path: '/health',
    handler: async (request, h) => {
      try {
        const dbHealth = await database.healthCheck();
        const poolStats = database.getPoolStats();

        return h.response({
          success: true,
          timestamp: new Date().toISOString(),
          environment: config.nodeEnv,
          database: dbHealth,
          poolStats,
          uptime: process.uptime(),
          memory: process.memoryUsage(),
        });
      } catch (error) {
        return h.response({
          success: false,
          message: 'Health check failed',
          error: error.message,
        }).code(500);
      }
    },
    options: {
      auth: false,
      description: 'Health check endpoint',
      tags: ['api', 'health'],
      notes: 'Check system health and database connection'
    }
  });

  // Root route
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return h.response({
        success: true,
        message: 'SaaS Project Management & Quotation System API',
        version: '1.0.0',
        environment: config.nodeEnv,
        timestamp: new Date().toISOString(),
        documentation: {
          swagger: `http://localhost:${config.port}/documentation`,
          swagger_ui: `http://localhost:${config.port}/documentation`,
          postman: 'Available in documents/Postman_Collection.json'
        },
        endpoints: {
          health: `http://localhost:${config.port}/health`,
          api: `http://localhost:${config.port}/api`
        },
        modules: [
          'Authentication & Authorization',
          'User Management',
          'Organization Management',
          'Client Management',
          'Project Management',
          'Quotation Management',
          'Order Management',
          'Invoice Management',
          'Ticket Management',
          'Service Management',
          'Email & PDF Generation',
          'Analytics & Reporting',
          'System Administration',
          'Integration Management',
          'Data Migration'
        ],
        features: [
          'Multi-tenant SaaS Architecture',
          'Role-Based Access Control (RBAC)',
          'Permission-Based Access Control (PBAC)',
          'Two-Factor Authentication (2FA)',
          'JWT Token Authentication',
          'Database Migrations',
          'File Upload & Storage',
          'Email Campaigns',
          'PDF Generation',
          'Real-time Notifications',
          'Audit Logging',
          'API Rate Limiting',
          'CORS Support',
          'Comprehensive Validation',
          'Error Handling'
        ],
        technology: {
          backend: 'Node.js with Hapi.js',
          database: 'PostgreSQL',
          authentication: 'JWT with 2FA',
          email: 'SendGrid',
          pdf: 'Puppeteer & PDF-Lib',
          architecture: 'Clean Architecture',
          testing: 'Jest',
          documentation: 'Swagger/OpenAPI'
        },
        status: 'Running',
        uptime: process.uptime(),
        memory: process.memoryUsage()
      });
    },
    options: {
      auth: false,
      description: 'API root endpoint',
      tags: ['api'],
      notes: 'Get comprehensive API information'
    }
  });

  // Test JWT route
  server.route({
    method: 'GET',
    path: '/api/test-jwt',
    handler: (request, h) => {
      return h.response({
        success: true,
        message: 'JWT test successful',
        user: request.auth.credentials
      });
    },
    options: {
      auth: 'jwt',
      description: 'Test JWT authentication',
      tags: ['test']
    }
  });

  // API information route
  server.route({
    method: 'GET',
    path: '/api',
    handler: (request, h) => {
      return h.response({
        success: true,
        message: 'SaaS Project Management & Quotation System API',
        version: '1.0.0',
        environment: config.nodeEnv,
        timestamp: new Date().toISOString(),
        baseUrl: `http://localhost:${config.port}`,
        endpoints: {
          authentication: {
            login: 'POST /auth/login',
            register: 'POST /auth/register',
            logout: 'POST /auth/logout',
            refresh: 'POST /auth/refresh-token',
            '2fa-setup': 'POST /auth/2fa/setup',
            '2fa-verify': 'POST /auth/2fa/verify',
            '2fa-qr-code': 'GET /auth/2fa/qr-code',
            '2fa-status': 'GET /auth/2fa/status'
          },
          users: {
            list: 'GET /users',
            create: 'POST /users',
            detail: 'GET /users/{id}',
            update: 'PUT /users/{id}',
            delete: 'DELETE /users/{id}',
            profile: 'GET /users/profile',
            preferences: 'GET /users/preferences'
          },
          organizations: {
            list: 'GET /organizations',
            create: 'POST /organizations',
            detail: 'GET /organizations/{id}',
            update: 'PUT /organizations/{id}',
            delete: 'DELETE /organizations/{id}',
            settings: 'GET /organizations/{id}/settings'
          },
          clients: {
            list: 'GET /clients',
            create: 'POST /clients',
            detail: 'GET /clients/{id}',
            update: 'PUT /clients/{id}',
            delete: 'DELETE /clients/{id}',
            contacts: 'GET /clients/{id}/contacts',
            communications: 'GET /clients/{id}/communications'
          },
          projects: {
            list: 'GET /projects',
            create: 'POST /projects',
            detail: 'GET /projects/{id}',
            update: 'PUT /projects/{id}',
            delete: 'DELETE /projects/{id}',
            tasks: 'GET /projects/{id}/tasks',
            materials: 'GET /projects/{id}/materials',
            costs: 'GET /projects/{id}/costs'
          },
          quotations: {
            list: 'GET /quotations',
            create: 'POST /quotations',
            detail: 'GET /quotations/{id}',
            update: 'PUT /quotations/{id}',
            delete: 'DELETE /quotations/{id}',
            send: 'POST /quotations/{id}/send',
            approve: 'POST /quotations/{id}/approve',
            reject: 'POST /quotations/{id}/reject',
            'generate-from-project': 'POST /quotations/generate-from-project'
          },
          orders: {
            list: 'GET /orders',
            create: 'POST /orders',
            detail: 'GET /orders/{id}',
            update: 'PUT /orders/{id}',
            delete: 'DELETE /orders/{id}',
            items: 'GET /orders/{id}/items',
            status: 'PUT /orders/{id}/status'
          },
          invoices: {
            list: 'GET /invoices',
            create: 'POST /invoices',
            detail: 'GET /invoices/{id}',
            update: 'PUT /invoices/{id}',
            delete: 'DELETE /invoices/{id}',
            send: 'POST /invoices/{id}/send',
            pay: 'POST /invoices/{id}/pay'
          },
          tickets: {
            list: 'GET /tickets',
            create: 'POST /tickets',
            detail: 'GET /tickets/{id}',
            update: 'PUT /tickets/{id}',
            delete: 'DELETE /tickets/{id}',
            messages: 'GET /tickets/{id}/messages',
            'add-message': 'POST /tickets/{id}/messages',
            status: 'PUT /tickets/{id}/status'
          },
          services: {
            list: 'GET /services',
            create: 'POST /services',
            detail: 'GET /services/{id}',
            update: 'PUT /services/{id}',
            delete: 'DELETE /services/{id}',
            categories: 'GET /services/categories',
            rates: 'GET /services/{id}/rates'
          },
          integrations: {
            list: 'GET /integrations',
            create: 'POST /integrations',
            detail: 'GET /integrations/{id}',
            update: 'PUT /integrations/{id}',
            delete: 'DELETE /integrations/{id}',
            test: 'POST /integrations/{id}/test',
            sync: 'POST /integrations/{id}/sync',
            webhooks: 'GET /integrations/{id}/webhooks',
            'oauth-callback': 'GET /integrations/{id}/oauth/callback',
            'rotate-api-key': 'POST /integrations/{id}/rotate-api-key',
            health: 'GET /integrations/{id}/health'
          },
          system: {
            health: 'GET /health',
            status: 'GET /system/status',
            logs: 'GET /system/logs',
            metrics: 'GET /system/metrics',
            settings: 'GET /system/settings',
            backup: 'POST /system/backup',
            restore: 'POST /system/restore'
          },
          migration: {
            status: 'GET /migration/status',
            run: 'POST /migration/run',
            rollback: 'POST /migration/rollback',
            seed: 'POST /migration/seed',
            'export-data': 'POST /migration/export-data',
            'import-data': 'POST /migration/import-data'
          }
        },
        authentication: {
          type: 'JWT Bearer Token',
          header: 'Authorization: Bearer <token>',
          '2fa-support': true,
          'refresh-tokens': true
        },
        pagination: {
          default: 10,
          max: 100,
          parameter: '?page=1&limit=10'
        },
        filtering: {
          parameter: '?filter[field]=value',
          operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'like', 'in']
        },
        sorting: {
          parameter: '?sort=field:asc',
          direction: 'asc or desc'
        },
        response: {
          success: {
            success: true,
            data: '...',
            message: '...'
          },
          error: {
            success: false,
            message: '...',
            errors: '...',
            code: 'ERROR_CODE'
          }
        },
        rateLimiting: {
          window: '15 minutes',
          maxRequests: 100,
          headers: 'X-RateLimit-*'
        },
        cors: {
          origin: config.security.corsOrigin,
          credentials: true,
          methods: config.security.corsMethods,
          headers: config.security.corsHeaders
        }
      });
    },
    options: {
      auth: false,
      description: 'API information and endpoints',
      tags: ['api'],
      notes: 'Get detailed API information and available endpoints'
    }
  });

  // API documentation route
  server.route({
    method: 'GET',
    path: '/api/docs',
    handler: (request, h) => {
      return h.view('api-docs', {
        title: 'API Documentation',
        version: '1.0.0'
      });
    },
    options: {
      auth: false,
      description: 'API documentation',
      tags: ['api', 'docs'],
      notes: 'View API documentation'
    }
  });

  // 404 handler
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;

    if (response.isBoom && response.output.statusCode === 404) {
      return h.response({
        success: false,
        message: 'Route not found',
        code: 'ROUTE_NOT_FOUND',
        path: request.path
      }).code(404);
    }

    return h.continue;
  });

  // Global error handler
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;

    if (response.isBoom) {
      const statusCode = response.output.statusCode;
      let message = response.output.payload.message;
      let code = response.output.payload.error || 'INTERNAL_ERROR';

      // Improve error messages
      if (statusCode === 401) {
        if (message === 'Missing authentication') {
          message = 'Authentication required. Please provide a valid JWT token in Authorization header';
          code = 'AUTHENTICATION_REQUIRED';
        } else if (message === 'Invalid token') {
          message = 'Invalid or expired token. Please login again';
          code = 'INVALID_TOKEN';
        }
      } else if (statusCode === 403) {
        message = 'Access denied. You do not have permission to access this resource';
        code = 'ACCESS_DENIED';
      } else if (statusCode === 404) {
        message = 'Endpoint not found. Please check the URL';
        code = 'ENDPOINT_NOT_FOUND';
      } else if (statusCode === 400) {
        message = 'Bad request. Please check your request parameters';
        code = 'BAD_REQUEST';
      } else if (statusCode === 500) {
        message = 'Internal server error. Please try again later';
        code = 'INTERNAL_ERROR';
      }

      return h.response({
        success: false,
        message: message || 'Internal server error',
        code: code,
        ...(config.nodeEnv === 'development' && {
          stack: response.stack,
          path: request.path,
          method: request.method
        })
      }).code(statusCode);
    }

    return h.continue;
  });

  // Graceful shutdown
  const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);

    try {
      await database.disconnect();
      console.log('✅ Database disconnected');

      await server.stop();
      console.log('✅ Server stopped');

      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  };

  // Handle shutdown signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('UNHANDLED_REJECTION');
  });

  return server;
};

// Start server
const startServer = async () => {
  try {
    const server = await createServer();

    await server.start();

    console.log(`🚀 Server running on port ${config.port}`);
    console.log(`📊 Environment: ${config.nodeEnv}`);
    console.log(`🔗 API URL: http://localhost:${config.port}/api`);
    console.log(`🏥 Health check: http://localhost:${config.port}/health`);
    console.log(`📚 API Docs: http://localhost:${config.port}/api/docs`);

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = { createServer };
