# Auth Utilities

Utility functions for handling authentication and authorization in the application.

## Usage

```javascript
const {
  getCredentials,
  getUserId,
  getOrganizationId,
  hasRole,
} = require('../utils/auth');

// In your handler
async function myHandler(request, h) {
  const credentials = getCredentials(request);
  const userId = getUserId(request);
  const organizationId = getOrganizationId(request);

  // Check permissions
  if (hasRole(request, ['admin', 'manager'])) {
    // User has admin or manager role
  }
}
```

## Functions

### `getCredentials(request)`

Extract and normalize user credentials from request.auth.credentials.
Handles both camelCase and snake_case property names.

**Returns:** Normalized credentials object with:

- `userId` - User ID
- `email` - User email
- `role` - User role
- `organizationId` - Organization ID
- `organizationName` - Organization name
- `organizationSlug` - Organization slug
- `firstName` - User first name
- `lastName` - User last name
- `permissions` - User permissions object

### `getUserId(request)`

Get user ID from request.

**Returns:** User ID string or null

### `getOrganizationId(request)`

Get organization ID from request.

**Returns:** Organization ID string or null

### `getUserRole(request)`

Get user role from request.

**Returns:** User role string or null

### `hasPermission(request, permission)`

Check if user has specific permission.

**Parameters:**

- `request` - Hapi request object
- `permission` - Permission string to check

**Returns:** Boolean

### `hasRole(request, roles)`

Check if user has any of the specified roles.

**Parameters:**

- `request` - Hapi request object
- `roles` - Array of role strings

**Returns:** Boolean

### `hasValidCredentials(request)`

Validate that user has required credentials.

**Returns:** Boolean

### `createUnauthorizedResponse(h)`

Create standardized unauthorized response.

**Returns:** Hapi response object

### `createForbiddenResponse(h, requiredPermission)`

Create standardized forbidden response.

**Parameters:**

- `h` - Hapi response toolkit
- `requiredPermission` - Required permission string (optional)

**Returns:** Hapi response object

## Examples

### Basic Usage

```javascript
const { getCredentials, getOrganizationId } = require('../utils/auth');

async function getData(request, h) {
  const credentials = getCredentials(request);
  const organizationId = getOrganizationId(request);

  if (!organizationId) {
    return h.response({ error: 'Organization not found' }).code(400);
  }

  // Use credentials...
}
```

### Permission Checking

```javascript
const { hasRole, hasPermission } = require('../utils/auth');

async function adminOnly(request, h) {
  if (!hasRole(request, ['admin'])) {
    return h.response({ error: 'Admin access required' }).code(403);
  }

  if (!hasPermission(request, 'user:delete')) {
    return h.response({ error: 'Delete permission required' }).code(403);
  }

  // Proceed with admin operation...
}
```

### Error Handling

```javascript
const {
  createUnauthorizedResponse,
  createForbiddenResponse,
} = require('../utils/auth');

async function protectedRoute(request, h) {
  if (!request.auth.isAuthenticated) {
    return createUnauthorizedResponse(h);
  }

  if (!hasRole(request, ['admin'])) {
    return createForbiddenResponse(h, 'admin');
  }

  // Proceed with protected operation...
}
```
