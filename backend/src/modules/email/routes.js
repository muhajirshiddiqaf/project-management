const routes = (handler, auth) => [
  // === EMAIL SENDING ROUTES ===
  {
    method: 'POST',
    path: '/emails/send',
    handler: handler.sendEmail,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['email:send']) }
      ],
      validate: {
        payload: auth.sendEmail
      },
      tags: ['emails']
    }
  },
  {
    method: 'POST',
    path: '/emails/send-bulk',
    handler: handler.sendBulkEmail,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['email:send_bulk']) }
      ],
      validate: {
        payload: auth.sendBulkEmail
      },
      tags: ['emails']
    }
  },

  // === EMAIL TEMPLATES ROUTES ===
  {
    method: 'GET',
    path: '/email-templates',
    handler: handler.getEmailTemplates,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.getEmailTemplates
      },
      tags: ['email-templates']
    }
  },
  {
    method: 'GET',
    path: '/email-templates/{id}',
    handler: handler.getEmailTemplateById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: auth.getEmailTemplateById
      },
      tags: ['email-templates']
    }
  },
  {
    method: 'POST',
    path: '/email-templates',
    handler: handler.createEmailTemplate,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['email:create_template']) }
      ],
      validate: {
        payload: auth.createEmailTemplate
      },
      tags: ['email-templates']
    }
  },
  {
    method: 'PUT',
    path: '/email-templates/{id}',
    handler: handler.updateEmailTemplate,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['email:update_template']) }
      ],
      validate: {
        params: auth.getEmailTemplateById,
        payload: auth.updateEmailTemplate
      },
      tags: ['email-templates']
    }
  },
  {
    method: 'DELETE',
    path: '/email-templates/{id}',
    handler: handler.deleteEmailTemplate,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['email:delete_template']) }
      ],
      validate: {
        params: auth.deleteEmailTemplate
      },
      tags: ['email-templates']
    }
  },

  // === EMAIL TRACKING ROUTES ===
  {
    method: 'GET',
    path: '/email-tracking',
    handler: handler.getEmailTracking,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getEmailTracking
      },
      tags: ['email-tracking']
    }
  },
  {
    method: 'GET',
    path: '/email-tracking/{id}',
    handler: handler.getEmailTrackingById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: auth.getEmailTrackingById
      },
      tags: ['email-tracking']
    }
  },

  // === EMAIL SCHEDULING ROUTES ===
  {
    method: 'GET',
    path: '/email-schedules',
    handler: handler.getEmailSchedules,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getEmailSchedules
      },
      tags: ['email-schedules']
    }
  },
  {
    method: 'GET',
    path: '/email-schedules/{id}',
    handler: handler.getEmailScheduleById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: auth.getEmailScheduleById
      },
      tags: ['email-schedules']
    }
  },
  {
    method: 'POST',
    path: '/email-schedules',
    handler: handler.createEmailSchedule,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['email:create_schedule']) }
      ],
      validate: {
        payload: auth.createEmailSchedule
      },
      tags: ['email-schedules']
    }
  },
  {
    method: 'PUT',
    path: '/email-schedules/{id}',
    handler: handler.updateEmailSchedule,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['email:update_schedule']) }
      ],
      validate: {
        params: auth.getEmailScheduleById,
        payload: auth.updateEmailSchedule
      },
      tags: ['email-schedules']
    }
  },
  {
    method: 'DELETE',
    path: '/email-schedules/{id}',
    handler: handler.deleteEmailSchedule,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['email:delete_schedule']) }
      ],
      validate: {
        params: auth.deleteEmailSchedule
      },
      tags: ['email-schedules']
    }
  },

  // === EMAIL STATISTICS ROUTES ===
  {
    method: 'GET',
    path: '/emails/statistics',
    handler: handler.getEmailStatistics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getEmailStatistics
      },
      tags: ['email-statistics']
    }
  },
  {
    method: 'GET',
    path: '/email-templates/statistics',
    handler: handler.getEmailTemplateStatistics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getEmailTemplateStatistics
      },
      tags: ['email-statistics']
    }
  },

  // === EMAIL WEBHOOK ROUTES ===
  {
    method: 'POST',
    path: '/emails/webhook',
    handler: handler.processEmailWebhook,
    options: {
      auth: false, // No auth for webhooks
      validate: {
        payload: auth.processEmailWebhook
      },
      tags: ['email-webhooks']
    }
  }
];

module.exports = routes;
