const { queries } = require('../database/queries');

class TicketRepository {
  constructor(db) {
    this.db = db;
  }

  // Find all tickets for organization
  async findAll(organizationId, options = {}) {
    const {
      page = 1, limit = 10, status, priority, category, client_id, project_id, assigned_to, created_by, sortBy = 'created_at', sortOrder = 'desc',
    } = options;
    const offset = (page - 1) * limit;

    try {
      const result = await this.db.query(queries.ticket.findAllTickets, [
        organizationId,
        status,
        priority,
        category,
        client_id,
        project_id,
        assigned_to,
        created_by,
        limit,
        offset,
        sortBy,
        sortOrder,
      ]);

      const countResult = await this.db.query(queries.ticket.countTickets, [
        organizationId,
        status,
        priority,
        category,
        client_id,
        project_id,
        assigned_to,
        created_by,
      ]);
      const total = parseInt(countResult.rows[0].count, 10);

      return {
        tickets: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error('Failed to retrieve tickets');
    }
  }

  // Find ticket by ID
  async findById(id, organizationId) {
    try {
      const result = await this.db.query(queries.ticket.findTicketById, [id, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to retrieve ticket');
    }
  }

  // Create new ticket
  async create(ticketData) {
    try {
      const result = await this.db.query(queries.ticket.createTicket, [
        ticketData.title,
        ticketData.description,
        ticketData.category,
        ticketData.priority,
        ticketData.status,
        ticketData.client_id,
        ticketData.project_id,
        ticketData.order_id,
        ticketData.assigned_to,
        ticketData.due_date,
        ticketData.tags,
        ticketData.attachments,
        ticketData.organization_id,
        ticketData.created_by,
      ]);

      return result.rows[0];
    } catch (error) {
      throw new Error('Failed to create ticket');
    }
  }

  // Update ticket
  async update(id, organizationId, updateData) {
    try {
      const result = await this.db.query(queries.ticket.updateTicket, [
        id,
        organizationId,
        updateData.title,
        updateData.description,
        updateData.category,
        updateData.priority,
        updateData.status,
        updateData.client_id,
        updateData.project_id,
        updateData.order_id,
        updateData.assigned_to,
        updateData.due_date,
        updateData.tags,
        updateData.attachments,
      ]);

      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to update ticket');
    }
  }

  // Delete ticket
  async delete(id, organizationId) {
    try {
      const result = await this.db.query(queries.ticket.deleteTicket, [id, organizationId]);
      return result.rowCount > 0;
    } catch (error) {
      throw new Error('Failed to delete ticket');
    }
  }

  // Search tickets
  async search(organizationId, searchTerm, options = {}) {
    const {
      page = 1, limit = 10, status, priority, category, sortBy = 'created_at', sortOrder = 'desc',
    } = options;
    const offset = (page - 1) * limit;

    try {
      const result = await this.db.query(queries.ticket.searchTickets, [
        organizationId,
        searchTerm,
        status,
        priority,
        category,
        limit,
        offset,
        sortBy,
        sortOrder,
      ]);

      const countResult = await this.db.query(queries.ticket.countSearchTickets, [
        organizationId,
        searchTerm,
        status,
        priority,
        category,
      ]);
      const total = parseInt(countResult.rows[0].count, 10);

      return {
        tickets: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error('Failed to search tickets');
    }
  }

  // Update ticket status
  async updateStatus(id, organizationId, status, notes) {
    try {
      const result = await this.db.query(queries.ticket.updateTicketStatus, [
        id,
        organizationId,
        status,
        notes,
      ]);

      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to update ticket status');
    }
  }

  // Assign ticket
  async assign(id, organizationId, assigned_to) {
    try {
      const result = await this.db.query(queries.ticket.assignTicket, [
        id,
        organizationId,
        assigned_to,
      ]);

      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to assign ticket');
    }
  }

  // Add ticket comment
  async addComment(ticketId, organizationId, commentData) {
    try {
      const result = await this.db.query(queries.ticket.addTicketComment, [
        ticketId,
        organizationId,
        commentData.content,
        commentData.is_internal,
        commentData.attachments,
        commentData.created_by,
      ]);

      return result.rows[0];
    } catch (error) {
      throw new Error('Failed to add ticket comment');
    }
  }

  // Get ticket comments
  async getComments(ticketId, organizationId, options = {}) {
    const { page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    try {
      const result = await this.db.query(queries.ticket.getTicketComments, [
        ticketId,
        organizationId,
        limit,
        offset,
      ]);

      const countResult = await this.db.query(queries.ticket.countTicketComments, [ticketId, organizationId]);
      const total = parseInt(countResult.rows[0].count, 10);

      return {
        comments: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error('Failed to retrieve ticket comments');
    }
  }

  // Get ticket statistics
  async getStatistics(organizationId) {
    try {
      const result = await this.db.query(queries.ticket.getTicketStatistics, [organizationId]);
      return result.rows[0] || {};
    } catch (error) {
      throw new Error('Failed to retrieve ticket statistics');
    }
  }
}

module.exports = TicketRepository;
