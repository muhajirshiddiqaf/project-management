const Boom = require('@hapi/boom');

class TicketHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // Bind all methods to preserve 'this' context
    this.getTickets = this.getTickets.bind(this);
    this.getTicketById = this.getTicketById.bind(this);
    this.createTicket = this.createTicket.bind(this);
    this.updateTicket = this.updateTicket.bind(this);
    this.deleteTicket = this.deleteTicket.bind(this);
    this.searchTickets = this.searchTickets.bind(this);
    this.getTicketMessages = this.getTicketMessages.bind(this);
    this.getTicketMessageById = this.getTicketMessageById.bind(this);
    this.createTicketMessage = this.createTicketMessage.bind(this);
    this.updateTicketMessage = this.updateTicketMessage.bind(this);
    this.deleteTicketMessage = this.deleteTicketMessage.bind(this);
    this.updateTicketStatus = this.updateTicketStatus.bind(this);
  }

  // Get all tickets
  async getTickets(request, h) {
    try {
      const { organizationId } = request;
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc', status, priority, category, client_id, project_id, assigned_to, created_by } = request.query;

      const tickets = await this._service.findAll(organizationId, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sortBy,
        sortOrder,
        status,
        priority,
        category,
        client_id,
        project_id,
        assigned_to,
        created_by
      });

      return h.response({
        success: true,
        message: 'Tickets retrieved successfully',
        data: tickets
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve tickets');
    }
  }

  // Get ticket by ID
  async getTicketById(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;

      const ticket = await this._service.findById(id, organizationId);

      if (!ticket) {
        throw Boom.notFound('Ticket not found');
      }

      return h.response({
        success: true,
        message: 'Ticket retrieved successfully',
        data: ticket
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to retrieve ticket');
    }
  }

  // Create new ticket
  async createTicket(request, h) {
    try {
      const { organizationId, userId } = request;
      const ticketData = request.payload;

      const ticket = await this._service.create({
        ...ticketData,
        organization_id: organizationId,
        created_by: userId
      });

      return h.response({
        success: true,
        message: 'Ticket created successfully',
        data: ticket
      }).code(201);
    } catch (error) {
      throw Boom.internal('Failed to create ticket');
    }
  }

  // Update ticket
  async updateTicket(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;
      const updateData = request.payload;

      const ticket = await this._service.update(id, organizationId, updateData);

      if (!ticket) {
        throw Boom.notFound('Ticket not found');
      }

      return h.response({
        success: true,
        message: 'Ticket updated successfully',
        data: ticket
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update ticket');
    }
  }

  // Delete ticket
  async deleteTicket(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;

      const deleted = await this._service.delete(id, organizationId);

      if (!deleted) {
        throw Boom.notFound('Ticket not found');
      }

      return h.response({
        success: true,
        message: 'Ticket deleted successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to delete ticket');
    }
  }

  // Search tickets
  async searchTickets(request, h) {
    try {
      const { organizationId } = request;
      const { q, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = request.query;

      const tickets = await this._service.search(organizationId, q, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sortBy,
        sortOrder
      });

      return h.response({
        success: true,
        message: 'Tickets search completed',
        data: tickets
      });
    } catch (error) {
      throw Boom.internal('Failed to search tickets');
    }
  }

  // Update ticket status
  async updateTicketStatus(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;
      const { status, notes } = request.payload;

      const ticket = await this._service.updateStatus(id, organizationId, status, notes);

      if (!ticket) {
        throw Boom.notFound('Ticket not found');
      }

      return h.response({
        success: true,
        message: 'Ticket status updated successfully',
        data: ticket
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update ticket status');
    }
  }

  // Assign ticket
  async assignTicket(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;
      const { assigned_to } = request.payload;

      const ticket = await this._service.assign(id, organizationId, assigned_to);

      if (!ticket) {
        throw Boom.notFound('Ticket not found');
      }

      return h.response({
        success: true,
        message: 'Ticket assigned successfully',
        data: ticket
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to assign ticket');
    }
  }

  // Add ticket comment
  async addTicketComment(request, h) {
    try {
      const { organizationId, userId } = request;
      const { ticket_id, content, is_internal, attachments } = request.payload;

      const comment = await this._service.addComment(ticket_id, organizationId, {
        content,
        is_internal,
        attachments,
        created_by: userId
      });

      return h.response({
        success: true,
        message: 'Ticket comment added successfully',
        data: comment
      }).code(201);
    } catch (error) {
      throw Boom.internal('Failed to add ticket comment');
    }
  }

  // Get ticket comments
  async getTicketComments(request, h) {
    try {
      const { organizationId } = request;
      const { ticket_id, page = 1, limit = 10 } = request.query;

      const comments = await this._service.getComments(ticket_id, organizationId, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
      });

      return h.response({
        success: true,
        message: 'Ticket comments retrieved successfully',
        data: comments
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve ticket comments');
    }
  }

  // Get ticket statistics
  async getTicketStatistics(request, h) {
    try {
      const { organizationId } = request;

      const statistics = await this._service.getStatistics(organizationId);

      return h.response({
        success: true,
        message: 'Ticket statistics retrieved successfully',
        data: statistics
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve ticket statistics');
    }
  }

  // === TICKET MESSAGING METHODS ===

  // Get ticket messages
  async getTicketMessages(request, h) {
    try {
      const { organizationId } = request;
      const { ticket_id, message_type, is_internal, parent_message_id, page = 1, limit = 10 } = request.query;

      const messages = await this._service.getMessages(ticket_id, organizationId, {
        message_type,
        is_internal,
        parent_message_id,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
      });

      return h.response({
        success: true,
        message: 'Ticket messages retrieved successfully',
        data: messages
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve ticket messages');
    }
  }

  // Get ticket message by ID
  async getTicketMessageById(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;

      const message = await this._service.getMessageById(id, organizationId);

      if (!message) {
        throw Boom.notFound('Ticket message not found');
      }

      return h.response({
        success: true,
        message: 'Ticket message retrieved successfully',
        data: message
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to retrieve ticket message');
    }
  }

  // Create ticket message
  async createTicketMessage(request, h) {
    try {
      const { organizationId, userId } = request;
      const messageData = request.payload;

      const message = await this._service.createMessage({
        ...messageData,
        organization_id: organizationId,
        created_by: userId
      });

      return h.response({
        success: true,
        message: 'Ticket message created successfully',
        data: message
      }).code(201);
    } catch (error) {
      throw Boom.internal('Failed to create ticket message');
    }
  }

  // Update ticket message
  async updateTicketMessage(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;
      const updateData = request.payload;

      const message = await this._service.updateMessage(id, organizationId, updateData);

      if (!message) {
        throw Boom.notFound('Ticket message not found');
      }

      return h.response({
        success: true,
        message: 'Ticket message updated successfully',
        data: message
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update ticket message');
    }
  }

  // Delete ticket message
  async deleteTicketMessage(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;

      const deleted = await this._service.deleteMessage(id, organizationId);

      if (!deleted) {
        throw Boom.notFound('Ticket message not found');
      }

      return h.response({
        success: true,
        message: 'Ticket message deleted successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to delete ticket message');
    }
  }

  // Reply to ticket message
  async replyToTicketMessage(request, h) {
    try {
      const { organizationId, userId } = request;
      const { ticket_id, parent_message_id, content, message_type, is_internal, attachments } = request.payload;

      const reply = await this._service.replyToMessage(ticket_id, parent_message_id, organizationId, {
        content,
        message_type,
        is_internal,
        attachments,
        created_by: userId
      });

      return h.response({
        success: true,
        message: 'Reply added successfully',
        data: reply
      }).code(201);
    } catch (error) {
      throw Boom.internal('Failed to add reply');
    }
  }

  // Mark ticket message as read
  async markTicketMessageAsRead(request, h) {
    try {
      const { organizationId, userId } = request;
      const { message_id } = request.payload;

      const result = await this._service.markMessageAsRead(message_id, organizationId, userId);

      return h.response({
        success: true,
        message: 'Message marked as read successfully',
        data: result
      });
    } catch (error) {
      throw Boom.internal('Failed to mark message as read');
    }
  }

  // Get ticket message thread
  async getTicketMessageThread(request, h) {
    try {
      const { organizationId } = request;
      const { message_id, include_internal } = request.query;

      const thread = await this._service.getMessageThread(message_id, organizationId, include_internal);

      return h.response({
        success: true,
        message: 'Ticket message thread retrieved successfully',
        data: thread
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve ticket message thread');
    }
  }

  // Bulk create ticket messages
  async bulkCreateTicketMessages(request, h) {
    try {
      const { organizationId, userId } = request;
      const { ticket_id, messages } = request.payload;

      const createdMessages = await this._service.bulkCreateMessages(ticket_id, organizationId, messages, userId);

      return h.response({
        success: true,
        message: 'Ticket messages created successfully',
        data: {
          created: createdMessages.length,
          messages: createdMessages
        }
      }).code(201);
    } catch (error) {
      throw Boom.internal('Failed to create ticket messages');
    }
  }

  // Import ticket messages
  async importTicketMessages(request, h) {
    try {
      const { organizationId } = request;
      const { ticket_id, file } = request.payload;

      const result = await this._service.importMessages(ticket_id, organizationId, file);

      return h.response({
        success: true,
        message: 'Ticket messages imported successfully',
        data: result
      });
    } catch (error) {
      throw Boom.internal('Failed to import ticket messages');
    }
  }

  // Export ticket messages
  async exportTicketMessages(request, h) {
    try {
      const { organizationId } = request;
      const { ticket_id, format = 'csv', include_internal } = request.query;

      const result = await this._service.exportMessages(ticket_id, organizationId, format, include_internal);

      return h.response(result.data)
        .header('Content-Type', result.contentType)
        .header('Content-Disposition', `attachment; filename="${result.filename}"`);
    } catch (error) {
      throw Boom.internal('Failed to export ticket messages');
    }
  }
}

module.exports = TicketHandler;
