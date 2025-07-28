/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Create tickets table
  pgm.createTable('tickets', {
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
    client_id: {
      type: 'uuid',
      notNull: true,
      references: '"clients"',
      onDelete: 'CASCADE'
    },
    ticket_number: { type: 'varchar(50)', notNull: true, unique: true },
    subject: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    priority: { type: 'varchar(20)', default: 'medium' },
    status: { type: 'varchar(50)', default: 'open' },
    category: { type: 'varchar(100)' },
    assigned_to: {
      type: 'uuid',
      references: '"users"',
      onDelete: 'SET NULL'
    },
    created_by: {
      type: 'uuid',
      notNull: true,
      references: '"users"'
    },
    resolved_at: { type: 'timestamp' },
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

  // Create ticket_messages table
  pgm.createTable('ticket_messages', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()')
    },
    ticket_id: {
      type: 'uuid',
      notNull: true,
      references: '"tickets"',
      onDelete: 'CASCADE'
    },
    user_id: {
      type: 'uuid',
      references: '"users"',
      onDelete: 'SET NULL'
    },
    message: { type: 'text', notNull: true },
    is_internal: { type: 'boolean', default: false },
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

  // Create indexes
  pgm.createIndex('tickets', 'organization_id');
  pgm.createIndex('tickets', 'client_id');
  pgm.createIndex('tickets', 'status');
  pgm.createIndex('tickets', 'assigned_to');
};

exports.down = pgm => {
  pgm.dropTable('ticket_messages', { cascade: true });
  pgm.dropTable('tickets', { cascade: true });
};
