const routes = (handler, auth) => [
  // === TICKET CRUD ROUTES ===

  // Get all tickets
  {
    method: 'GET',
    path: '/tickets',
    handler: handler.getTickets,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.getTickets
      },
      tags: ['tickets']
    }
  },

  // Get ticket by ID
  {
    method: 'GET',
    path: '/tickets/{id}',
    handler: handler.getTicketById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: auth.getTicketById
      },
      tags: ['tickets']
    }
  },

  // Create ticket
  {
    method: 'POST',
    path: '/tickets',
    handler: handler.createTicket,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) },
        //{ method: permissionBasedAccess(['ticket:create']) }
      ],
      validate: {
        payload: auth.createTicket
      },
      tags: ['tickets']
    }
  },

  // Update ticket
  {
    method: 'PUT',
    path: '/tickets/{id}',
    handler: handler.updateTicket,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['ticket:update']) }
      ],
      validate: {
        params: auth.getTicketById,
        payload: auth.updateTicket
      },
      tags: ['tickets']
    }
  },

  // Delete ticket
  {
    method: 'DELETE',
    path: '/tickets/{id}',
    handler: handler.deleteTicket,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['ticket:delete']) }
      ],
      validate: {
        params: auth.deleteTicket
      },
      tags: ['tickets']
    }
  },

  // Search tickets
  {
    method: 'GET',
    path: '/tickets/search',
    handler: handler.searchTickets,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.searchTickets
      },
      tags: ['tickets']
    }
  },

  // Update ticket status
  {
    method: 'PATCH',
    path: '/tickets/{id}/status',
    handler: handler.updateTicketStatus,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['ticket:update_status']) }
      ],
      validate: {
        params: auth.getTicketById,
        payload: auth.updateTicketStatus
      },
      tags: ['tickets']
    }
  },

  // Assign ticket
  {
    method: 'PATCH',
    path: '/tickets/{id}/assign',
    handler: handler.assignTicket,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['ticket:assign']) }
      ],
      validate: {
        params: auth.getTicketById,
        payload: auth.assignTicket
      },
      tags: ['tickets']
    }
  },

  // Add ticket comment
  {
    method: 'POST',
    path: '/tickets/comments',
    handler: handler.addTicketComment,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) },
        //{ method: permissionBasedAccess(['ticket:comment']) }
      ],
      validate: {
        payload: auth.createTicketMessage
      },
      tags: ['ticket-comments']
    }
  },

  // Get ticket comments
  {
    method: 'GET',
    path: '/tickets/comments',
    handler: handler.getTicketComments,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.getTicketMessages
      },
      tags: ['ticket-comments']
    }
  },

  // Get ticket statistics
  {
    method: 'GET',
    path: '/tickets/statistics',
    handler: handler.getTicketStatistics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      tags: ['tickets']
    }
  },

  // === TICKET MESSAGING ROUTES ===

  // Get ticket messages
  {
    method: 'GET',
    path: '/tickets/messages',
    handler: handler.getTicketMessages,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.getTicketMessages
      },
      tags: ['ticket-messages']
    }
  },

  // Get ticket message by ID
  {
    method: 'GET',
    path: '/tickets/messages/{id}',
    handler: handler.getTicketMessageById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: auth.getTicketMessageById
      },
      tags: ['ticket-messages']
    }
  },

  // Create ticket message
  {
    method: 'POST',
    path: '/tickets/messages',
    handler: handler.createTicketMessage,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) },
        //{ method: permissionBasedAccess(['ticket:create_message']) }
      ],
      validate: {
        payload: auth.createTicketMessage
      },
      tags: ['ticket-messages']
    }
  },

  // Update ticket message
  {
    method: 'PUT',
    path: '/tickets/messages/{id}',
    handler: handler.updateTicketMessage,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['ticket:update_message']) }
      ],
      validate: {
        params: auth.getTicketMessageById,
        payload: auth.updateTicketMessage
      },
      tags: ['ticket-messages']
    }
  },

  // Delete ticket message
  {
    method: 'DELETE',
    path: '/tickets/messages/{id}',
    handler: handler.deleteTicketMessage,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['ticket:delete_message']) }
      ],
      validate: {
        params: auth.deleteTicketMessage
      },
      tags: ['ticket-messages']
    }
  },

  // Reply to ticket message
  {
    method: 'POST',
    path: '/tickets/messages/reply',
    handler: handler.replyToTicketMessage,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) },
        //{ method: permissionBasedAccess(['ticket:create_message']) }
      ],
      validate: {
        payload: auth.replyToTicketMessage
      },
      tags: ['ticket-messages']
    }
  },

  // Mark ticket message as read
  {
    method: 'POST',
    path: '/tickets/messages/read',
    handler: handler.markTicketMessageAsRead,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        payload: auth.markTicketMessageAsRead
      },
      tags: ['ticket-messages']
    }
  },

  // Get ticket message thread
  {
    method: 'GET',
    path: '/tickets/messages/thread',
    handler: handler.getTicketMessageThread,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.getTicketMessageThread
      },
      tags: ['ticket-messages']
    }
  },

  // Bulk create ticket messages
  {
    method: 'POST',
    path: '/tickets/messages/bulk',
    handler: handler.bulkCreateTicketMessages,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['ticket:create_message']) }
      ],
      validate: {
        payload: auth.bulkCreateTicketMessages
      },
      tags: ['ticket-messages']
    }
  },

  // Import ticket messages
  {
    method: 'POST',
    path: '/tickets/messages/import',
    handler: handler.importTicketMessages,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['ticket:import_messages']) }
      ],
      validate: {
        payload: auth.importTicketMessages
      },
      tags: ['ticket-messages']
    }
  },

  // Export ticket messages
  {
    method: 'GET',
    path: '/tickets/messages/export',
    handler: handler.exportTicketMessages,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) },
        //{ method: permissionBasedAccess(['ticket:export_messages']) }
      ],
      validate: {
        query: auth.exportTicketMessages
      },
      tags: ['ticket-messages']
    }
  }
];

module.exports = routes;
