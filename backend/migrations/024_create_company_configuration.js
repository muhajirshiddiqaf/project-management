/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Create company_configuration table
  pgm.createTable('company_configuration', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    organization_id: { type: 'uuid', notNull: true, references: 'organizations', onDelete: 'CASCADE' },
    company_name: { type: 'varchar(255)', notNull: true },
    address: { type: 'text' },
    city: { type: 'varchar(100)' },
    state: { type: 'varchar(100)' },
    postal_code: { type: 'varchar(20)' },
    country: { type: 'varchar(100)' },
    email: { type: 'varchar(255)' },
    phone: { type: 'varchar(50)' },
    website: { type: 'varchar(255)' },
    tax_number: { type: 'varchar(100)' },
    logo_url: { type: 'text' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
  });

  // Add indexes
  pgm.createIndex('company_configuration', 'organization_id');
  pgm.createIndex('company_configuration', 'company_name');

  // Add billing fields to clients table
  pgm.addColumns('clients', {
    billing_name: { type: 'varchar(255)' },
    billing_address: { type: 'text' },
    billing_city: { type: 'varchar(100)' },
    billing_state: { type: 'varchar(100)' },
    billing_postal_code: { type: 'varchar(20)' },
    billing_country: { type: 'varchar(100)' },
    billing_email: { type: 'varchar(255)' },
    billing_phone: { type: 'varchar(50)' }
  });

  // Add indexes for billing fields
  pgm.createIndex('clients', 'billing_name');
  pgm.createIndex('clients', 'billing_email');
};

exports.down = pgm => {
  // Remove billing fields from clients
  pgm.dropIndex('clients', 'billing_name');
  pgm.dropIndex('clients', 'billing_email');
  pgm.dropColumns('clients', [
    'billing_name', 'billing_address', 'billing_city', 'billing_state',
    'billing_postal_code', 'billing_country', 'billing_email', 'billing_phone'
  ]);

  // Remove company_configuration table
  pgm.dropIndex('company_configuration', 'organization_id');
  pgm.dropIndex('company_configuration', 'company_name');
  pgm.dropTable('company_configuration');
};
