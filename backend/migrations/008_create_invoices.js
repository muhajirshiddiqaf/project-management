/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Create invoices table
  pgm.createTable('invoices', {
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
    order_id: {
      type: 'uuid',
      references: '"orders"',
      onDelete: 'SET NULL'
    },
    invoice_number: { type: 'varchar(50)', notNull: true, unique: true },
    status: { type: 'varchar(50)', default: 'draft' },
    issue_date: { type: 'date', default: pgm.func('current_date') },
    due_date: { type: 'date' },
    subtotal: { type: 'decimal(15,2)', default: 0 },
    tax_amount: { type: 'decimal(15,2)', default: 0 },
    discount_amount: { type: 'decimal(15,2)', default: 0 },
    total_amount: { type: 'decimal(15,2)', default: 0 },
    currency: { type: 'varchar(3)', default: 'USD' },
    payment_terms: { type: 'varchar(255)' },
    notes: { type: 'text' },
    created_by: {
      type: 'uuid',
      notNull: true,
      references: '"users"'
    },
    paid_at: { type: 'timestamp' },
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

  // Create invoice_items table
  pgm.createTable('invoice_items', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()')
    },
    invoice_id: {
      type: 'uuid',
      notNull: true,
      references: '"invoices"',
      onDelete: 'CASCADE'
    },
    name: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    quantity: { type: 'decimal(10,2)', default: 1 },
    unit_price: { type: 'decimal(15,2)', notNull: true },
    total_price: { type: 'decimal(15,2)', notNull: true },
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
  pgm.createIndex('invoices', 'organization_id');
  pgm.createIndex('invoices', 'client_id');
  pgm.createIndex('invoices', 'status');
};

exports.down = pgm => {
  pgm.dropTable('invoice_items', { cascade: true });
  pgm.dropTable('invoices', { cascade: true });
};
