const { queries } = require('../database/queries');

class InvoiceRepository {
  constructor(db) {
    this.db = db;
  }

  // === INVOICE CRUD METHODS ===

  // Find all invoices
  async findAll(organizationId, options = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'desc',
      status,
      client_id,
      project_id,
      payment_method,
      created_by
    } = options;

    const offset = (page - 1) * limit;

    try {
      const result = await this.db.query(queries.invoice.findAll, [
        organizationId,
        status,
        client_id,
        project_id,
        payment_method,
        created_by,
        limit,
        offset,
        sortBy,
        sortOrder
      ]);

      const countResult = await this.db.query(queries.invoice.countInvoices, [
        organizationId,
        status,
        client_id,
        project_id,
        payment_method,
        created_by
      ]);

      return {
        invoices: result.rows,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total: parseInt(countResult.rows[0].count, 10),
          totalPages: Math.ceil(parseInt(countResult.rows[0].count, 10) / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Find invoice by ID
  async findById(id, organizationId) {
    try {
      const result = await this.db.query(queries.invoice.findInvoiceById, [id, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Create invoice
  async create(invoiceData) {
    try {
      const result = await this.db.query(queries.invoice.createInvoice, [
        invoiceData.project_id,
        invoiceData.client_id,
        invoiceData.invoice_number,
        invoiceData.title,
        invoiceData.description,
        invoiceData.status,
        invoiceData.due_date,
        invoiceData.issue_date,
        invoiceData.payment_terms,
        invoiceData.subtotal,
        invoiceData.tax_rate,
        invoiceData.tax_amount,
        invoiceData.discount_percentage,
        invoiceData.discount_amount,
        invoiceData.total_amount,
        invoiceData.currency,
        invoiceData.notes,
        invoiceData.payment_method,
        invoiceData.payment_reference,
        invoiceData.organization_id,
        invoiceData.created_by
      ]);

      const invoice = result.rows[0];

      // Create invoice items if provided
      if (invoiceData.items && invoiceData.items.length > 0) {
        for (const item of invoiceData.items) {
          await this.db.query(queries.invoice.createInvoiceItem, [
            invoice.id,
            item.name,
            item.description,
            item.quantity,
            item.unit_price,
            item.unit_type,
            item.tax_rate,
            item.discount_percentage,
            item.total,
            invoiceData.organization_id
          ]);
        }
      }

      return invoice;
    } catch (error) {
      throw error;
    }
  }

  // Update invoice
  async update(id, organizationId, updateData) {
    try {
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      // Build dynamic update query
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          setClause.push(`${key} = $${paramIndex}`);
          values.push(updateData[key]);
          paramIndex++;
        }
      });

      if (setClause.length === 0) {
        return null;
      }

      values.push(new Date(), organizationId, id);
      const query = `
        UPDATE invoices
        SET ${setClause.join(', ')}, updated_at = $${paramIndex}
        WHERE organization_id = $${paramIndex + 1} AND id = $${paramIndex + 2} AND is_active = true
        RETURNING *
      `;

      const result = await this.db.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Delete invoice
  async delete(id, organizationId) {
    try {
      const result = await this.db.query(queries.invoice.deleteInvoice, [id, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Search invoices
  async search(organizationId, searchTerm, options = {}) {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;

    try {
      const result = await this.db.query(queries.invoice.searchInvoices, [
        organizationId,
        searchTerm,
        limit,
        offset,
        sortBy,
        sortOrder
      ]);

      const countResult = await this.db.query(queries.invoice.countSearchInvoices, [
        organizationId,
        searchTerm
      ]);

      return {
        invoices: result.rows,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total: parseInt(countResult.rows[0].count, 10),
          totalPages: Math.ceil(parseInt(countResult.rows[0].count, 10) / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Update invoice status
  async updateStatus(id, organizationId, statusData) {
    try {
      const result = await this.db.query(queries.invoice.updateInvoiceStatus, [
        id,
        organizationId,
        statusData.status,
        statusData.payment_date,
        statusData.payment_method,
        statusData.payment_reference,
        statusData.notes
      ]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Send invoice
  async sendInvoice(id, organizationId, sendData) {
    try {
      // Update invoice status to 'sent'
      const result = await this.db.query(queries.invoice.updateInvoiceStatus, [
        id,
        organizationId,
        'sent',
        null,
        null,
        null,
        sendData.message
      ]);

      // Here you would integrate with email service
      // For now, just return the updated invoice
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // === INVOICE ITEMS METHODS ===

  // Get invoice items
  async getItems(invoiceId, organizationId, options = {}) {
    const { page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    try {
      const result = await this.db.query(queries.invoice.getInvoiceItems, [
        invoiceId,
        organizationId,
        limit,
        offset
      ]);

      const countResult = await this.db.query(queries.invoice.countInvoiceItems, [
        invoiceId,
        organizationId
      ]);

      return {
        items: result.rows,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total: parseInt(countResult.rows[0].count, 10),
          totalPages: Math.ceil(parseInt(countResult.rows[0].count, 10) / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get invoice item by ID
  async getItemById(id, organizationId) {
    try {
      const result = await this.db.query(queries.invoice.findInvoiceItemById, [id, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Create invoice item
  async createItem(itemData) {
    try {
      const result = await this.db.query(queries.invoice.createInvoiceItem, [
        itemData.invoice_id,
        itemData.name,
        itemData.description,
        itemData.quantity,
        itemData.unit_price,
        itemData.unit_type,
        itemData.tax_rate,
        itemData.discount_percentage,
        itemData.total,
        itemData.organization_id
      ]);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update invoice item
  async updateItem(id, organizationId, updateData) {
    try {
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      // Build dynamic update query
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          setClause.push(`${key} = $${paramIndex}`);
          values.push(updateData[key]);
          paramIndex++;
        }
      });

      if (setClause.length === 0) {
        return null;
      }

      values.push(new Date(), organizationId, id);
      const query = `
        UPDATE invoice_items
        SET ${setClause.join(', ')}, updated_at = $${paramIndex}
        WHERE organization_id = $${paramIndex + 1} AND id = $${paramIndex + 2} AND is_active = true
        RETURNING *
      `;

      const result = await this.db.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Delete invoice item
  async deleteItem(id, organizationId) {
    try {
      const result = await this.db.query(queries.invoice.deleteInvoiceItem, [id, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // === PAYMENT INTEGRATION METHODS ===

  // Process payment
  async processPayment(invoiceId, organizationId, paymentData) {
    try {
      // Create payment record
      const result = await this.db.query(queries.invoice.createPayment, [
        invoiceId,
        paymentData.payment_method,
        paymentData.amount,
        paymentData.currency,
        paymentData.payment_reference,
        paymentData.transaction_id,
        paymentData.payment_date,
        paymentData.notes,
        organizationId
      ]);

      // Update invoice status to 'paid'
      await this.db.query(queries.invoice.updateInvoiceStatus, [
        invoiceId,
        organizationId,
        'paid',
        paymentData.payment_date,
        paymentData.payment_method,
        paymentData.payment_reference,
        paymentData.notes
      ]);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Verify payment
  async verifyPayment(invoiceId, organizationId, verificationData) {
    try {
      // Here you would integrate with payment gateway to verify the transaction
      // For now, just return a mock verification result
      const result = await this.db.query(queries.invoice.verifyPayment, [
        invoiceId,
        organizationId,
        verificationData.transaction_id,
        verificationData.payment_method
      ]);

      return {
        verified: true,
        transaction_id: verificationData.transaction_id,
        payment_method: verificationData.payment_method,
        verification_date: new Date()
      };
    } catch (error) {
      throw error;
    }
  }

  // === INVOICE STATISTICS METHODS ===

  // Get invoice statistics
  async getStatistics(organizationId) {
    try {
      const result = await this.db.query(queries.invoice.getInvoiceStatistics, [organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Get payment statistics
  async getPaymentStatistics(organizationId) {
    try {
      const result = await this.db.query(queries.invoice.getPaymentStatistics, [organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = InvoiceRepository;
