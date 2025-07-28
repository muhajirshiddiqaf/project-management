/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Create email_templates table
  pgm.createTable('email_templates', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()')
    },
    organization_id: {
      type: 'uuid',
      notNull: true,
      references: '"organizations"',
      onDelete: 'CASCADE'
    },
    name: { type: 'varchar(255)', notNull: true },
    subject: { type: 'varchar(255)', notNull: true },
    body: { type: 'text', notNull: true },
    variables: { type: 'jsonb', default: '{}' },
    is_active: { type: 'boolean', default: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });

  // Create email_campaigns table
  pgm.createTable('email_campaigns', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()')
    },
    organization_id: {
      type: 'uuid',
      notNull: true,
      references: '"organizations"',
      onDelete: 'CASCADE'
    },
    template_id: {
      type: 'uuid',
      references: '"email_templates"',
      onDelete: 'SET NULL'
    },
    name: { type: 'varchar(255)', notNull: true },
    subject: { type: 'varchar(255)', notNull: true },
    body: { type: 'text', notNull: true },
    status: { type: 'varchar(50)', default: 'draft' },
    scheduled_at: { type: 'timestamp' },
    sent_at: { type: 'timestamp' },
    total_recipients: { type: 'integer', default: 0 },
    sent_count: { type: 'integer', default: 0 },
    opened_count: { type: 'integer', default: 0 },
    clicked_count: { type: 'integer', default: 0 },
    created_by: {
      type: 'uuid',
      notNull: true,
      references: '"users"'
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });

  // Create email_tracking table
  pgm.createTable('email_tracking', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()')
    },
    campaign_id: {
      type: 'uuid',
      references: '"email_campaigns"',
      onDelete: 'CASCADE'
    },
    recipient_email: { type: 'varchar(255)', notNull: true },
    status: { type: 'varchar(50)', default: 'sent' },
    sent_at: { type: 'timestamp' },
    opened_at: { type: 'timestamp' },
    clicked_at: { type: 'timestamp' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });

  // Create pdf_templates table
  pgm.createTable('pdf_templates', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()')
    },
    organization_id: {
      type: 'uuid',
      notNull: true,
      references: '"organizations"',
      onDelete: 'CASCADE'
    },
    name: { type: 'varchar(255)', notNull: true },
    type: { type: 'varchar(50)', notNull: true }, // quotation, invoice, report
    template_data: { type: 'jsonb', notNull: true },
    is_active: { type: 'boolean', default: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });

  // Create generated_pdfs table
  pgm.createTable('generated_pdfs', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()')
    },
    organization_id: {
      type: 'uuid',
      notNull: true,
      references: '"organizations"',
      onDelete: 'CASCADE'
    },
    template_id: {
      type: 'uuid',
      references: '"pdf_templates"',
      onDelete: 'SET NULL'
    },
    file_name: { type: 'varchar(255)', notNull: true },
    file_path: { type: 'text', notNull: true },
    file_size: { type: 'integer' },
    type: { type: 'varchar(50)', notNull: true }, // quotation, invoice, report
    reference_id: { type: 'uuid' }, // quotation_id, invoice_id, etc.
    created_by: {
      type: 'uuid',
      notNull: true,
      references: '"users"'
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });
};

exports.down = pgm => {
  pgm.dropTable('generated_pdfs', { cascade: true });
  pgm.dropTable('pdf_templates', { cascade: true });
  pgm.dropTable('email_tracking', { cascade: true });
  pgm.dropTable('email_campaigns', { cascade: true });
  pgm.dropTable('email_templates', { cascade: true });
};
