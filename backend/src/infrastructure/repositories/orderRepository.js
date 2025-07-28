const { queries } = require('../database/queries');

class OrderRepository {
  constructor(db) {
    this.db = db;
  }

  // === ORDER CRUD METHODS ===

  async findAll(organizationId, options = {}) {
    try {
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc', status, priority, client_id, project_id, assigned_to } = options;
      const offset = (page - 1) * limit;

      const result = await this.db.query(queries.order.findAllOrders, [
        organizationId,
        status,
        priority,
        client_id,
        project_id,
        assigned_to,
        sortBy,
        sortOrder,
        limit,
        offset
      ]);

      const countResult = await this.db.query(queries.order.countOrders, [organizationId, status, priority, client_id, project_id, assigned_to]);
      const totalCount = parseInt(countResult.rows[0].count, 10);

      return {
        orders: result.rows,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      };
    } catch (error) {
      throw new Error('Failed to find orders');
    }
  }

  async findById(id, organizationId) {
    try {
      const result = await this.db.query(queries.order.findOrderById, [id, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to find order by ID');
    }
  }

  async create(orderData) {
    try {
      const result = await this.db.query(queries.order.createOrder, [
        orderData.title,
        orderData.description,
        orderData.client_id,
        orderData.project_id,
        orderData.status,
        orderData.priority,
        orderData.due_date,
        orderData.assigned_to,
        orderData.tags,
        orderData.notes,
        orderData.organization_id,
        orderData.created_by
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error('Failed to create order');
    }
  }

  async update(id, organizationId, updateData) {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          fields.push(`${key} = $${paramCount}`);
          values.push(updateData[key]);
          paramCount++;
        }
      });

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      fields.push('updated_at = NOW()');
      values.push(id, organizationId);

      const query = `UPDATE orders SET ${fields.join(', ')} WHERE id = $${paramCount} AND organization_id = $${paramCount + 1} RETURNING *`;
      const result = await this.db.query(query, values);

      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to update order');
    }
  }

  async delete(id, organizationId) {
    try {
      const result = await this.db.query(queries.order.deleteOrder, [id, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to delete order');
    }
  }

  async search(organizationId, searchTerm, options = {}) {
    try {
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;
      const offset = (page - 1) * limit;

      const result = await this.db.query(queries.order.searchOrders, [
        organizationId,
        searchTerm,
        sortBy,
        sortOrder,
        limit,
        offset
      ]);

      const countResult = await this.db.query(queries.order.countSearchOrders, [organizationId, searchTerm]);
      const totalCount = parseInt(countResult.rows[0].count, 10);

      return {
        orders: result.rows,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      };
    } catch (error) {
      throw new Error('Failed to search orders');
    }
  }

  async updateStatus(id, organizationId, status, notes) {
    try {
      const result = await this.db.query(queries.order.updateOrderStatus, [id, organizationId, status, notes]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to update order status');
    }
  }

  async assign(id, organizationId, assigned_to) {
    try {
      const result = await this.db.query(queries.order.assignOrder, [id, organizationId, assigned_to]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to assign order');
    }
  }

  // === ORDER ITEMS METHODS ===

  async getItems(orderId, organizationId, options = {}) {
    try {
      const { category, page = 1, limit = 10 } = options;
      const offset = (page - 1) * limit;

      const result = await this.db.query(queries.order.findAllOrderItems, [
        orderId,
        organizationId,
        category,
        limit,
        offset
      ]);

      const countResult = await this.db.query(queries.order.countOrderItems, [orderId, organizationId, category]);
      const totalCount = parseInt(countResult.rows[0].count, 10);

      return {
        items: result.rows,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      };
    } catch (error) {
      throw new Error('Failed to get order items');
    }
  }

  async getItemById(id, organizationId) {
    try {
      const result = await this.db.query(queries.order.findOrderItemById, [id, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to find order item by ID');
    }
  }

  async createItem(itemData) {
    try {
      const result = await this.db.query(queries.order.createOrderItem, [
        itemData.order_id,
        itemData.name,
        itemData.description,
        itemData.quantity,
        itemData.unit_price,
        itemData.unit_type,
        itemData.category,
        itemData.tax_rate,
        itemData.discount_percentage,
        itemData.notes,
        itemData.organization_id
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error('Failed to create order item');
    }
  }

  async updateItem(id, organizationId, updateData) {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          fields.push(`${key} = $${paramCount}`);
          values.push(updateData[key]);
          paramCount++;
        }
      });

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      fields.push('updated_at = NOW()');
      values.push(id, organizationId);

      const query = `UPDATE order_items SET ${fields.join(', ')} WHERE id = $${paramCount} AND organization_id = $${paramCount + 1} RETURNING *`;
      const result = await this.db.query(query, values);

      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to update order item');
    }
  }

  async deleteItem(id, organizationId) {
    try {
      const result = await this.db.query(queries.order.deleteOrderItem, [id, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to delete order item');
    }
  }

  async calculateTotals(orderId, organizationId) {
    try {
      const result = await this.db.query(queries.order.calculateOrderTotals, [orderId, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to calculate order totals');
    }
  }

  async bulkCreateItems(orderId, organizationId, items) {
    try {
      const createdItems = [];

      for (const item of items) {
        const result = await this.db.query(queries.order.createOrderItem, [
          orderId,
          item.name,
          item.description,
          item.quantity,
          item.unit_price,
          item.unit_type,
          item.category,
          item.tax_rate,
          item.discount_percentage,
          item.notes,
          organizationId
        ]);
        createdItems.push(result.rows[0]);
      }

      return createdItems;
    } catch (error) {
      throw new Error('Failed to bulk create order items');
    }
  }

  async importItems(orderId, organizationId, file) {
    try {
      // This is a placeholder implementation
      // In a real implementation, you would:
      // 1. Parse the uploaded file (CSV, Excel, etc.)
      // 2. Validate the data
      // 3. Insert into database
      // 4. Handle errors and rollback if needed

      return {
        success: true,
        imported: 0,
        errors: [],
        message: 'Import functionality to be implemented'
      };
    } catch (error) {
      throw new Error('Failed to import order items');
    }
  }

  async exportItems(orderId, organizationId, format = 'csv') {
    try {
      // This is a placeholder implementation
      // In a real implementation, you would:
      // 1. Query order items based on order_id
      // 2. Format data according to format type
      // 3. Generate file and return

      const items = await this.getItems(orderId, organizationId, { page: 1, limit: 1000 });

      let data, contentType, filename;

      switch (format) {
        case 'csv':
          data = this.convertToCSV(items.items);
          contentType = 'text/csv';
          filename = `order_items_${orderId}_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'xlsx':
          data = this.convertToXLSX(items.items);
          contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          filename = `order_items_${orderId}_${new Date().toISOString().split('T')[0]}.xlsx`;
          break;
        case 'json':
          data = JSON.stringify(items.items, null, 2);
          contentType = 'application/json';
          filename = `order_items_${orderId}_${new Date().toISOString().split('T')[0]}.json`;
          break;
        default:
          throw new Error('Unsupported export format');
      }

      return {
        data,
        contentType,
        filename
      };
    } catch (error) {
      throw new Error('Failed to export order items');
    }
  }

  // Helper methods for export
  convertToCSV(items) {
    const headers = ['ID', 'Name', 'Description', 'Quantity', 'Unit Price', 'Unit Type', 'Category', 'Tax Rate', 'Discount %', 'Subtotal', 'Created At'];
    const rows = items.map(item => [
      item.id,
      item.name,
      item.description || '',
      item.quantity,
      item.unit_price,
      item.unit_type,
      item.category,
      item.tax_rate,
      item.discount_percentage,
      (item.quantity * item.unit_price * (1 - item.discount_percentage / 100)).toFixed(2),
      item.created_at
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  convertToXLSX(items) {
    // Placeholder - would use a library like xlsx
    return this.convertToCSV(items);
  }
}

module.exports = OrderRepository;
