/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Create orders table
  pgm.createTable('orders', {
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
    quotation_id: {
      type: 'uuid',
      references: '"quotations"',
      onDelete: 'SET NULL'
    },
    order_number: { type: 'varchar(50)', notNull: true, unique: true },
    status: { type: 'varchar(50)', default: 'pending' },
    order_date: { type: 'date', default: pgm.func('current_date') },
    delivery_date: { type: 'date' },
    subtotal: { type: 'decimal(15,2)', default: 0 },
    tax_amount: { type: 'decimal(15,2)', default: 0 },
    discount_amount: { type: 'decimal(15,2)', default: 0 },
    total_amount: { type: 'decimal(15,2)', default: 0 },
    currency: { type: 'varchar(3)', default: 'USD' },
    notes: { type: 'text' },
    assigned_to: {
      type: 'uuid',
      references: '"users"',
      onDelete: 'SET NULL'
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

  // Create order_items table
  pgm.createTable('order_items', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()')
    },
    order_id: {
      type: 'uuid',
      notNull: true,
      references: '"orders"',
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
  pgm.createIndex('orders', 'organization_id');
  pgm.createIndex('orders', 'client_id');
  pgm.createIndex('orders', 'status');
};

exports.down = pgm => {
  pgm.dropTable('order_items', { cascade: true });
  pgm.dropTable('orders', { cascade: true });
};
