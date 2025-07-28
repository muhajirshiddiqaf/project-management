const ticketHandler = require('./handler');
const ticketValidator = require('./validator');
const { tenantIsolation, roleBasedAccess, permissionBasedAccess } = require('../../middleware');

const routes = [
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
    path: '/tickets/{id}/comments',
    handler: ticketHandler.addTicketComment,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) },
        { method: permissionBasedAccess(['ticket:comment']) }
      ],
      validate: {
        params: ticketValidator.getTicketById,
        payload: ticketValidator.addTicketComment
      },
      tags: ['tickets']
    }
  },

  // Get ticket comments
  {
    method: 'GET',
    path: '/tickets/{id}/comments',
    handler: ticketHandler.getTicketComments,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: ticketValidator.getTicketById,
        query: ticketValidator.getTicketComments
      },
      tags: ['tickets']
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
  }
];

module.exports = routes;
