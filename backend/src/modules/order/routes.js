const orderHandler = require('./handler');
const orderValidator = require('./validator');
const { tenantIsolation, roleBasedAccess, permissionBasedAccess } = require('../../middleware');

const routes = [
  // === ORDER CRUD ROUTES ===

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

  // === ORDER ITEMS ROUTES ===

  // Get order items
  {
    method: 'GET',
    path: '/orders/items',
    handler: orderHandler.getOrderItems,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: orderValidator.getOrderItems
      },
      tags: ['order-items']
    }
  },

  // Get order item by ID
  {
    method: 'GET',
    path: '/orders/items/{id}',
    handler: orderHandler.getOrderItemById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: orderValidator.getOrderItemById
      },
      tags: ['order-items']
    }
  },

  // Create order item
  {
    method: 'POST',
    path: '/orders/items',
    handler: orderHandler.createOrderItem,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['order:create_item']) }
      ],
      validate: {
        payload: orderValidator.createOrderItem
      },
      tags: ['order-items']
    }
  },

  // Update order item
  {
    method: 'PUT',
    path: '/orders/items/{id}',
    handler: orderHandler.updateOrderItem,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['order:update_item']) }
      ],
      validate: {
        params: orderValidator.getOrderItemById,
        payload: orderValidator.updateOrderItem
      },
      tags: ['order-items']
    }
  },

  // Delete order item
  {
    method: 'DELETE',
    path: '/orders/items/{id}',
    handler: orderHandler.deleteOrderItem,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['order:delete_item']) }
      ],
      validate: {
        params: orderValidator.deleteOrderItem
      },
      tags: ['order-items']
    }
  },

  // Calculate order totals
  {
    method: 'GET',
    path: '/orders/totals',
    handler: orderHandler.calculateOrderTotals,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: orderValidator.calculateOrderTotals
      },
      tags: ['order-items']
    }
  },

  // Bulk create order items
  {
    method: 'POST',
    path: '/orders/items/bulk',
    handler: orderHandler.bulkCreateOrderItems,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['order:create_item']) }
      ],
      validate: {
        payload: orderValidator.bulkCreateOrderItems
      },
      tags: ['order-items']
    }
  },

  // Import order items
  {
    method: 'POST',
    path: '/orders/items/import',
    handler: orderHandler.importOrderItems,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['order:import_items']) }
      ],
      validate: {
        payload: orderValidator.importOrderItems
      },
      tags: ['order-items']
    }
  },

  // Export order items
  {
    method: 'GET',
    path: '/orders/items/export',
    handler: orderHandler.exportOrderItems,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) },
        { method: permissionBasedAccess(['order:export_items']) }
      ],
      validate: {
        query: orderValidator.exportOrderItems
      },
      tags: ['order-items']
    }
  }
];

module.exports = routes;
