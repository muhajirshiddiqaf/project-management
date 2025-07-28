const Boom = require('@hapi/boom');

class OrderHandler {
  constructor() {
    this.orderRepository = null;
  }

  // Set repository (dependency injection)
  setOrderRepository(orderRepository) {
    this.orderRepository = orderRepository;
  }

  // Get all orders
  async getOrders(request, h) {
    try {
      const { organizationId } = request;
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc', status, priority, client_id, project_id, assigned_to } = request.query;

      const orders = await this.orderRepository.findAll(organizationId, {
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
      const { organizationId } = request;
      const { id } = request.params;

      const order = await this.orderRepository.findById(id, organizationId);

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
      const { organizationId, userId } = request;
      const orderData = request.payload;

      const order = await this.orderRepository.create({
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
      const { organizationId } = request;
      const { id } = request.params;
      const updateData = request.payload;

      const order = await this.orderRepository.update(id, organizationId, updateData);

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
      const { organizationId } = request;
      const { id } = request.params;

      const deleted = await this.orderRepository.delete(id, organizationId);

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
      const { organizationId } = request;
      const { q, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = request.query;

      const orders = await this.orderRepository.search(organizationId, q, {
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
      const { organizationId } = request;
      const { id } = request.params;
      const { status, notes } = request.payload;

      const order = await this.orderRepository.updateStatus(id, organizationId, status, notes);

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
      const { organizationId } = request;
      const { id } = request.params;
      const { assigned_to } = request.payload;

      const order = await this.orderRepository.assign(id, organizationId, assigned_to);

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
      const { organizationId } = request;
      const { order_id, category, page = 1, limit = 10 } = request.query;

      const items = await this.orderRepository.getItems(order_id, organizationId, {
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
      const { organizationId } = request;
      const { id } = request.params;

      const item = await this.orderRepository.getItemById(id, organizationId);

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
      const { organizationId } = request;
      const itemData = request.payload;

      const item = await this.orderRepository.createItem({
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
      const { organizationId } = request;
      const { id } = request.params;
      const updateData = request.payload;

      const item = await this.orderRepository.updateItem(id, organizationId, updateData);

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
      const { organizationId } = request;
      const { id } = request.params;

      const deleted = await this.orderRepository.deleteItem(id, organizationId);

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
      const { organizationId } = request;
      const { order_id } = request.query;

      const totals = await this.orderRepository.calculateTotals(order_id, organizationId);

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
      const { organizationId } = request;
      const { order_id, items } = request.payload;

      const createdItems = await this.orderRepository.bulkCreateItems(order_id, organizationId, items);

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
      const { organizationId } = request;
      const { order_id, file } = request.payload;

      const result = await this.orderRepository.importItems(order_id, organizationId, file);

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
      const { organizationId } = request;
      const { order_id, format = 'csv' } = request.query;

      const result = await this.orderRepository.exportItems(order_id, organizationId, format);

      return h.response(result.data)
        .header('Content-Type', result.contentType)
        .header('Content-Disposition', `attachment; filename="${result.filename}"`);
    } catch (error) {
      throw Boom.internal('Failed to export order items');
    }
  }
}

module.exports = new OrderHandler();
