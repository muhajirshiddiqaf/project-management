const { queries } = require('../database/queries');

class TicketRepository {
  constructor(db) {
    this.db = db;
  }

  // === TICKET CRUD METHODS ===

  async findAll(organizationId, options = {}) {
    try {
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc', status, priority, category, client_id, project_id, assigned_to, created_by } = options;
      const offset = (page - 1) * limit;

      const result = await this.db.query(queries.ticket.findAllTickets, [
        organizationId,
        status,
        priority,
        category,
        client_id,
        project_id,
        assigned_to,
        created_by,
        sortBy,
        sortOrder,
        limit,
        offset
      ]);

      const countResult = await this.db.query(queries.ticket.countTickets, [organizationId, status, priority, category, client_id, project_id, assigned_to, created_by]);
      const totalCount = parseInt(countResult.rows[0].count, 10);

      return {
        tickets: result.rows,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      };
    } catch (error) {
      throw new Error('Failed to find tickets');
    }
  }

  async findById(id, organizationId) {
    try {
      const result = await this.db.query(queries.ticket.findTicketById, [id, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to find ticket by ID');
    }
  }

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
        ticketData.created_by
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error('Failed to create ticket');
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

      const query = `UPDATE tickets SET ${fields.join(', ')} WHERE id = $${paramCount} AND organization_id = $${paramCount + 1} RETURNING *`;
      const result = await this.db.query(query, values);

      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to update ticket');
    }
  }

  async delete(id, organizationId) {
    try {
      const result = await this.db.query(queries.ticket.deleteTicket, [id, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to delete ticket');
    }
  }

  async search(organizationId, searchTerm, options = {}) {
    try {
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;
      const offset = (page - 1) * limit;

      const result = await this.db.query(queries.ticket.searchTickets, [
        organizationId,
        searchTerm,
        sortBy,
        sortOrder,
        limit,
        offset
      ]);

      const countResult = await this.db.query(queries.ticket.countSearchTickets, [organizationId, searchTerm]);
      const totalCount = parseInt(countResult.rows[0].count, 10);

      return {
        tickets: result.rows,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      };
    } catch (error) {
      throw new Error('Failed to search tickets');
    }
  }

  async updateStatus(id, organizationId, status, notes) {
    try {
      const result = await this.db.query(queries.ticket.updateTicketStatus, [id, organizationId, status, notes]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to update ticket status');
    }
  }

  async assign(id, organizationId, assigned_to) {
    try {
      const result = await this.db.query(queries.ticket.assignTicket, [id, organizationId, assigned_to]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to assign ticket');
    }
  }

  async addComment(ticketId, organizationId, commentData) {
    try {
      const result = await this.db.query(queries.ticket.addTicketComment, [
        ticketId,
        commentData.content,
        commentData.is_internal,
        commentData.attachments,
        organizationId,
        commentData.created_by
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error('Failed to add ticket comment');
    }
  }

  async getComments(ticketId, organizationId, options = {}) {
    try {
      const { page = 1, limit = 10 } = options;
      const offset = (page - 1) * limit;

      const result = await this.db.query(queries.ticket.getTicketComments, [
        ticketId,
        organizationId,
        limit,
        offset
      ]);

      const countResult = await this.db.query(queries.ticket.countTicketComments, [ticketId, organizationId]);
      const totalCount = parseInt(countResult.rows[0].count, 10);

      return {
        comments: result.rows,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      };
    } catch (error) {
      throw new Error('Failed to get ticket comments');
    }
  }

  async getStatistics(organizationId) {
    try {
      const result = await this.db.query(queries.ticket.getTicketStatistics, [organizationId]);
      return result.rows[0] || {};
    } catch (error) {
      throw new Error('Failed to get ticket statistics');
    }
  }

  // === TICKET MESSAGING METHODS ===

  async getMessages(ticketId, organizationId, options = {}) {
    try {
      const { message_type, is_internal, parent_message_id, page = 1, limit = 10 } = options;
      const offset = (page - 1) * limit;

      const result = await this.db.query(queries.ticket.findAllTicketMessages, [
        ticketId,
        organizationId,
        message_type,
        is_internal,
        parent_message_id,
        limit,
        offset
      ]);

      const countResult = await this.db.query(queries.ticket.countTicketMessages, [ticketId, organizationId, message_type, is_internal, parent_message_id]);
      const totalCount = parseInt(countResult.rows[0].count, 10);

      return {
        messages: result.rows,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      };
    } catch (error) {
      throw new Error('Failed to get ticket messages');
    }
  }

  async getMessageById(id, organizationId) {
    try {
      const result = await this.db.query(queries.ticket.findTicketMessageById, [id, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to find ticket message by ID');
    }
  }

  async createMessage(messageData) {
    try {
      const result = await this.db.query(queries.ticket.createTicketMessage, [
        messageData.ticket_id,
        messageData.content,
        messageData.message_type,
        messageData.is_internal,
        messageData.parent_message_id,
        messageData.attachments,
        messageData.notify_users,
        messageData.organization_id,
        messageData.created_by
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error('Failed to create ticket message');
    }
  }

  async updateMessage(id, organizationId, updateData) {
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

      const query = `UPDATE ticket_messages SET ${fields.join(', ')} WHERE id = $${paramCount} AND organization_id = $${paramCount + 1} RETURNING *`;
      const result = await this.db.query(query, values);

      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to update ticket message');
    }
  }

  async deleteMessage(id, organizationId) {
    try {
      const result = await this.db.query(queries.ticket.deleteTicketMessage, [id, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to delete ticket message');
    }
  }

  async replyToMessage(ticketId, parentMessageId, organizationId, replyData) {
    try {
      const result = await this.db.query(queries.ticket.replyToTicketMessage, [
        ticketId,
        parentMessageId,
        replyData.content,
        replyData.message_type,
        replyData.is_internal,
        replyData.attachments,
        organizationId,
        replyData.created_by
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error('Failed to reply to ticket message');
    }
  }

  async markMessageAsRead(messageId, organizationId, userId) {
    try {
      const result = await this.db.query(queries.ticket.markTicketMessageAsRead, [messageId, organizationId, userId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to mark ticket message as read');
    }
  }

  async getMessageThread(messageId, organizationId, includeInternal = false) {
    try {
      const result = await this.db.query(queries.ticket.getTicketMessageThread, [messageId, organizationId, includeInternal]);
      return result.rows;
    } catch (error) {
      throw new Error('Failed to get ticket message thread');
    }
  }

  async bulkCreateMessages(ticketId, organizationId, messages, userId) {
    try {
      const createdMessages = [];

      for (const message of messages) {
        const result = await this.db.query(queries.ticket.createTicketMessage, [
          ticketId,
          message.content,
          message.message_type,
          message.is_internal,
          message.parent_message_id,
          message.attachments,
          message.notify_users,
          organizationId,
          userId
        ]);
        createdMessages.push(result.rows[0]);
      }

      return createdMessages;
    } catch (error) {
      throw new Error('Failed to bulk create ticket messages');
    }
  }

  async importMessages(ticketId, organizationId, file) {
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
      throw new Error('Failed to import ticket messages');
    }
  }

  async exportMessages(ticketId, organizationId, format = 'csv', includeInternal = false) {
    try {
      // This is a placeholder implementation
      // In a real implementation, you would:
      // 1. Query ticket messages based on ticket_id
      // 2. Format data according to format type
      // 3. Generate file and return

      const messages = await this.getMessages(ticketId, organizationId, { page: 1, limit: 1000 });

      let data, contentType, filename;

      switch (format) {
        case 'csv':
          data = this.convertToCSV(messages.messages, includeInternal);
          contentType = 'text/csv';
          filename = `ticket_messages_${ticketId}_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'xlsx':
          data = this.convertToXLSX(messages.messages, includeInternal);
          contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          filename = `ticket_messages_${ticketId}_${new Date().toISOString().split('T')[0]}.xlsx`;
          break;
        case 'json':
          data = JSON.stringify(messages.messages, null, 2);
          contentType = 'application/json';
          filename = `ticket_messages_${ticketId}_${new Date().toISOString().split('T')[0]}.json`;
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
      throw new Error('Failed to export ticket messages');
    }
  }

  // Helper methods for export
  convertToCSV(messages, includeInternal = false) {
    const headers = ['ID', 'Content', 'Message Type', 'Is Internal', 'Parent Message ID', 'Created By', 'Created At'];
    const rows = messages
      .filter(msg => includeInternal || !msg.is_internal)
      .map(msg => [
        msg.id,
        msg.content,
        msg.message_type,
        msg.is_internal,
        msg.parent_message_id || '',
        msg.created_by,
        msg.created_at
      ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  convertToXLSX(messages, includeInternal = false) {
    // Placeholder - would use a library like xlsx
    return this.convertToCSV(messages, includeInternal);
  }
}

module.exports = TicketRepository;
