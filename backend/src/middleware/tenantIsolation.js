const Boom = require('@hapi/boom');

/**
 * Middleware untuk tenant isolation
 * Memastikan user hanya bisa mengakses data dari organization mereka
 */
const tenantIsolation = (request, h) => {
  try {
    const credentials = request.auth.credentials;

    if (!credentials) {
      throw Boom.unauthorized('Authentication required');
    }

    // Untuk super admin, bypass tenant isolation
    if (credentials.isSuperAdmin) {
      return h.continue;
    }

    // Pastikan user memiliki organizationId
    const organizationId = credentials.organizationId || credentials.organization?.id;

    if (!organizationId) {
      throw Boom.forbidden('Organization access required');
    }

    // Inject organizationId ke request untuk digunakan di handlers
    request.organizationId = organizationId;
    request.userId = credentials.id || credentials.userId;
    request.userRole = credentials.role || credentials.user?.role;

    return h.continue;
  } catch (error) {
    throw Boom.forbidden('Tenant isolation failed');
  }
};

/**
 * Middleware untuk role-based access control
 */
const roleBasedAccess = (allowedRoles = []) => {
  return (request, h) => {
    try {
      const credentials = request.auth.credentials;

      if (!credentials) {
        throw Boom.unauthorized('Authentication required');
      }

      // Super admin bypass semua role checks
      if (credentials.isSuperAdmin) {
        return h.continue;
      }

      const userRole = credentials.role || credentials.user?.role;

      if (!userRole) {
        throw Boom.forbidden('Role information required');
      }

      // Check jika role user ada di allowed roles
      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        throw Boom.forbidden(`Access denied. Required roles: ${allowedRoles.join(', ')}`);
      }

      return h.continue;
    } catch (error) {
      throw Boom.forbidden('Role-based access control failed');
    }
  };
};

/**
 * Middleware untuk permission-based access control
 */
const permissionBasedAccess = (requiredPermissions = []) => {
  return (request, h) => {
    try {
      const credentials = request.auth.credentials;

      if (!credentials) {
        throw Boom.unauthorized('Authentication required');
      }

      // Super admin bypass semua permission checks
      if (credentials.isSuperAdmin) {
        return h.continue;
      }

      const userPermissions = credentials.permissions || credentials.user?.permissions || {};

      // Check jika user memiliki semua required permissions
      const hasAllPermissions = requiredPermissions.every(permission =>
        userPermissions[permission] === true
      );

      if (!hasAllPermissions) {
        throw Boom.forbidden(`Access denied. Required permissions: ${requiredPermissions.join(', ')}`);
      }

      return h.continue;
    } catch (error) {
      throw Boom.forbidden('Permission-based access control failed');
    }
  };
};

module.exports = {
  tenantIsolation,
  roleBasedAccess,
  permissionBasedAccess
};
