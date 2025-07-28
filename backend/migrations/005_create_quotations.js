/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Create quotations table
  pgm.createTable('quotations', {
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
    project_id: {
      type: 'uuid',
      references: '"projects"',
      onDelete: 'SET NULL'
    },
    quotation_number: { type: 'varchar(50)', notNull: true, unique: true },
    subject: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    status: { type: 'varchar(50)', default: 'draft' },
    valid_until: { type: 'date' },
    subtotal: { type: 'decimal(15,2)', default: 0 },
    tax_rate: { type: 'decimal(5,2)', default: 0 },
    tax_amount: { type: 'decimal(15,2)', default: 0 },
    discount_rate: { type: 'decimal(5,2)', default: 0 },
    discount_amount: { type: 'decimal(15,2)', default: 0 },
    total_amount: { type: 'decimal(15,2)', default: 0 },
    currency: { type: 'varchar(3)', default: 'USD' },
    terms_conditions: { type: 'text' },
    notes: { type: 'text' },
    created_by: {
      type: 'uuid',
      notNull: true,
      references: '"users"'
    },
    approved_by: {
      type: 'uuid',
      references: '"users"'
    },
    approved_at: { type: 'timestamp' },
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
  pgm.createIndex('quotations', 'organization_id');
  pgm.createIndex('quotations', 'client_id');
  pgm.createIndex('quotations', 'status');
};

exports.down = pgm => {
  pgm.dropTable('quotations', { cascade: true });
};
