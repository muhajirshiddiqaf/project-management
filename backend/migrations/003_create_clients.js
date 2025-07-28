/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Create clients table
  pgm.createTable('clients', {
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
    company_name: { type: 'varchar(255)' },
    email: { type: 'varchar(255)' },
    phone: { type: 'varchar(50)' },
    address: { type: 'text' },
    city: { type: 'varchar(100)' },
    state: { type: 'varchar(100)' },
    country: { type: 'varchar(100)' },
    postal_code: { type: 'varchar(20)' },
    website: { type: 'varchar(255)' },
    industry: { type: 'varchar(100)' },
    client_type: { type: 'varchar(50)', default: 'prospect' },
    status: { type: 'varchar(50)', default: 'active' },
    source: { type: 'varchar(100)' },
    notes: { type: 'text' },
    tags: { type: 'text[]' },
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

  // Create client_contacts table
  pgm.createTable('client_contacts', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()')
    },
    client_id: {
      type: 'uuid',
      notNull: true,
      references: '"clients"',
      onDelete: 'CASCADE'
    },
    name: { type: 'varchar(255)', notNull: true },
    email: { type: 'varchar(255)' },
    phone: { type: 'varchar(50)' },
    position: { type: 'varchar(100)' },
    is_primary: { type: 'boolean', default: false },
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

  // Create client_communications table
  pgm.createTable('client_communications', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()')
    },
    client_id: {
      type: 'uuid',
      notNull: true,
      references: '"clients"',
      onDelete: 'CASCADE'
    },
    user_id: {
      type: 'uuid',
      references: '"users"',
      onDelete: 'SET NULL'
    },
    type: { type: 'varchar(50)', notNull: true }, // email, call, meeting, note
    subject: { type: 'varchar(255)' },
    content: { type: 'text' },
    direction: { type: 'varchar(20)', default: 'outbound' }, // inbound, outbound
    status: { type: 'varchar(50)', default: 'sent' },
    scheduled_at: { type: 'timestamp' },
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
  pgm.createIndex('clients', 'organization_id');
  pgm.createIndex('clients', 'status');
  pgm.createIndex('clients', 'client_type');
};

exports.down = pgm => {
  pgm.dropTable('client_communications', { cascade: true });
  pgm.dropTable('client_contacts', { cascade: true });
  pgm.dropTable('clients', { cascade: true });
};
