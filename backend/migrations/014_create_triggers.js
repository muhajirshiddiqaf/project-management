/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Create function to update updated_at timestamp
  pgm.createFunction(
    'update_updated_at_column',
    [],
    {
      replace: true,
      language: 'plpgsql',
      returns: 'trigger',
      onNull: false,
      parallel: 'unsafe'
    },
    `
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    `
  );

  // Get all tables with updated_at column and create triggers
  const tables = [
    'organizations',
    'users',
    'clients',
    'client_contacts',
    'client_communications',
    'projects',
    'quotations',
    'orders',
    'order_items',
    'tickets',
    'ticket_messages',
    'invoices',
    'invoice_items',
    'service_categories',
    'services',
    'resource_rates',
    'materials',
    'project_cost_calculations',
    'project_tasks',
    'project_materials',
    'email_templates',
    'email_campaigns',
    'email_tracking',
    'pdf_templates',
    'generated_pdfs',
    'subscriptions',
    'usage_tracking',
    'order_forms',
    'form_submissions'
  ];

  // Create triggers for each table
  tables.forEach(tableName => {
    pgm.createTrigger(
      tableName,
      `update_updated_at_${tableName}`,
      {
        replace: true,
        level: 'row',
        when: 'before',
        operation: 'update',
        function: 'update_updated_at_column'
      }
    );
  });
};

exports.down = pgm => {
  // Drop triggers
  const tables = [
    'organizations',
    'users',
    'clients',
    'client_contacts',
    'client_communications',
    'projects',
    'quotations',
    'orders',
    'order_items',
    'tickets',
    'ticket_messages',
    'invoices',
    'invoice_items',
    'service_categories',
    'services',
    'resource_rates',
    'materials',
    'project_cost_calculations',
    'project_tasks',
    'project_materials',
    'email_templates',
    'email_campaigns',
    'email_tracking',
    'pdf_templates',
    'generated_pdfs',
    'subscriptions',
    'usage_tracking',
    'order_forms',
    'form_submissions'
  ];

  tables.forEach(tableName => {
    pgm.dropTrigger(tableName, `update_updated_at_${tableName}`, { ifExists: true });
  });

  // Drop function
  pgm.dropFunction('update_updated_at_column', [], { ifExists: true });
};
