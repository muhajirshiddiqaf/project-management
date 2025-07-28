const emailHandler = require('./handler');
const emailValidator = require('./validator');
const { tenantIsolation, roleBasedAccess, permissionBasedAccess } = require('../../middleware');

const routes = [
  // === EMAIL SENDING ROUTES ===
  {
    method: 'POST',
    path: '/emails/send',
    handler: emailHandler.sendEmail,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['email:send']) }
      ],
      validate: {
        payload: emailValidator.sendEmail
      },
      tags: ['emails']
    }
  },
  {
    method: 'POST',
    path: '/emails/send-bulk',
    handler: emailHandler.sendBulkEmail,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['email:send_bulk']) }
      ],
      validate: {
        payload: emailValidator.sendBulkEmail
      },
      tags: ['emails']
    }
  },

  // === EMAIL TEMPLATES ROUTES ===
  {
    method: 'GET',
    path: '/email-templates',
    handler: emailHandler.getEmailTemplates,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: emailValidator.getEmailTemplates
      },
      tags: ['email-templates']
    }
  },
  {
    method: 'GET',
    path: '/email-templates/{id}',
    handler: emailHandler.getEmailTemplateById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: emailValidator.getEmailTemplateById
      },
      tags: ['email-templates']
    }
  },
  {
    method: 'POST',
    path: '/email-templates',
    handler: emailHandler.createEmailTemplate,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['email:create_template']) }
      ],
      validate: {
        payload: emailValidator.createEmailTemplate
      },
      tags: ['email-templates']
    }
  },
  {
    method: 'PUT',
    path: '/email-templates/{id}',
    handler: emailHandler.updateEmailTemplate,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['email:update_template']) }
      ],
      validate: {
        params: emailValidator.getEmailTemplateById,
        payload: emailValidator.updateEmailTemplate
      },
      tags: ['email-templates']
    }
  },
  {
    method: 'DELETE',
    path: '/email-templates/{id}',
    handler: emailHandler.deleteEmailTemplate,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['email:delete_template']) }
      ],
      validate: {
        params: emailValidator.deleteEmailTemplate
      },
      tags: ['email-templates']
    }
  },

  // === EMAIL TRACKING ROUTES ===
  {
    method: 'GET',
    path: '/email-tracking',
    handler: emailHandler.getEmailTracking,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: emailValidator.getEmailTracking
      },
      tags: ['email-tracking']
    }
  },
  {
    method: 'GET',
    path: '/email-tracking/{id}',
    handler: emailHandler.getEmailTrackingById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: emailValidator.getEmailTrackingById
      },
      tags: ['email-tracking']
    }
  },

  // === EMAIL SCHEDULING ROUTES ===
  {
    method: 'GET',
    path: '/email-schedules',
    handler: emailHandler.getEmailSchedules,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: emailValidator.getEmailSchedules
      },
      tags: ['email-schedules']
    }
  },
  {
    method: 'GET',
    path: '/email-schedules/{id}',
    handler: emailHandler.getEmailScheduleById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: emailValidator.getEmailScheduleById
      },
      tags: ['email-schedules']
    }
  },
  {
    method: 'POST',
    path: '/email-schedules',
    handler: emailHandler.createEmailSchedule,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['email:create_schedule']) }
      ],
      validate: {
        payload: emailValidator.createEmailSchedule
      },
      tags: ['email-schedules']
    }
  },
  {
    method: 'PUT',
    path: '/email-schedules/{id}',
    handler: emailHandler.updateEmailSchedule,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['email:update_schedule']) }
      ],
      validate: {
        params: emailValidator.getEmailScheduleById,
        payload: emailValidator.updateEmailSchedule
      },
      tags: ['email-schedules']
    }
  },
  {
    method: 'DELETE',
    path: '/email-schedules/{id}',
    handler: emailHandler.deleteEmailSchedule,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['email:delete_schedule']) }
      ],
      validate: {
        params: emailValidator.deleteEmailSchedule
      },
      tags: ['email-schedules']
    }
  },

  // === EMAIL STATISTICS ROUTES ===
  {
    method: 'GET',
    path: '/emails/statistics',
    handler: emailHandler.getEmailStatistics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: emailValidator.getEmailStatistics
      },
      tags: ['email-statistics']
    }
  },
  {
    method: 'GET',
    path: '/email-templates/statistics',
    handler: emailHandler.getEmailTemplateStatistics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: emailValidator.getEmailTemplateStatistics
      },
      tags: ['email-statistics']
    }
  },

  // === EMAIL WEBHOOK ROUTES ===
  {
    method: 'POST',
    path: '/emails/webhook',
    handler: emailHandler.processEmailWebhook,
    options: {
      auth: false, // No auth for webhooks
      validate: {
        payload: emailValidator.processEmailWebhook
      },
      tags: ['email-webhooks']
    }
  }
];

module.exports = routes;
