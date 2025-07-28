const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const database = require('../config/database');

class AuthMiddleware {
  // Generate JWT token
  static generateToken(payload, expiresIn = null) {
    const tokenExpiresIn = expiresIn || config.jwt.expiresIn;
    return jwt.sign(payload, config.jwt.secret, { expiresIn: tokenExpiresIn });
  }

  // Generate refresh token
  static generateRefreshToken(payload) {
    return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.refreshExpiresIn });
  }

  // Verify JWT token
  static verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Hash password
  static async hashPassword(password) {
    return bcrypt.hash(password, config.security.bcryptRounds);
  }

  // Compare password
  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  // Authentication middleware
  static async authenticate(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Access token required',
          code: 'TOKEN_REQUIRED'
        });
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      // Verify token
      const decoded = AuthMiddleware.verifyToken(token);

      // Check if user exists and is active
      const userQuery = `
        SELECT u.*, o.name as organization_name, o.slug as organization_slug
        FROM users u
        JOIN organizations o ON u.organization_id = o.id
        WHERE u.id = $1 AND u.is_active = true AND o.is_active = true
      `;

      const userResult = await database.query(userQuery, [decoded.userId]);

      if (userResult.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'User not found or inactive',
          code: 'USER_NOT_FOUND'
        });
      }

      const user = userResult.rows[0];

      // Add user and organization info to request
      req.user = {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        permissions: user.permissions || {},
        organizationId: user.organization_id,
        organizationName: user.organization_name,
        organizationSlug: user.organization_slug,
      };

      // Add organization context for multi-tenant
      req.organizationId = user.organization_id;

      next();
    } catch (error) {
      console.error('Authentication error:', error.message);

      if (error.message === 'Invalid token') {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token',
          code: 'INVALID_TOKEN'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Authentication failed',
        code: 'AUTH_ERROR'
      });
    }
  }

  // Role-based authorization middleware
  static authorize(roles = []) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }

      next();
    };
  }

  // Permission-based authorization middleware
  static requirePermission(permission) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const userPermissions = req.user.permissions || {};

      if (!userPermissions[permission]) {
        return res.status(403).json({
          success: false,
          message: `Permission '${permission}' required`,
          code: 'PERMISSION_REQUIRED'
        });
      }

      next();
    };
  }

  // Multi-tenant middleware
  static async setTenantContext(req, res, next) {
    try {
      const tenantHeader = config.multiTenant.headerName;
      const tenantId = req.headers[tenantHeader] || req.user?.organizationId;

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          message: 'Organization context required',
          code: 'TENANT_REQUIRED'
        });
      }

      // Verify organization exists and is active
      const orgQuery = 'SELECT id, name, slug FROM organizations WHERE id = $1 AND is_active = true';
      const orgResult = await database.query(orgQuery, [tenantId]);

      if (orgResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Organization not found',
          code: 'ORGANIZATION_NOT_FOUND'
        });
      }

      req.organizationId = tenantId;
      req.organization = orgResult.rows[0];

      next();
    } catch (error) {
      console.error('Tenant context error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to set tenant context',
        code: 'TENANT_ERROR'
      });
    }
  }

  // Rate limiting middleware
  static rateLimit(options = {}) {
    const windowMs = options.windowMs || config.security.rateLimitWindowMs;
    const max = options.max || config.security.rateLimitMax;

    const requests = new Map();

    return (req, res, next) => {
      const key = req.ip || req.connection.remoteAddress;
      const now = Date.now();

      if (!requests.has(key)) {
        requests.set(key, { count: 1, resetTime: now + windowMs });
      } else {
        const request = requests.get(key);

        if (now > request.resetTime) {
          request.count = 1;
          request.resetTime = now + windowMs;
        } else {
          request.count++;
        }

        if (request.count > max) {
          return res.status(429).json({
            success: false,
            message: 'Too many requests',
            code: 'RATE_LIMIT_EXCEEDED'
          });
        }
      }

      next();
    };
  }

  // Optional authentication middleware
  static optionalAuth(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(); // Continue without authentication
      }

      const token = authHeader.substring(7);
      const decoded = AuthMiddleware.verifyToken(token);

      // Set user context if token is valid
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        organizationId: decoded.organizationId,
      };

      next();
    } catch (error) {
      // Continue without authentication if token is invalid
      next();
    }
  }
}

module.exports = AuthMiddleware;
