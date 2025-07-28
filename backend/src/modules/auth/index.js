const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');

// Import handlers
const authHandler = require('./handler');

// Import validators
const authValidator = require('./validator');

// Import routes
const authRoutes = require('./routes');

// Import repositories
const { UserRepository } = require('../../infrastructure/repositories');

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

        // Use repository to validate user
        const userRepository = new UserRepository(request.server.app.db);
        const user = await userRepository.findById(userId);

        if (!user || !user.is_active) {
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

        // Use repository to validate organization
        const userRepository = new UserRepository(request.server.app.db);
        const organization = await userRepository.findOrganizationById(organizationId);

        if (!organization || !organization.is_active) {
          return { credentials: null, isValid: false };
        }

        return {
          isValid: true,
          credentials: {
            userId,
            organizationId,
            organization: {
              id: organization.id,
              name: organization.name,
              slug: organization.slug
            }
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

       // Inject database into repositories
       const userRepository = new UserRepository(server.app.db);

       // Inject repository into handler
       authHandler.setUserRepository(userRepository);

       console.log('✅ Auth module registered');
};

const name = 'auth';

module.exports = {
  register,
  name
};
