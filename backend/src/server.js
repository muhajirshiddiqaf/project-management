const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const Good = require('@hapi/good');
const GoodConsole = require('@hapi/good-console');
const GoodFile = require('@hapi/good-file');

const config = require('./config');
const database = require('./config/database');

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
const reportsModule = require('./modules/reports'); // New import

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
        ],
        file: [
          {
            module: GoodFile,
            args: ['./logs/combined.log']
          }
        ]
      }
    }
  }
];

// Create Hapi server
const createServer = async () => {
  const server = Hapi.server({
    port: config.port,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: [config.security.corsOrigin],
        credentials: true,
        additionalHeaders: ['x-organization-id']
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

  // Register modules
  await server.register(authModule);
  await server.register(clientModule);
  await server.register(orderModule);
  await server.register(ticketModule);
  await server.register(projectModule);
  await server.register(invoiceModule);
  await server.register(quotationModule);
  await server.register(serviceModule);
      await server.register(emailModule);
    await server.register(pdfModule);
    await server.register(analyticsModule);
    await server.register(reportsModule); // New registration

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
      });
    },
    options: {
      auth: false,
      description: 'API root endpoint',
      tags: ['api'],
      notes: 'Get API information'
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
      const message = response.output.payload.message;

      return h.response({
        success: false,
        message: message || 'Internal server error',
        code: response.output.payload.error || 'INTERNAL_ERROR',
        ...(config.nodeEnv === 'development' && { stack: response.stack })
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
