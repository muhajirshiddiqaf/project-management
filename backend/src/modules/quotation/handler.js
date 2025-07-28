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
  async getQuotations(request, h) {
    try {
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC', status, client_id } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      const filters = { status, client_id };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sortBy, sortOrder };

      const quotations = await this.quotationRepository.findAll(organizationId, filters, pagination);
      const total = await this.quotationRepository.countQuotations(organizationId, filters);

      return h.response({
        success: true,
        data: quotations,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          totalPages: Math.ceil(total / parseInt(limit, 10))
        }
      }).code(200);
    } catch (error) {
      console.error('Error getting quotations:', error);
      throw Boom.internal('Failed to get quotations');
    }
  }

  async getQuotationById(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;

      const quotation = await this.quotationRepository.findById(id, organizationId);
      if (!quotation) {
        throw Boom.notFound('Quotation not found');
      }

      return h.response({
        success: true,
        data: quotation
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error getting quotation:', error);
      throw Boom.internal('Failed to get quotation');
    }
  }

  async createQuotation(request, h) {
    try {
      const quotationData = {
        ...request.payload,
        organization_id: request.auth.credentials.organization_id,
        created_by: request.auth.credentials.user_id,
        issue_date: new Date()
      };

      // Generate quotation number if not provided
      if (!quotationData.quotation_number) {
        const numberResult = await this.quotationRepository.generateQuotationNumber(quotationData.organization_id);
        quotationData.quotation_number = numberResult.quotation_number;
      }

      const quotation = await this.quotationRepository.create(quotationData);

      return h.response({
        success: true,
        message: 'Quotation created successfully',
        data: quotation
      }).code(201);
    } catch (error) {
      console.error('Error creating quotation:', error);
      throw Boom.internal('Failed to create quotation');
    }
  }

  async updateQuotation(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;
      const updateData = request.payload;

      const quotation = await this.quotationRepository.update(id, organizationId, updateData);
      if (!quotation) {
        throw Boom.notFound('Quotation not found');
      }

      return h.response({
        success: true,
        message: 'Quotation updated successfully',
        data: quotation
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error updating quotation:', error);
      throw Boom.internal('Failed to update quotation');
    }
  }

  async deleteQuotation(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;

      const quotation = await this.quotationRepository.delete(id, organizationId);
      if (!quotation) {
        throw Boom.notFound('Quotation not found');
      }

      return h.response({
        success: true,
        message: 'Quotation deleted successfully'
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error deleting quotation:', error);
      throw Boom.internal('Failed to delete quotation');
    }
  }

  async searchQuotations(request, h) {
    try {
      const { q, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC' } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      if (!q) {
        throw Boom.badRequest('Search query is required');
      }

      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sortBy, sortOrder };
      const quotations = await this.quotationRepository.search(organizationId, q, {}, pagination);
      const total = await this.quotationRepository.countSearchQuotations(organizationId, q, {});

      return h.response({
        success: true,
        data: quotations,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          totalPages: Math.ceil(total / parseInt(limit, 10))
        }
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error searching quotations:', error);
      throw Boom.internal('Failed to search quotations');
    }
  }

  async updateQuotationStatus(request, h) {
    try {
      const { id } = request.params;
      const { status } = request.payload;
      const organizationId = request.auth.credentials.organization_id;
      const userId = request.auth.credentials.user_id;

      const quotation = await this.quotationRepository.updateStatus(id, organizationId, status, userId);
      if (!quotation) {
        throw Boom.notFound('Quotation not found');
      }

      return h.response({
        success: true,
        message: 'Quotation status updated successfully',
        data: quotation
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error updating quotation status:', error);
      throw Boom.internal('Failed to update quotation status');
    }
  }

  async approveQuotation(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;
      const userId = request.auth.credentials.user_id;

      const quotation = await this.quotationRepository.approveQuotation(id, organizationId, userId);
      if (!quotation) {
        throw Boom.notFound('Quotation not found');
      }

      return h.response({
        success: true,
        message: 'Quotation approved successfully',
        data: quotation
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error approving quotation:', error);
      throw Boom.internal('Failed to approve quotation');
    }
  }

  // === QUOTATION ITEMS METHODS ===
  async getQuotationItems(request, h) {
    try {
      const { quotation_id } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      if (!quotation_id) {
        throw Boom.badRequest('Quotation ID is required');
      }

      const items = await this.quotationRepository.getQuotationItems(quotation_id, organizationId);
      const total = await this.quotationRepository.countQuotationItems(quotation_id, organizationId);

      return h.response({
        success: true,
        data: items,
        total
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error getting quotation items:', error);
      throw Boom.internal('Failed to get quotation items');
    }
  }

  async getQuotationItemById(request, h) {
    try {
      const { id } = request.params;
      const { quotation_id } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      if (!quotation_id) {
        throw Boom.badRequest('Quotation ID is required');
      }

      const item = await this.quotationRepository.getQuotationItemById(id, quotation_id, organizationId);
      if (!item) {
        throw Boom.notFound('Quotation item not found');
      }

      return h.response({
        success: true,
        data: item
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error getting quotation item:', error);
      throw Boom.internal('Failed to get quotation item');
    }
  }

  async createQuotationItem(request, h) {
    try {
      const itemData = {
        ...request.payload,
        quotation_id: request.payload.quotation_id
      };

      const item = await this.quotationRepository.createQuotationItem(itemData);

      return h.response({
        success: true,
        message: 'Quotation item created successfully',
        data: item
      }).code(201);
    } catch (error) {
      console.error('Error creating quotation item:', error);
      throw Boom.internal('Failed to create quotation item');
    }
  }

  async updateQuotationItem(request, h) {
    try {
      const { id } = request.params;
      const { quotation_id } = request.query;
      const organizationId = request.auth.credentials.organization_id;
      const updateData = request.payload;

      if (!quotation_id) {
        throw Boom.badRequest('Quotation ID is required');
      }

      const item = await this.quotationRepository.updateQuotationItem(id, quotation_id, organizationId, updateData);
      if (!item) {
        throw Boom.notFound('Quotation item not found');
      }

      return h.response({
        success: true,
        message: 'Quotation item updated successfully',
        data: item
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error updating quotation item:', error);
      throw Boom.internal('Failed to update quotation item');
    }
  }

  async deleteQuotationItem(request, h) {
    try {
      const { id } = request.params;
      const { quotation_id } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      if (!quotation_id) {
        throw Boom.badRequest('Quotation ID is required');
      }

      const item = await this.quotationRepository.deleteQuotationItem(id, quotation_id, organizationId);
      if (!item) {
        throw Boom.notFound('Quotation item not found');
      }

      return h.response({
        success: true,
        message: 'Quotation item deleted successfully'
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error deleting quotation item:', error);
      throw Boom.internal('Failed to delete quotation item');
    }
  }

  // === QUOTATION CALCULATION METHODS ===
  async calculateQuotationTotals(request, h) {
    try {
      const { quotation_id } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      if (!quotation_id) {
        throw Boom.badRequest('Quotation ID is required');
      }

      const totals = await this.quotationRepository.calculateQuotationTotals(quotation_id, organizationId);

      return h.response({
        success: true,
        data: totals
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error calculating quotation totals:', error);
      throw Boom.internal('Failed to calculate quotation totals');
    }
  }

  // === QUOTATION GENERATION FROM PROJECT ===
  async generateQuotationFromProject(request, h) {
    try {
      const { project_id, template_id } = request.payload;
      const organizationId = request.auth.credentials.organization_id;
      const userId = request.auth.credentials.user_id;

      // Get project details and cost breakdown
      const project = await this.getProjectDetails(project_id, organizationId);
      if (!project) {
        throw Boom.notFound('Project not found');
      }

      // Get template if specified
      const template = template_id ? await this.getQuotationTemplate(template_id, organizationId) : null;

      // Generate quotation data from project
      const quotationData = await this.buildQuotationFromProject(project, template, organizationId, userId);

      // Create quotation
      const quotation = await this.quotationRepository.create(quotationData);

      // Generate quotation items from project costs
      await this.generateQuotationItemsFromProject(quotation.id, project, organizationId);

      return h.response({
        success: true,
        message: 'Quotation generated from project successfully',
        data: quotation
      }).code(201);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error generating quotation from project:', error);
      throw Boom.internal('Failed to generate quotation from project');
    }
  }

  async getQuotationTemplates(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const { page = 1, limit = 10 } = request.query;

      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10) };
      const templates = await this.quotationRepository.getQuotationTemplates(organizationId, pagination);
      const total = await this.quotationRepository.countQuotationTemplates(organizationId);

      return h.response({
        success: true,
        data: templates,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          totalPages: Math.ceil(total / parseInt(limit, 10))
        }
      }).code(200);
    } catch (error) {
      console.error('Error getting quotation templates:', error);
      throw Boom.internal('Failed to get quotation templates');
    }
  }

  async createQuotationTemplate(request, h) {
    try {
      const templateData = {
        ...request.payload,
        organization_id: request.auth.credentials.organization_id,
        created_by: request.auth.credentials.user_id
      };

      const template = await this.quotationRepository.createQuotationTemplate(templateData);

      return h.response({
        success: true,
        message: 'Quotation template created successfully',
        data: template
      }).code(201);
    } catch (error) {
      console.error('Error creating quotation template:', error);
      throw Boom.internal('Failed to create quotation template');
    }
  }

  async updateQuotationTemplate(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;
      const updateData = request.payload;

      const template = await this.quotationRepository.updateQuotationTemplate(id, organizationId, updateData);
      if (!template) {
        throw Boom.notFound('Quotation template not found');
      }

      return h.response({
        success: true,
        message: 'Quotation template updated successfully',
        data: template
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error updating quotation template:', error);
      throw Boom.internal('Failed to update quotation template');
    }
  }

  async deleteQuotationTemplate(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;

      const template = await this.quotationRepository.deleteQuotationTemplate(id, organizationId);
      if (!template) {
        throw Boom.notFound('Quotation template not found');
      }

      return h.response({
        success: true,
        message: 'Quotation template deleted successfully'
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error deleting quotation template:', error);
      throw Boom.internal('Failed to delete quotation template');
    }
  }

  async getQuotationTemplateById(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;

      const template = await this.quotationRepository.getQuotationTemplateById(id, organizationId);
      if (!template) {
        throw Boom.notFound('Quotation template not found');
      }

      return h.response({
        success: true,
        data: template
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error getting quotation template:', error);
      throw Boom.internal('Failed to get quotation template');
    }
  }

  // === QUOTATION APPROVAL WORKFLOW ===
  async submitQuotationForApproval(request, h) {
    try {
      const { id } = request.params;
      const { approver_id, comments } = request.payload;
      const organizationId = request.auth.credentials.organization_id;
      const userId = request.auth.credentials.user_id;

      // Update quotation status to pending approval
      const quotation = await this.quotationRepository.updateStatus(id, organizationId, 'pending_approval', userId);

      // Create approval request
      const approvalRequest = await this.quotationRepository.createApprovalRequest({
        quotation_id: id,
        requester_id: userId,
        approver_id,
        comments,
        organization_id: organizationId
      });

      return h.response({
        success: true,
        message: 'Quotation submitted for approval successfully',
        data: { quotation, approval_request: approvalRequest }
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error submitting quotation for approval:', error);
      throw Boom.internal('Failed to submit quotation for approval');
    }
  }

  async getApprovalRequests(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const userId = request.auth.credentials.user_id;
      const { status, page = 1, limit = 10 } = request.query;

      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10) };
      const filters = { status, approver_id: userId };

      const requests = await this.quotationRepository.getApprovalRequests(organizationId, filters, pagination);
      const total = await this.quotationRepository.countApprovalRequests(organizationId, filters);

      return h.response({
        success: true,
        data: requests,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          totalPages: Math.ceil(total / parseInt(limit, 10))
        }
      }).code(200);
    } catch (error) {
      console.error('Error getting approval requests:', error);
      throw Boom.internal('Failed to get approval requests');
    }
  }

  // === QUOTATION STATISTICS METHODS ===
  async getQuotationStatistics(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const { period = 'month' } = request.query;

      const statistics = await this.quotationRepository.getQuotationStatistics(organizationId, { period });

      return h.response({
        success: true,
        data: statistics
      }).code(200);
    } catch (error) {
      console.error('Error getting quotation statistics:', error);
      throw Boom.internal('Failed to get quotation statistics');
    }
  }

  async getQuotationItemsStatistics(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const { period = 'month' } = request.query;

      const statistics = await this.quotationRepository.getQuotationItemsStatistics(organizationId, { period });

      return h.response({
        success: true,
        data: statistics
      }).code(200);
    } catch (error) {
      console.error('Error getting quotation items statistics:', error);
      throw Boom.internal('Failed to get quotation items statistics');
    }
  }

  // === HELPER METHODS ===
  async getProjectDetails(projectId, organizationId) {
    // This would typically call the project repository
    // For now, we'll return a mock structure
    return {
      id: projectId,
      title: 'Sample Project',
      description: 'Project description',
      budget: 10000,
      currency: 'IDR',
      cost_breakdown: {
        services: 5000,
        materials: 2000,
        overhead: 1000,
        profit: 2000
      }
    };
  }

  async getQuotationTemplate(templateId, organizationId) {
    // This would typically call the template repository
    // For now, we'll return a mock structure
    return {
      id: templateId,
      name: 'Standard Template',
      content: 'Standard quotation content',
      header_template: 'Company Header',
      footer_template: 'Company Footer',
      terms_conditions: 'Standard terms and conditions'
    };
  }

  async buildQuotationFromProject(project, template, organizationId, userId) {
    const numberResult = await this.quotationRepository.generateQuotationNumber(organizationId);

    return {
      organization_id: organizationId,
      project_id: project.id,
      client_id: project.client_id || null,
      quotation_number: numberResult.quotation_number,
      title: `Quotation for ${project.title}`,
      description: project.description,
      status: 'draft',
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      issue_date: new Date(),
      subtotal: project.cost_breakdown.services + project.cost_breakdown.materials,
      tax_rate: 11,
      tax_amount: (project.cost_breakdown.services + project.cost_breakdown.materials) * 0.11,
      discount_percentage: 0,
      discount_amount: 0,
      total_amount: project.budget,
      currency: project.currency,
      notes: template ? template.content : '',
      terms_conditions: template ? template.terms_conditions : '',
      created_by: userId
    };
  }

  async generateQuotationItemsFromProject(quotationId, project, organizationId) {
    const items = [
      {
        quotation_id: quotationId,
        name: 'Services',
        description: 'Professional services',
        quantity: 1,
        unit_price: project.cost_breakdown.services,
        unit_type: 'service',
        tax_rate: 11,
        discount_percentage: 0,
        total: project.cost_breakdown.services
      },
      {
        quotation_id: quotationId,
        name: 'Materials',
        description: 'Project materials',
        quantity: 1,
        unit_price: project.cost_breakdown.materials,
        unit_type: 'material',
        tax_rate: 11,
        discount_percentage: 0,
        total: project.cost_breakdown.materials
      }
    ];

    for (const item of items) {
      await this.quotationRepository.createQuotationItem(item);
    }
  }
}

module.exports = new QuotationHandler();
