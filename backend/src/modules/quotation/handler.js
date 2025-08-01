const Boom = require('@hapi/boom');
const { getCredentials, getUserId, getOrganizationId } = require('../../utils/auth');

class QuotationHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // Bind all methods to preserve 'this' context
    this.getQuotations = this.getQuotations.bind(this);
    this.getQuotationById = this.getQuotationById.bind(this);
    this.createQuotation = this.createQuotation.bind(this);
    this.updateQuotation = this.updateQuotation.bind(this);
    this.deleteQuotation = this.deleteQuotation.bind(this);
    this.searchQuotations = this.searchQuotations.bind(this);
    this.sendQuotation = this.sendQuotation.bind(this);
    this.approveQuotation = this.approveQuotation.bind(this);
    this.rejectQuotation = this.rejectQuotation.bind(this);
    this.generateFromProject = this.generateFromProject.bind(this);
  }

  // === QUOTATION CRUD METHODS ===
  async getQuotations(request, h) {
    try {
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC', status, client_id, project_id } = request.query;
      const organizationId = getOrganizationId(request);

      const filters = { status, client_id, project_id };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sortBy, sortOrder };

      const quotations = await this._service.findAll(organizationId, filters, pagination);
      const total = await this._service.countQuotations(organizationId, filters);

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
      const organizationId = getOrganizationId(request);

      const quotation = await this._service.findById(id, organizationId);
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
      const credentials = getCredentials(request);
      const quotationData = {
        ...request.payload,
        organization_id: credentials.organizationId,
        created_by: credentials.userId,
        // Map frontend fields to backend fields
        subject: request.payload.subject,
        due_date: request.payload.due_date,
        reference: request.payload.reference,
        tax_rate: request.payload.tax_rate || 10,
        discount_rate: request.payload.discount_rate || 0,
        currency: request.payload.currency || 'USD',
        notes: request.payload.notes,
        terms_conditions: request.payload.terms_conditions || request.payload.terms
      };

      // Generate quotation number if not provided
      if (!quotationData.quotation_number) {
        const numberResult = await this._service.generateQuotationNumber(quotationData.organization_id);
        quotationData.quotation_number = numberResult.quotation_number;
      }

      const quotation = await this._service.create(quotationData);

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
      const updateData = {
        ...request.payload,
        // Map frontend fields to backend fields
        subject: request.payload.subject,
        due_date: request.payload.due_date,
        reference: request.payload.reference,
        tax_rate: request.payload.tax_rate,
        discount_rate: request.payload.discount_rate,
        currency: request.payload.currency,
        notes: request.payload.notes,
        terms_conditions: request.payload.terms_conditions || request.payload.terms
      };

      const quotation = await this._service.update(id, organizationId, updateData);
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

      const quotation = await this._service.delete(id, organizationId);
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
      const quotations = await this._service.search(organizationId, q, {}, pagination);
      const total = await this._service.countSearchQuotations(organizationId, q, {});

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

      const quotation = await this._service.updateStatus(id, organizationId, status, userId);
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

      const quotation = await this._service.approveQuotation(id, organizationId, userId);
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

  // Reject quotation
  async rejectQuotation(request, h) {
    try {
      const { id } = request.params;
      const { reason, comments } = request.payload;
      const organizationId = request.auth.credentials.organization_id;
      const userId = request.auth.credentials.user_id;

      const quotation = await this._service.rejectQuotation(id, organizationId, userId, {
        reason,
        comments
      });

      if (!quotation) {
        throw Boom.notFound('Quotation not found');
      }

      return h.response({
        success: true,
        message: 'Quotation rejected successfully',
        data: quotation
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error rejecting quotation:', error);
      throw Boom.internal('Failed to reject quotation');
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

      const items = await this._service.getQuotationItems(quotation_id, organizationId);
      const total = await this._service.countQuotationItems(quotation_id, organizationId);

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

      const item = await this._service.getQuotationItemById(id, quotation_id, organizationId);
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

      const item = await this._service.createQuotationItem(itemData);

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

      const item = await this._service.updateQuotationItem(id, quotation_id, organizationId, updateData);
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

      const item = await this._service.deleteQuotationItem(id, quotation_id, organizationId);
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

      const totals = await this._service.calculateQuotationTotals(quotation_id, organizationId);

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
      const quotation = await this._service.create(quotationData);

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

  // Generate quotation from project
  async generateFromProject(request, h) {
    try {
      const { project_id, template_id, include_materials = true, include_labor = true } = request.payload;

      // Use auth utility to get credentials
      const credentials = getCredentials(request);
      let organizationId = credentials.organizationId;
      const userId = credentials.userId;

      console.log('Debug - project_id:', project_id);
      console.log('Debug - credentials:', credentials);
      console.log('Debug - organizationId from auth:', organizationId);
      console.log('Debug - userId:', userId);

      // Get project details first to get organization_id
      const project = await this.getProjectDetails(project_id, organizationId);
      if (!project) {
        throw Boom.notFound('Project not found');
      }

      // Use organization_id from project if auth organizationId is null
      if (!organizationId && project.organization_id) {
        organizationId = project.organization_id;
        console.log('Debug - using organization_id from project:', organizationId);
      }

      console.log('Debug - project:', project);
      console.log('Debug - final organizationId:', organizationId);

      // Get quotation template if specified
      let template = null;
      if (template_id) {
        template = await this.getQuotationTemplate(template_id, organizationId);
        if (!template) {
          throw Boom.notFound('Quotation template not found');
        }
      }

      // Build quotation from project
      const quotationData = await this.buildQuotationFromProject(project, template, organizationId, userId);

      console.log('Debug - quotationData:', quotationData);

      // Create quotation
      const quotation = await this._service.create(quotationData);

      // Generate quotation items from project if requested
      if (include_materials || include_labor) {
        await this.generateQuotationItemsFromProject(quotation.id, project, organizationId);
      }

      return h.response({
        success: true,
        message: 'Quotation generated from project successfully',
        data: {
          quotation: quotation,
          project_id: project_id,
          items_generated: include_materials || include_labor
        }
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
      const templates = await this._service.getQuotationTemplates(organizationId, pagination);
      const total = await this._service.countQuotationTemplates(organizationId);

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

      const template = await this._service.createQuotationTemplate(templateData);

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

      const template = await this._service.updateQuotationTemplate(id, organizationId, updateData);
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

      const template = await this._service.deleteQuotationTemplate(id, organizationId);
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

      const template = await this._service.getQuotationTemplateById(id, organizationId);
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
      const quotation = await this._service.updateStatus(id, organizationId, 'pending_approval', userId);

      // Create approval request
      const approvalRequest = await this._service.createApprovalRequest({
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

      const requests = await this._service.getApprovalRequests(organizationId, filters, pagination);
      const total = await this._service.countApprovalRequests(organizationId, filters);

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

      const statistics = await this._service.getQuotationStatistics(organizationId, { period });

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

      const statistics = await this._service.getQuotationItemsStatistics(organizationId, { period });

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
    try {
      // Query project from database
      const query = `
        SELECT p.*, c.name as client_name, c.email as client_email
        FROM projects p
        LEFT JOIN clients c ON p.client_id = c.id
        WHERE p.id = $1 ${organizationId ? 'AND p.organization_id = $2' : ''}
      `;

      const values = organizationId ? [projectId, organizationId] : [projectId];
      const result = await this._service.db.query(query, values);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error getting project details:', error);
      return null;
    }
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
    const numberResult = await this._service.generateQuotationNumber(organizationId);

    return {
      organization_id: organizationId,
      project_id: project.id,
      client_id: project.client_id || null,
      quotation_number: numberResult.quotation_number,
      subject: `Quotation for ${project.name}`,
      description: project.description,
      status: 'draft',
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      subtotal: project.budget || 0,
      tax_rate: 11,
      tax_amount: (project.budget || 0) * 0.11,
      discount_rate: 0,
      discount_amount: 0,
      total_amount: project.budget || 0,
      currency: project.currency || 'USD',
      notes: template ? template.content : '',
      terms_conditions: template ? template.terms_conditions : '',
      created_by: userId
    };
  }

  async generateQuotationItemsFromProject(quotationId, project, organizationId) {
    const items = [
      {
        quotation_id: quotationId,
        item_name: 'Project Development',
        description: project.description || 'Project development services',
        quantity: 1,
        unit_price: project.budget || 0,
        unit_type: 'project',
        total_price: project.budget || 0,
        sort_order: 1
      }
    ];

    for (const item of items) {
      await this._service.createQuotationItem(item);
    }
  }

  // Send quotation via email
  async sendQuotation(request, h) {
    try {
      const { id } = request.params;
      const { recipient_email, message, send_copy_to_sender = false } = request.payload;
      const organizationId = request.auth.credentials.organization_id;
      const userId = request.auth.credentials.user_id;

      // Get quotation details
      const quotation = await this._service.findById(id, organizationId);
      if (!quotation) {
        throw Boom.notFound('Quotation not found');
      }

      // Check if quotation is ready to be sent
      if (quotation.status !== 'draft' && quotation.status !== 'approved') {
        throw Boom.badRequest('Quotation can only be sent when status is draft or approved');
      }

      // TODO: Implement email service integration
      // For now, just update the status and log the action
      const updateData = {
        status: 'sent',
        sent_at: new Date(),
        sent_by: userId,
        recipient_email: recipient_email
      };

      const updatedQuotation = await this._service.update(id, organizationId, updateData);

      // TODO: Send email using email service
      // await emailService.sendQuotation(quotation, recipient_email, message, send_copy_to_sender);

      return h.response({
        success: true,
        message: 'Quotation sent successfully',
        data: {
          quotation_id: id,
          recipient_email: recipient_email,
          sent_at: updateData.sent_at,
          status: 'sent'
        }
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error sending quotation:', error);
      throw Boom.internal('Failed to send quotation');
    }
  }
}

module.exports = QuotationHandler;
