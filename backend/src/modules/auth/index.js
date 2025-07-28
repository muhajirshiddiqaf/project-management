const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');

// Import handlers
const authHandler = require('./handler');

// Import validators
const authValidator = require('./validator');

// Import routes
const authRoutes = require('./routes');

// Auth module registration
const register = async (server, options) => {
  // Register routes
  server.route(authRoutes);

  // Register authentication strategy
  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET || 'your_jwt_secret_here',
    validate: async (artifacts, request, h) => {
      try {
        // Verify token and return credentials
        const { userId, email, role, organizationId } = artifacts.decoded;

        // Check if user exists and is active
        const { db } = request.server.app;
        const userQuery = `
          SELECT u.*, o.name as organization_name, o.slug as organization_slug
          FROM users u
          JOIN organizations o ON u.organization_id = o.id
          WHERE u.id = $1 AND u.is_active = true AND o.is_active = true
        `;

        const userResult = await db.query(userQuery, [userId]);

        if (userResult.rows.length === 0) {
          return { credentials: null, isValid: false };
        }

        const user = userResult.rows[0];

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
          }
        };
      } catch (error) {
        return { credentials: null, isValid: false };
      }
    },
    verifyOptions: {
      algorithms: ['HS256']
    }
  });

  // Register multi-tenant strategy
  server.auth.strategy('tenant', 'jwt', {
    key: process.env.JWT_SECRET || 'your_jwt_secret_here',
    validate: async (artifacts, request, h) => {
      try {
        const { userId, organizationId } = artifacts.decoded;

        // Verify organization exists and is active
        const { db } = request.server.app;
        const orgQuery = 'SELECT id, name, slug FROM organizations WHERE id = $1 AND is_active = true';
        const orgResult = await db.query(orgQuery, [organizationId]);

        if (orgResult.rows.length === 0) {
          return { credentials: null, isValid: false };
        }

        return {
          isValid: true,
          credentials: {
            userId,
            organizationId,
            organization: orgResult.rows[0]
          }
        };
      } catch (error) {
        return { credentials: null, isValid: false };
      }
    },
    verifyOptions: {
      algorithms: ['HS256']
    }
  });

  console.log('✅ Auth module registered');
};

const name = 'auth';

module.exports = {
  register,
  name
};
