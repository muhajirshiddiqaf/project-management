const Boom = require('@hapi/boom');

class InvoiceHandler {
  constructor() {
    this.invoiceRepository = null;
  }

  // Set repository (dependency injection)
  setInvoiceRepository(invoiceRepository) {
    this.invoiceRepository = invoiceRepository;
  }

  // === INVOICE CRUD METHODS ===

  // Get all invoices
  async getInvoices(request, h) {
    try {
      const { organizationId } = request;
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc', status, client_id, project_id, payment_method, created_by } = request.query;

      const invoices = await this.invoiceRepository.findAll(organizationId, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sortBy,
        sortOrder,
        status,
        client_id,
        project_id,
        payment_method,
        created_by
      });

      return h.response({
        success: true,
        message: 'Invoices retrieved successfully',
        data: invoices
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve invoices');
    }
  }

  // Get invoice by ID
  async getInvoiceById(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;

      const invoice = await this.invoiceRepository.findById(id, organizationId);

      if (!invoice) {
        throw Boom.notFound('Invoice not found');
      }

      return h.response({
        success: true,
        message: 'Invoice retrieved successfully',
        data: invoice
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to retrieve invoice');
    }
  }

  // Create new invoice
  async createInvoice(request, h) {
    try {
      const { organizationId, userId } = request;
      const invoiceData = request.payload;

      const invoice = await this.invoiceRepository.create({
        ...invoiceData,
        organization_id: organizationId,
        created_by: userId
      });

      return h.response({
        success: true,
        message: 'Invoice created successfully',
        data: invoice
      }).code(201);
    } catch (error) {
      throw Boom.internal('Failed to create invoice');
    }
  }

  // Update invoice
  async updateInvoice(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;
      const updateData = request.payload;

      const invoice = await this.invoiceRepository.update(id, organizationId, updateData);

      if (!invoice) {
        throw Boom.notFound('Invoice not found');
      }

      return h.response({
        success: true,
        message: 'Invoice updated successfully',
        data: invoice
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update invoice');
    }
  }

  // Delete invoice
  async deleteInvoice(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;

      const deleted = await this.invoiceRepository.delete(id, organizationId);

      if (!deleted) {
        throw Boom.notFound('Invoice not found');
      }

      return h.response({
        success: true,
        message: 'Invoice deleted successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to delete invoice');
    }
  }

  // Search invoices
  async searchInvoices(request, h) {
    try {
      const { organizationId } = request;
      const { q, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = request.query;

      const invoices = await this.invoiceRepository.search(organizationId, q, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sortBy,
        sortOrder
      });

      return h.response({
        success: true,
        message: 'Invoices search completed',
        data: invoices
      });
    } catch (error) {
      throw Boom.internal('Failed to search invoices');
    }
  }

  // Update invoice status
  async updateInvoiceStatus(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;
      const { status, payment_date, payment_method, payment_reference, notes } = request.payload;

      const invoice = await this.invoiceRepository.updateStatus(id, organizationId, {
        status,
        payment_date,
        payment_method,
        payment_reference,
        notes
      });

      if (!invoice) {
        throw Boom.notFound('Invoice not found');
      }

      return h.response({
        success: true,
        message: 'Invoice status updated successfully',
        data: invoice
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update invoice status');
    }
  }

  // Send invoice
  async sendInvoice(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;
      const { email_template, subject, message, send_copy_to } = request.payload;

      const result = await this.invoiceRepository.sendInvoice(id, organizationId, {
        email_template,
        subject,
        message,
        send_copy_to
      });

      if (!result) {
        throw Boom.notFound('Invoice not found');
      }

      return h.response({
        success: true,
        message: 'Invoice sent successfully',
        data: result
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to send invoice');
    }
  }

  // === INVOICE ITEMS METHODS ===

  // Get invoice items
  async getInvoiceItems(request, h) {
    try {
      const { organizationId } = request;
      const { invoice_id, page = 1, limit = 10 } = request.query;

      const items = await this.invoiceRepository.getItems(invoice_id, organizationId, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
      });

      return h.response({
        success: true,
        message: 'Invoice items retrieved successfully',
        data: items
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve invoice items');
    }
  }

  // Get invoice item by ID
  async getInvoiceItemById(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;

      const item = await this.invoiceRepository.getItemById(id, organizationId);

      if (!item) {
        throw Boom.notFound('Invoice item not found');
      }

      return h.response({
        success: true,
        message: 'Invoice item retrieved successfully',
        data: item
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to retrieve invoice item');
    }
  }

  // Create invoice item
  async createInvoiceItem(request, h) {
    try {
      const { organizationId } = request;
      const itemData = request.payload;

      const item = await this.invoiceRepository.createItem({
        ...itemData,
        organization_id: organizationId
      });

      return h.response({
        success: true,
        message: 'Invoice item created successfully',
        data: item
      }).code(201);
    } catch (error) {
      throw Boom.internal('Failed to create invoice item');
    }
  }

  // Update invoice item
  async updateInvoiceItem(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;
      const updateData = request.payload;

      const item = await this.invoiceRepository.updateItem(id, organizationId, updateData);

      if (!item) {
        throw Boom.notFound('Invoice item not found');
      }

      return h.response({
        success: true,
        message: 'Invoice item updated successfully',
        data: item
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update invoice item');
    }
  }

  // Delete invoice item
  async deleteInvoiceItem(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;

      const deleted = await this.invoiceRepository.deleteItem(id, organizationId);

      if (!deleted) {
        throw Boom.notFound('Invoice item not found');
      }

      return h.response({
        success: true,
        message: 'Invoice item deleted successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to delete invoice item');
    }
  }

  // === PAYMENT INTEGRATION METHODS ===

  // Process payment
  async processPayment(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;
      const paymentData = request.payload;

      const payment = await this.invoiceRepository.processPayment(id, organizationId, paymentData);

      if (!payment) {
        throw Boom.notFound('Invoice not found');
      }

      return h.response({
        success: true,
        message: 'Payment processed successfully',
        data: payment
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to process payment');
    }
  }

  // Verify payment
  async verifyPayment(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;
      const { transaction_id, payment_method } = request.payload;

      const verification = await this.invoiceRepository.verifyPayment(id, organizationId, {
        transaction_id,
        payment_method
      });

      if (!verification) {
        throw Boom.notFound('Invoice not found');
      }

      return h.response({
        success: true,
        message: 'Payment verification completed',
        data: verification
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to verify payment');
    }
  }

  // === INVOICE STATISTICS METHODS ===

  // Get invoice statistics
  async getInvoiceStatistics(request, h) {
    try {
      const { organizationId } = request;

      const statistics = await this.invoiceRepository.getStatistics(organizationId);

      return h.response({
        success: true,
        message: 'Invoice statistics retrieved successfully',
        data: statistics
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve invoice statistics');
    }
  }

  // Get payment statistics
  async getPaymentStatistics(request, h) {
    try {
      const { organizationId } = request;

      const statistics = await this.invoiceRepository.getPaymentStatistics(organizationId);

      return h.response({
        success: true,
        message: 'Payment statistics retrieved successfully',
        data: statistics
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve payment statistics');
    }
  }
}

module.exports = new InvoiceHandler();
