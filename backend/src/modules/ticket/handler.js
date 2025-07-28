const Boom = require('@hapi/boom');

class TicketHandler {
  constructor() {
    this.ticketRepository = null;
  }

  // Set repository (dependency injection)
  setTicketRepository(ticketRepository) {
    this.ticketRepository = ticketRepository;
  }

  // Get all tickets
  async getTickets(request, h) {
    try {
      const { organizationId } = request;
      const {
        page = 1, limit = 10, status, priority, category, client_id, project_id, assigned_to, created_by, sortBy = 'created_at', sortOrder = 'desc',
      } = request.query;

      const tickets = await this.ticketRepository.findAll(organizationId, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        status,
        priority,
        category,
        client_id,
        project_id,
        assigned_to,
        created_by,
        sortBy,
        sortOrder,
      });

      return h.response({
        success: true,
        message: 'Tickets retrieved successfully',
        data: tickets,
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

      const ticket = await this.ticketRepository.findById(id, organizationId);

      if (!ticket) {
        throw Boom.notFound('Ticket not found');
      }

      return h.response({
        success: true,
        message: 'Ticket retrieved successfully',
        data: ticket,
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

      const ticket = await this.ticketRepository.create({
        ...ticketData,
        organization_id: organizationId,
        created_by: userId,
      });

      return h.response({
        success: true,
        message: 'Ticket created successfully',
        data: ticket,
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

      const ticket = await this.ticketRepository.update(id, organizationId, updateData);

      if (!ticket) {
        throw Boom.notFound('Ticket not found');
      }

      return h.response({
        success: true,
        message: 'Ticket updated successfully',
        data: ticket,
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

      const deleted = await this.ticketRepository.delete(id, organizationId);

      if (!deleted) {
        throw Boom.notFound('Ticket not found');
      }

      return h.response({
        success: true,
        message: 'Ticket deleted successfully',
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
      const {
        q, page = 1, limit = 10, status, priority, category, sortBy = 'created_at', sortOrder = 'desc',
      } = request.query;

      const tickets = await this.ticketRepository.search(organizationId, q, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        status,
        priority,
        category,
        sortBy,
        sortOrder,
      });

      return h.response({
        success: true,
        message: 'Tickets search completed',
        data: tickets,
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

      const ticket = await this.ticketRepository.updateStatus(id, organizationId, status, notes);

      if (!ticket) {
        throw Boom.notFound('Ticket not found');
      }

      return h.response({
        success: true,
        message: 'Ticket status updated successfully',
        data: ticket,
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

      const ticket = await this.ticketRepository.assign(id, organizationId, assigned_to);

      if (!ticket) {
        throw Boom.notFound('Ticket not found');
      }

      return h.response({
        success: true,
        message: 'Ticket assigned successfully',
        data: ticket,
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
      const { id } = request.params;
      const { content, is_internal = false, attachments } = request.payload;

      const comment = await this.ticketRepository.addComment(id, organizationId, {
        content,
        is_internal,
        attachments,
        created_by: userId,
      });

      return h.response({
        success: true,
        message: 'Comment added successfully',
        data: comment,
      }).code(201);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to add comment');
    }
  }

  // Get ticket comments
  async getTicketComments(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;
      const { page = 1, limit = 10 } = request.query;

      const comments = await this.ticketRepository.getComments(id, organizationId, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      });

      return h.response({
        success: true,
        message: 'Ticket comments retrieved successfully',
        data: comments,
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve ticket comments');
    }
  }

  // Get ticket statistics
  async getTicketStatistics(request, h) {
    try {
      const { organizationId } = request;

      const statistics = await this.ticketRepository.getStatistics(organizationId);

      return h.response({
        success: true,
        message: 'Ticket statistics retrieved successfully',
        data: statistics,
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve ticket statistics');
    }
  }
}

module.exports = new TicketHandler();
