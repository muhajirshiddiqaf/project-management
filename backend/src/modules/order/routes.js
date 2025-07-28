const routes = (handler, auth) => [
  // === ORDER CRUD ROUTES ===

  // Get all orders
  {
    method: 'GET',
    path: '/orders',
    handler: handler.getOrders,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.getOrders
      },
      tags: ['orders']
    }
  },

  // Get order by ID
  {
    method: 'GET',
    path: '/orders/{id}',
    handler: handler.getOrderById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: auth.getOrderById
      },
      tags: ['orders']
    }
  },

  // Create order
  {
    method: 'POST',
    path: '/orders',
    handler: handler.createOrder,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['order:create']) }
      ],
      validate: {
        payload: auth.createOrder
      },
      tags: ['orders']
    }
  },

  // Update order
  {
    method: 'PUT',
    path: '/orders/{id}',
    handler: handler.updateOrder,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['order:update']) }
      ],
      validate: {
        params: auth.getOrderById,
        payload: auth.updateOrder
      },
      tags: ['orders']
    }
  },

  // Delete order
  {
    method: 'DELETE',
    path: '/orders/{id}',
    handler: handler.deleteOrder,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['order:delete']) }
      ],
      validate: {
        params: auth.deleteOrder
      },
      tags: ['orders']
    }
  },

  // Search orders
  {
    method: 'GET',
    path: '/orders/search',
    handler: handler.searchOrders,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.searchOrders
      },
      tags: ['orders']
    }
  },

  // Update order status
  {
    method: 'PATCH',
    path: '/orders/{id}/status',
    handler: handler.updateOrderStatus,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['order:update_status']) }
      ],
      validate: {
        params: auth.getOrderById,
        payload: auth.updateOrderStatus
      },
      tags: ['orders']
    }
  },

  // Assign order
  {
    method: 'PATCH',
    path: '/orders/{id}/assign',
    handler: handler.assignOrder,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['order:assign']) }
      ],
      validate: {
        params: auth.getOrderById,
        payload: auth.assignOrder
      },
      tags: ['orders']
    }
  },

  // === ORDER ITEMS ROUTES ===

  // Get order items
  {
    method: 'GET',
    path: '/orders/items',
    handler: handler.getOrderItems,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.getOrderItems
      },
      tags: ['order-items']
    }
  },

  // Get order item by ID
  {
    method: 'GET',
    path: '/orders/items/{id}',
    handler: handler.getOrderItemById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: auth.getOrderItemById
      },
      tags: ['order-items']
    }
  },

  // Create order item
  {
    method: 'POST',
    path: '/orders/items',
    handler: handler.createOrderItem,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['order:create_item']) }
      ],
      validate: {
        payload: auth.createOrderItem
      },
      tags: ['order-items']
    }
  },

  // Update order item
  {
    method: 'PUT',
    path: '/orders/items/{id}',
    handler: handler.updateOrderItem,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['order:update_item']) }
      ],
      validate: {
        params: auth.getOrderItemById,
        payload: auth.updateOrderItem
      },
      tags: ['order-items']
    }
  },

  // Delete order item
  {
    method: 'DELETE',
    path: '/orders/items/{id}',
    handler: handler.deleteOrderItem,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['order:delete_item']) }
      ],
      validate: {
        params: auth.deleteOrderItem
      },
      tags: ['order-items']
    }
  },

  // Calculate order totals
  {
    method: 'GET',
    path: '/orders/totals',
    handler: handler.calculateOrderTotals,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.calculateOrderTotals
      },
      tags: ['order-items']
    }
  },

  // Bulk create order items
  {
    method: 'POST',
    path: '/orders/items/bulk',
    handler: handler.bulkCreateOrderItems,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['order:create_item']) }
      ],
      validate: {
        payload: auth.bulkCreateOrderItems
      },
      tags: ['order-items']
    }
  },

  // Import order items
  {
    method: 'POST',
    path: '/orders/items/import',
    handler: handler.importOrderItems,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['order:import_items']) }
      ],
      validate: {
        payload: auth.importOrderItems
      },
      tags: ['order-items']
    }
  },

  // Export order items
  {
    method: 'GET',
    path: '/orders/items/export',
    handler: handler.exportOrderItems,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) },
        //{ method: permissionBasedAccess(['order:export_items']) }
      ],
      validate: {
        query: auth.exportOrderItems
      },
      tags: ['order-items']
    }
  }
];

module.exports = routes;
