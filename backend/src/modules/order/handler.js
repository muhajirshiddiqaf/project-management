const Boom = require('@hapi/boom');

class OrderHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // Bind all methods to preserve 'this' context
    this.getOrders = this.getOrders.bind(this);
    this.getOrderById = this.getOrderById.bind(this);
    this.createOrder = this.createOrder.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
    this.searchOrders = this.searchOrders.bind(this);
    this.getOrderItems = this.getOrderItems.bind(this);
    this.getOrderItemById = this.getOrderItemById.bind(this);
    this.createOrderItem = this.createOrderItem.bind(this);
    this.updateOrderItem = this.updateOrderItem.bind(this);
    this.deleteOrderItem = this.deleteOrderItem.bind(this);
    this.updateOrderStatus = this.updateOrderStatus.bind(this);
    this.assignOrder = this.assignOrder.bind(this);
    this.calculateOrderTotals = this.calculateOrderTotals.bind(this);
    this.bulkCreateOrderItems = this.bulkCreateOrderItems.bind(this);
    this.importOrderItems = this.importOrderItems.bind(this);
    this.exportOrderItems = this.exportOrderItems.bind(this);
  }

  // Get all orders
  async getOrders(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc', status, priority, client_id, project_id, assigned_to } = request.query;

      const orders = await this._service.findAll(organizationId, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sortBy,
        sortOrder,
        status,
        priority,
        client_id,
        project_id,
        assigned_to
      });

      return h.response({
        success: true,
        message: 'Orders retrieved successfully',
        data: orders
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve orders');
    }
  }

  // Get order by ID
  async getOrderById(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const { id } = request.params;

      const order = await this._service.findById(id, organizationId);

      if (!order) {
        throw Boom.notFound('Order not found');
      }

      return h.response({
        success: true,
        message: 'Order retrieved successfully',
        data: order
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to retrieve order');
    }
  }

  // Create new order
  async createOrder(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const userId = request.auth.credentials.user_id;
      const orderData = request.payload;

      const order = await this._service.create({
        ...orderData,
        organization_id: organizationId,
        created_by: userId
      });

      return h.response({
        success: true,
        message: 'Order created successfully',
        data: order
      }).code(201);
    } catch (error) {
      throw Boom.internal('Failed to create order');
    }
  }

  // Update order
  async updateOrder(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const { id } = request.params;
      const updateData = request.payload;

      const order = await this._service.update(id, organizationId, updateData);

      if (!order) {
        throw Boom.notFound('Order not found');
      }

      return h.response({
        success: true,
        message: 'Order updated successfully',
        data: order
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update order');
    }
  }

  // Delete order
  async deleteOrder(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const { id } = request.params;

      const deleted = await this._service.delete(id, organizationId);

      if (!deleted) {
        throw Boom.notFound('Order not found');
      }

      return h.response({
        success: true,
        message: 'Order deleted successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to delete order');
    }
  }

  // Search orders
  async searchOrders(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const { q, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = request.query;

      const orders = await this._service.search(organizationId, q, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sortBy,
        sortOrder
      });

      return h.response({
        success: true,
        message: 'Orders search completed',
        data: orders
      });
    } catch (error) {
      throw Boom.internal('Failed to search orders');
    }
  }

  // Update order status
  async updateOrderStatus(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const { id } = request.params;
      const { status, notes } = request.payload;

      const order = await this._service.updateStatus(id, organizationId, status, notes);

      if (!order) {
        throw Boom.notFound('Order not found');
      }

      return h.response({
        success: true,
        message: 'Order status updated successfully',
        data: order
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update order status');
    }
  }

  // Assign order
  async assignOrder(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const { id } = request.params;
      const { assigned_to } = request.payload;

      const order = await this._service.assign(id, organizationId, assigned_to);

      if (!order) {
        throw Boom.notFound('Order not found');
      }

      return h.response({
        success: true,
        message: 'Order assigned successfully',
        data: order
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to assign order');
    }
  }

  // === ORDER ITEMS METHODS ===

  // Get order items
  async getOrderItems(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const { order_id, category, page = 1, limit = 10 } = request.query;

      const items = await this._service.getItems(order_id, organizationId, {
        category,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
      });

      return h.response({
        success: true,
        message: 'Order items retrieved successfully',
        data: items
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve order items');
    }
  }

  // Get order item by ID
  async getOrderItemById(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const { id } = request.params;

      const item = await this._service.getItemById(id, organizationId);

      if (!item) {
        throw Boom.notFound('Order item not found');
      }

      return h.response({
        success: true,
        message: 'Order item retrieved successfully',
        data: item
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to retrieve order item');
    }
  }

  // Create order item
  async createOrderItem(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const itemData = request.payload;

      const item = await this._service.createItem({
        ...itemData,
        organization_id: organizationId
      });

      return h.response({
        success: true,
        message: 'Order item created successfully',
        data: item
      }).code(201);
    } catch (error) {
      throw Boom.internal('Failed to create order item');
    }
  }

  // Update order item
  async updateOrderItem(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const { id } = request.params;
      const updateData = request.payload;

      const item = await this._service.updateItem(id, organizationId, updateData);

      if (!item) {
        throw Boom.notFound('Order item not found');
      }

      return h.response({
        success: true,
        message: 'Order item updated successfully',
        data: item
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update order item');
    }
  }

  // Delete order item
  async deleteOrderItem(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const { id } = request.params;

      const deleted = await this._service.deleteItem(id, organizationId);

      if (!deleted) {
        throw Boom.notFound('Order item not found');
      }

      return h.response({
        success: true,
        message: 'Order item deleted successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to delete order item');
    }
  }

  // Calculate order totals
  async calculateOrderTotals(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const { order_id } = request.query;

      const totals = await this._service.calculateTotals(order_id, organizationId);

      return h.response({
        success: true,
        message: 'Order totals calculated successfully',
        data: totals
      });
    } catch (error) {
      throw Boom.internal('Failed to calculate order totals');
    }
  }

  // Bulk create order items
  async bulkCreateOrderItems(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const { order_id, items } = request.payload;

      const createdItems = await this._service.bulkCreateItems(order_id, organizationId, items);

      return h.response({
        success: true,
        message: 'Order items created successfully',
        data: {
          created: createdItems.length,
          items: createdItems
        }
      }).code(201);
    } catch (error) {
      throw Boom.internal('Failed to create order items');
    }
  }

  // Import order items
  async importOrderItems(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const { order_id, file } = request.payload;

      const result = await this._service.importItems(order_id, organizationId, file);

      return h.response({
        success: true,
        message: 'Order items imported successfully',
        data: result
      });
    } catch (error) {
      throw Boom.internal('Failed to import order items');
    }
  }

  // Export order items
  async exportOrderItems(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const { order_id, format = 'csv' } = request.query;

      const result = await this._service.exportItems(order_id, organizationId, format);

      return h.response(result.data)
        .header('Content-Type', result.contentType)
        .header('Content-Disposition', `attachment; filename="${result.filename}"`);
    } catch (error) {
      throw Boom.internal('Failed to export order items');
    }
  }
}

module.exports = OrderHandler;
