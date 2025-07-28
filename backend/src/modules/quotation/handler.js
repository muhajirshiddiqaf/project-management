const Boom = require('@hapi/boom');

class QuotationHandler {
  constructor() {
    this.quotationRepository = null;
  }

  // Set repository (dependency injection)
  setQuotationRepository(quotationRepository) {
    this.quotationRepository = quotationRepository;
  }

  // === QUOTATION CRUD METHODS ===

  // Get all quotations
  async getQuotations(request, h) {
    try {
      const { organizationId } = request;
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc', status, client_id, project_id, created_by } = request.query;

      const quotations = await this.quotationRepository.findAll(organizationId, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sortBy,
        sortOrder,
        status,
        client_id,
        project_id,
        created_by
      });

      return h.response({
        success: true,
        message: 'Quotations retrieved successfully',
        data: quotations
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve quotations');
    }
  }

  // Get quotation by ID
  async getQuotationById(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;

      const quotation = await this.quotationRepository.findById(id, organizationId);

      if (!quotation) {
        throw Boom.notFound('Quotation not found');
      }

      return h.response({
        success: true,
        message: 'Quotation retrieved successfully',
        data: quotation
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to retrieve quotation');
    }
  }

  // Create new quotation
  async createQuotation(request, h) {
    try {
      const { organizationId, userId } = request;
      const quotationData = request.payload;

      const quotation = await this.quotationRepository.create({
        ...quotationData,
        organization_id: organizationId,
        created_by: userId
      });

      return h.response({
        success: true,
        message: 'Quotation created successfully',
        data: quotation
      }).code(201);
    } catch (error) {
      throw Boom.internal('Failed to create quotation');
    }
  }

  // Update quotation
  async updateQuotation(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;
      const updateData = request.payload;

      const quotation = await this.quotationRepository.update(id, organizationId, updateData);

      if (!quotation) {
        throw Boom.notFound('Quotation not found');
      }

      return h.response({
        success: true,
        message: 'Quotation updated successfully',
        data: quotation
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update quotation');
    }
  }

  // Delete quotation
  async deleteQuotation(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;

      const deleted = await this.quotationRepository.delete(id, organizationId);

      if (!deleted) {
        throw Boom.notFound('Quotation not found');
      }

      return h.response({
        success: true,
        message: 'Quotation deleted successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to delete quotation');
    }
  }

  // Search quotations
  async searchQuotations(request, h) {
    try {
      const { organizationId } = request;
      const { q, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = request.query;

      const quotations = await this.quotationRepository.search(organizationId, q, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sortBy,
        sortOrder
      });

      return h.response({
        success: true,
        message: 'Quotations search completed',
        data: quotations
      });
    } catch (error) {
      throw Boom.internal('Failed to search quotations');
    }
  }

  // Update quotation status
  async updateQuotationStatus(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;
      const { status, approval_notes, approved_by, approved_at } = request.payload;

      const quotation = await this.quotationRepository.updateStatus(id, organizationId, {
        status,
        approval_notes,
        approved_by,
        approved_at
      });

      if (!quotation) {
        throw Boom.notFound('Quotation not found');
      }

      return h.response({
        success: true,
        message: 'Quotation status updated successfully',
        data: quotation
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update quotation status');
    }
  }

  // Send quotation
  async sendQuotation(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;
      const { email_template, subject, message, send_copy_to } = request.payload;

      const result = await this.quotationRepository.sendQuotation(id, organizationId, {
        email_template,
        subject,
        message,
        send_copy_to
      });

      if (!result) {
        throw Boom.notFound('Quotation not found');
      }

      return h.response({
        success: true,
        message: 'Quotation sent successfully',
        data: result
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to send quotation');
    }
  }

  // Generate quotation from project
  async generateFromProject(request, h) {
    try {
      const { organizationId, userId } = request;
      const generationData = request.payload;

      const quotation = await this.quotationRepository.generateFromProject({
        ...generationData,
        organization_id: organizationId,
        created_by: userId
      });

      return h.response({
        success: true,
        message: 'Quotation generated from project successfully',
        data: quotation
      }).code(201);
    } catch (error) {
      throw Boom.internal('Failed to generate quotation from project');
    }
  }

  // === QUOTATION ITEMS METHODS ===

  // Get quotation items
  async getQuotationItems(request, h) {
    try {
      const { organizationId } = request;
      const { quotation_id, page = 1, limit = 10 } = request.query;

      const items = await this.quotationRepository.getItems(quotation_id, organizationId, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
      });

      return h.response({
        success: true,
        message: 'Quotation items retrieved successfully',
        data: items
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve quotation items');
    }
  }

  // Get quotation item by ID
  async getQuotationItemById(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;

      const item = await this.quotationRepository.getItemById(id, organizationId);

      if (!item) {
        throw Boom.notFound('Quotation item not found');
      }

      return h.response({
        success: true,
        message: 'Quotation item retrieved successfully',
        data: item
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to retrieve quotation item');
    }
  }

  // Create quotation item
  async createQuotationItem(request, h) {
    try {
      const { organizationId } = request;
      const itemData = request.payload;

      const item = await this.quotationRepository.createItem({
        ...itemData,
        organization_id: organizationId
      });

      return h.response({
        success: true,
        message: 'Quotation item created successfully',
        data: item
      }).code(201);
    } catch (error) {
      throw Boom.internal('Failed to create quotation item');
    }
  }

  // Update quotation item
  async updateQuotationItem(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;
      const updateData = request.payload;

      const item = await this.quotationRepository.updateItem(id, organizationId, updateData);

      if (!item) {
        throw Boom.notFound('Quotation item not found');
      }

      return h.response({
        success: true,
        message: 'Quotation item updated successfully',
        data: item
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update quotation item');
    }
  }

  // Delete quotation item
  async deleteQuotationItem(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;

      const deleted = await this.quotationRepository.deleteItem(id, organizationId);

      if (!deleted) {
        throw Boom.notFound('Quotation item not found');
      }

      return h.response({
        success: true,
        message: 'Quotation item deleted successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to delete quotation item');
    }
  }

  // === QUOTATION APPROVAL METHODS ===

  // Approve quotation
  async approveQuotation(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;
      const { approval_notes, approved_by } = request.payload;

      const quotation = await this.quotationRepository.approve(id, organizationId, {
        approval_notes,
        approved_by
      });

      if (!quotation) {
        throw Boom.notFound('Quotation not found');
      }

      return h.response({
        success: true,
        message: 'Quotation approved successfully',
        data: quotation
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to approve quotation');
    }
  }

  // Reject quotation
  async rejectQuotation(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;
      const { rejection_reason, rejected_by } = request.payload;

      const quotation = await this.quotationRepository.reject(id, organizationId, {
        rejection_reason,
        rejected_by
      });

      if (!quotation) {
        throw Boom.notFound('Quotation not found');
      }

      return h.response({
        success: true,
        message: 'Quotation rejected successfully',
        data: quotation
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to reject quotation');
    }
  }

  // === QUOTATION STATISTICS METHODS ===

  // Get quotation statistics
  async getQuotationStatistics(request, h) {
    try {
      const { organizationId } = request;

      const statistics = await this.quotationRepository.getStatistics(organizationId);

      return h.response({
        success: true,
        message: 'Quotation statistics retrieved successfully',
        data: statistics
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve quotation statistics');
    }
  }

  // Get quotation conversion statistics
  async getQuotationConversionStatistics(request, h) {
    try {
      const { organizationId } = request;

      const statistics = await this.quotationRepository.getConversionStatistics(organizationId);

      return h.response({
        success: true,
        message: 'Quotation conversion statistics retrieved successfully',
        data: statistics
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve quotation conversion statistics');
    }
  }
}

module.exports = new QuotationHandler();
