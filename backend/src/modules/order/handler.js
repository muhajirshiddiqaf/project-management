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
      const {
        page = 1, limit = 10, status, priority, client_id, assigned_to, sortBy = 'created_at', sortOrder = 'desc',
      } = request.query;

      const orders = await this.orderRepository.findAll(organizationId, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        status,
        priority,
        client_id,
        assigned_to,
        sortBy,
        sortOrder,
      });

      return h.response({
        success: true,
        message: 'Orders retrieved successfully',
        data: orders,
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
        data: order,
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
        created_by: userId,
      });

      return h.response({
        success: true,
        message: 'Order created successfully',
        data: order,
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
        data: order,
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
        message: 'Order deleted successfully',
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
      const {
        q, page = 1, limit = 10, status, priority, sortBy = 'created_at', sortOrder = 'desc',
      } = request.query;

      const orders = await this.orderRepository.search(organizationId, q, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        status,
        priority,
        sortBy,
        sortOrder,
      });

      return h.response({
        success: true,
        message: 'Orders search completed',
        data: orders,
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
        data: order,
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
        data: order,
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to assign order');
    }
  }

  // Get order statistics
  async getOrderStatistics(request, h) {
    try {
      const { organizationId } = request;

      const statistics = await this.orderRepository.getStatistics(organizationId);

      return h.response({
        success: true,
        message: 'Order statistics retrieved successfully',
        data: statistics,
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve order statistics');
    }
  }
}

module.exports = new OrderHandler();
