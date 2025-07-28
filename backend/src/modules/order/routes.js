const orderHandler = require('./handler');
const orderValidator = require('./validator');
const { tenantIsolation, roleBasedAccess, permissionBasedAccess } = require('../../middleware');

const routes = [
  // Get all orders
  {
    method: 'GET',
    path: '/orders',
    handler: orderHandler.getOrders,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: orderValidator.getOrders
      },
      tags: ['orders']
    }
  },

  // Get order by ID
  {
    method: 'GET',
    path: '/orders/{id}',
    handler: orderHandler.getOrderById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: orderValidator.getOrderById
      },
      tags: ['orders']
    }
  },

  // Create order
  {
    method: 'POST',
    path: '/orders',
    handler: orderHandler.createOrder,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['order:create']) }
      ],
      validate: {
        payload: orderValidator.createOrder
      },
      tags: ['orders']
    }
  },

  // Update order
  {
    method: 'PUT',
    path: '/orders/{id}',
    handler: orderHandler.updateOrder,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['order:update']) }
      ],
      validate: {
        params: orderValidator.getOrderById,
        payload: orderValidator.updateOrder
      },
      tags: ['orders']
    }
  },

  // Delete order
  {
    method: 'DELETE',
    path: '/orders/{id}',
    handler: orderHandler.deleteOrder,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['order:delete']) }
      ],
      validate: {
        params: orderValidator.deleteOrder
      },
      tags: ['orders']
    }
  },

  // Search orders
  {
    method: 'GET',
    path: '/orders/search',
    handler: orderHandler.searchOrders,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: orderValidator.searchOrders
      },
      tags: ['orders']
    }
  },

  // Update order status
  {
    method: 'PATCH',
    path: '/orders/{id}/status',
    handler: orderHandler.updateOrderStatus,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['order:update_status']) }
      ],
      validate: {
        params: orderValidator.getOrderById,
        payload: orderValidator.updateOrderStatus
      },
      tags: ['orders']
    }
  },

  // Assign order
  {
    method: 'PATCH',
    path: '/orders/{id}/assign',
    handler: orderHandler.assignOrder,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['order:assign']) }
      ],
      validate: {
        params: orderValidator.getOrderById,
        payload: orderValidator.assignOrder
      },
      tags: ['orders']
    }
  },

  // Get order statistics
  {
    method: 'GET',
    path: '/orders/statistics',
    handler: orderHandler.getOrderStatistics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      tags: ['orders']
    }
  }
];

module.exports = routes;
