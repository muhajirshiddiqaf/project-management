// Middleware index
const {
  tenantIsolation,
  roleBasedAccess,
  permissionBasedAccess
} = require('./tenantIsolation');

module.exports = {
  tenantIsolation,
  roleBasedAccess,
  permissionBasedAccess
};
