/**
 * Auth utilities for handling request.auth.credentials
 */

/**
 * Extract user credentials from request.auth.credentials
 * Handles both camelCase and snake_case property names
 * @param {Object} credentials - request.auth.credentials
 * @returns {Object} Normalized credentials object
 */
function extractCredentials(credentials) {
  if (!credentials) {
    return {
      userId: null,
      email: null,
      role: null,
      organizationId: null,
      organizationName: null,
      organizationSlug: null,
      firstName: null,
      lastName: null,
      permissions: {}
    };
  }

  return {
    userId: credentials.userId || credentials.user_id || credentials.id,
    email: credentials.email,
    role: credentials.role,
    organizationId: credentials.organizationId || credentials.organization_id,
    organizationName: credentials.organizationName || credentials.organization_name,
    organizationSlug: credentials.organizationSlug || credentials.organization_slug,
    firstName: credentials.firstName || credentials.first_name,
    lastName: credentials.lastName || credentials.last_name,
    permissions: credentials.permissions || {}
  };
}

/**
 * Extract user credentials from request object
 * @param {Object} request - Hapi request object
 * @returns {Object} Normalized credentials object
 */
function getCredentials(request) {
  return extractCredentials(request.auth?.credentials);
}

/**
 * Get user ID from request
 * @param {Object} request - Hapi request object
 * @returns {string|null} User ID
 */
function getUserId(request) {
  const credentials = getCredentials(request);
  return credentials.userId;
}

/**
 * Get organization ID from request
 * @param {Object} request - Hapi request object
 * @returns {string|null} Organization ID
 */
function getOrganizationId(request) {
  const credentials = getCredentials(request);
  return credentials.organizationId;
}

/**
 * Get user role from request
 * @param {Object} request - Hapi request object
 * @returns {string|null} User role
 */
function getUserRole(request) {
  const credentials = getCredentials(request);
  return credentials.role;
}

/**
 * Check if user has specific permission
 * @param {Object} request - Hapi request object
 * @param {string} permission - Permission to check
 * @returns {boolean} True if user has permission
 */
function hasPermission(request, permission) {
  const credentials = getCredentials(request);
  return credentials.permissions && credentials.permissions[permission] === true;
}

/**
 * Check if user has any of the specified roles
 * @param {Object} request - Hapi request object
 * @param {Array<string>} roles - Roles to check
 * @returns {boolean} True if user has any of the roles
 */
function hasRole(request, roles) {
  const userRole = getUserRole(request);
  return roles.includes(userRole);
}

/**
 * Validate that user has required credentials
 * @param {Object} request - Hapi request object
 * @returns {boolean} True if user has valid credentials
 */
function hasValidCredentials(request) {
  const credentials = getCredentials(request);
  return !!(credentials.userId && credentials.organizationId);
}

/**
 * Create error response for missing credentials
 * @param {Object} h - Hapi response toolkit
 * @returns {Object} Error response
 */
function createUnauthorizedResponse(h) {
  return h.response({
    success: false,
    message: 'Authentication required. Please provide a valid JWT token in Authorization header',
    code: 'AUTHENTICATION_REQUIRED'
  }).code(401);
}

/**
 * Create error response for insufficient permissions
 * @param {Object} h - Hapi response toolkit
 * @param {string} requiredPermission - Required permission
 * @returns {Object} Error response
 */
function createForbiddenResponse(h, requiredPermission = 'access') {
  return h.response({
    success: false,
    message: `Insufficient permissions. Required: ${requiredPermission}`,
    code: 'INSUFFICIENT_PERMISSIONS'
  }).code(403);
}

module.exports = {
  extractCredentials,
  getCredentials,
  getUserId,
  getOrganizationId,
  getUserRole,
  hasPermission,
  hasRole,
  hasValidCredentials,
  createUnauthorizedResponse,
  createForbiddenResponse
};
