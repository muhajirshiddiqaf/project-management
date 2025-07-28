const ticketHandler = require('./handler');
const ticketValidator = require('./validator');
const { tenantIsolation, roleBasedAccess, permissionBasedAccess } = require('../../middleware');

const routes = [
  // === TICKET CRUD ROUTES ===

  // Get all tickets
  {
    method: 'GET',
    path: '/tickets',
    handler: ticketHandler.getTickets,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: ticketValidator.getTickets
      },
      tags: ['tickets']
    }
  },

  // Get ticket by ID
  {
    method: 'GET',
    path: '/tickets/{id}',
    handler: ticketHandler.getTicketById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: ticketValidator.getTicketById
      },
      tags: ['tickets']
    }
  },

  // Create ticket
  {
    method: 'POST',
    path: '/tickets',
    handler: ticketHandler.createTicket,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) },
        { method: permissionBasedAccess(['ticket:create']) }
      ],
      validate: {
        payload: ticketValidator.createTicket
      },
      tags: ['tickets']
    }
  },

  // Update ticket
  {
    method: 'PUT',
    path: '/tickets/{id}',
    handler: ticketHandler.updateTicket,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['ticket:update']) }
      ],
      validate: {
        params: ticketValidator.getTicketById,
        payload: ticketValidator.updateTicket
      },
      tags: ['tickets']
    }
  },

  // Delete ticket
  {
    method: 'DELETE',
    path: '/tickets/{id}',
    handler: ticketHandler.deleteTicket,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['ticket:delete']) }
      ],
      validate: {
        params: ticketValidator.deleteTicket
      },
      tags: ['tickets']
    }
  },

  // Search tickets
  {
    method: 'GET',
    path: '/tickets/search',
    handler: ticketHandler.searchTickets,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: ticketValidator.searchTickets
      },
      tags: ['tickets']
    }
  },

  // Update ticket status
  {
    method: 'PATCH',
    path: '/tickets/{id}/status',
    handler: ticketHandler.updateTicketStatus,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['ticket:update_status']) }
      ],
      validate: {
        params: ticketValidator.getTicketById,
        payload: ticketValidator.updateTicketStatus
      },
      tags: ['tickets']
    }
  },

  // Assign ticket
  {
    method: 'PATCH',
    path: '/tickets/{id}/assign',
    handler: ticketHandler.assignTicket,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['ticket:assign']) }
      ],
      validate: {
        params: ticketValidator.getTicketById,
        payload: ticketValidator.assignTicket
      },
      tags: ['tickets']
    }
  },

  // Add ticket comment
  {
    method: 'POST',
    path: '/tickets/comments',
    handler: ticketHandler.addTicketComment,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) },
        { method: permissionBasedAccess(['ticket:comment']) }
      ],
      validate: {
        payload: ticketValidator.createTicketMessage
      },
      tags: ['ticket-comments']
    }
  },

  // Get ticket comments
  {
    method: 'GET',
    path: '/tickets/comments',
    handler: ticketHandler.getTicketComments,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: ticketValidator.getTicketMessages
      },
      tags: ['ticket-comments']
    }
  },

  // Get ticket statistics
  {
    method: 'GET',
    path: '/tickets/statistics',
    handler: ticketHandler.getTicketStatistics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      tags: ['tickets']
    }
  },

  // === TICKET MESSAGING ROUTES ===

  // Get ticket messages
  {
    method: 'GET',
    path: '/tickets/messages',
    handler: ticketHandler.getTicketMessages,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: ticketValidator.getTicketMessages
      },
      tags: ['ticket-messages']
    }
  },

  // Get ticket message by ID
  {
    method: 'GET',
    path: '/tickets/messages/{id}',
    handler: ticketHandler.getTicketMessageById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: ticketValidator.getTicketMessageById
      },
      tags: ['ticket-messages']
    }
  },

  // Create ticket message
  {
    method: 'POST',
    path: '/tickets/messages',
    handler: ticketHandler.createTicketMessage,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) },
        { method: permissionBasedAccess(['ticket:create_message']) }
      ],
      validate: {
        payload: ticketValidator.createTicketMessage
      },
      tags: ['ticket-messages']
    }
  },

  // Update ticket message
  {
    method: 'PUT',
    path: '/tickets/messages/{id}',
    handler: ticketHandler.updateTicketMessage,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['ticket:update_message']) }
      ],
      validate: {
        params: ticketValidator.getTicketMessageById,
        payload: ticketValidator.updateTicketMessage
      },
      tags: ['ticket-messages']
    }
  },

  // Delete ticket message
  {
    method: 'DELETE',
    path: '/tickets/messages/{id}',
    handler: ticketHandler.deleteTicketMessage,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['ticket:delete_message']) }
      ],
      validate: {
        params: ticketValidator.deleteTicketMessage
      },
      tags: ['ticket-messages']
    }
  },

  // Reply to ticket message
  {
    method: 'POST',
    path: '/tickets/messages/reply',
    handler: ticketHandler.replyToTicketMessage,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) },
        { method: permissionBasedAccess(['ticket:create_message']) }
      ],
      validate: {
        payload: ticketValidator.replyToTicketMessage
      },
      tags: ['ticket-messages']
    }
  },

  // Mark ticket message as read
  {
    method: 'POST',
    path: '/tickets/messages/read',
    handler: ticketHandler.markTicketMessageAsRead,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        payload: ticketValidator.markTicketMessageAsRead
      },
      tags: ['ticket-messages']
    }
  },

  // Get ticket message thread
  {
    method: 'GET',
    path: '/tickets/messages/thread',
    handler: ticketHandler.getTicketMessageThread,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: ticketValidator.getTicketMessageThread
      },
      tags: ['ticket-messages']
    }
  },

  // Bulk create ticket messages
  {
    method: 'POST',
    path: '/tickets/messages/bulk',
    handler: ticketHandler.bulkCreateTicketMessages,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['ticket:create_message']) }
      ],
      validate: {
        payload: ticketValidator.bulkCreateTicketMessages
      },
      tags: ['ticket-messages']
    }
  },

  // Import ticket messages
  {
    method: 'POST',
    path: '/tickets/messages/import',
    handler: ticketHandler.importTicketMessages,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['ticket:import_messages']) }
      ],
      validate: {
        payload: ticketValidator.importTicketMessages
      },
      tags: ['ticket-messages']
    }
  },

  // Export ticket messages
  {
    method: 'GET',
    path: '/tickets/messages/export',
    handler: ticketHandler.exportTicketMessages,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) },
        { method: permissionBasedAccess(['ticket:export_messages']) }
      ],
      validate: {
        query: ticketValidator.exportTicketMessages
      },
      tags: ['ticket-messages']
    }
  }
];

module.exports = routes;
