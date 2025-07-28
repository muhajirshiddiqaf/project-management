/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Enable UUID extension
  pgm.createExtension('uuid-ossp', { ifNotExists: true });

  // Create organizations table
  pgm.createTable('organizations', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()')
    },
    name: { type: 'varchar(255)', notNull: true },
    slug: { type: 'varchar(100)', notNull: true, unique: true },
    domain: { type: 'varchar(255)' },
    logo_url: { type: 'text' },
    primary_color: { type: 'varchar(7)' },
    secondary_color: { type: 'varchar(7)' },
    timezone: { type: 'varchar(50)', default: 'UTC' },
    currency: { type: 'varchar(3)', default: 'USD' },
    language: { type: 'varchar(5)', default: 'en' },
    subscription_plan: { type: 'varchar(50)', default: 'starter' },
    subscription_status: { type: 'varchar(20)', default: 'active' },
    subscription_expires_at: { type: 'timestamp' },
    max_users: { type: 'integer', default: 5 },
    max_projects: { type: 'integer', default: 10 },
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

  // Create indexes
  pgm.createIndex('organizations', 'slug');
  pgm.createIndex('organizations', 'subscription_status');
};

exports.down = pgm => {
  pgm.dropTable('organizations', { cascade: true });
};
