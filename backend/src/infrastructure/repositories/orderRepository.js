const { queries } = require('../database/queries');

class OrderRepository {
  constructor(db) {
    this.db = db;
  }

  // Find all orders for organization
  async findAll(organizationId, options = {}) {
    const { page = 1, limit = 10, status, priority, client_id, assigned_to, sortBy = 'created_at', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;

    try {
      const result = await this.db.query(queries.order.findAllOrders, [
        organizationId,
        status,
        priority,
        client_id,
        assigned_to,
        limit,
        offset,
        sortBy,
        sortOrder
      ]);

      const countResult = await this.db.query(queries.order.countOrders, [
        organizationId,
        status,
        priority,
        client_id,
        assigned_to
      ]);
      const total = parseInt(countResult.rows[0].count);

      return {
        orders: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error('Failed to retrieve orders');
    }
  }

  // Find order by ID
  async findById(id, organizationId) {
    try {
      const result = await this.db.query(queries.order.findOrderById, [id, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to retrieve order');
    }
  }

  // Create new order
  async create(orderData) {
    try {
      const result = await this.db.query(queries.order.createOrder, [
        orderData.title,
        orderData.description,
        orderData.client_id,
        orderData.project_id,
        orderData.order_date,
        orderData.due_date,
        orderData.total_amount,
        orderData.currency,
        orderData.status,
        orderData.priority,
        orderData.assigned_to,
        orderData.notes,
        orderData.organization_id,
        orderData.created_by
      ]);

      return result.rows[0];
    } catch (error) {
      throw new Error('Failed to create order');
    }
  }

  // Update order
  async update(id, organizationId, updateData) {
    try {
      const result = await this.db.query(queries.order.updateOrder, [
        id,
        organizationId,
        updateData.title,
        updateData.description,
        updateData.client_id,
        updateData.project_id,
        updateData.order_date,
        updateData.due_date,
        updateData.total_amount,
        updateData.currency,
        updateData.status,
        updateData.priority,
        updateData.assigned_to,
        updateData.notes
      ]);

      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to update order');
    }
  }

  // Delete order
  async delete(id, organizationId) {
    try {
      const result = await this.db.query(queries.order.deleteOrder, [id, organizationId]);
      return result.rowCount > 0;
    } catch (error) {
      throw new Error('Failed to delete order');
    }
  }

  // Search orders
  async search(organizationId, searchTerm, options = {}) {
    const { page = 1, limit = 10, status, priority, sortBy = 'created_at', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;

    try {
      const result = await this.db.query(queries.order.searchOrders, [
        organizationId,
        searchTerm,
        status,
        priority,
        limit,
        offset,
        sortBy,
        sortOrder
      ]);

      const countResult = await this.db.query(queries.order.countSearchOrders, [
        organizationId,
        searchTerm,
        status,
        priority
      ]);
      const total = parseInt(countResult.rows[0].count);

      return {
        orders: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error('Failed to search orders');
    }
  }

  // Update order status
  async updateStatus(id, organizationId, status, notes) {
    try {
      const result = await this.db.query(queries.order.updateOrderStatus, [
        id,
        organizationId,
        status,
        notes
      ]);

      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to update order status');
    }
  }

  // Assign order
  async assign(id, organizationId, assigned_to) {
    try {
      const result = await this.db.query(queries.order.assignOrder, [
        id,
        organizationId,
        assigned_to
      ]);

      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to assign order');
    }
  }

  // Get order statistics
  async getStatistics(organizationId) {
    try {
      const result = await this.db.query(queries.order.getOrderStatistics, [organizationId]);
      return result.rows[0] || {};
    } catch (error) {
      throw new Error('Failed to retrieve order statistics');
    }
  }
}

module.exports = OrderRepository;
