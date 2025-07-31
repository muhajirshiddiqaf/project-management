/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Create quotation_items table
  pgm.createTable('quotation_items', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()')
    },
    quotation_id: {
      type: 'uuid',
      notNull: true,
      references: '"quotations"',
      onDelete: 'CASCADE'
    },
    item_name: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    quantity: { type: 'decimal(10,2)', notNull: true, default: 1 },
    unit_price: { type: 'decimal(15,2)', notNull: true },
    unit_type: { type: 'varchar(50)', default: 'piece' },
    total_price: { type: 'decimal(15,2)', notNull: true },
    sort_order: { type: 'integer', default: 0 },
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
  pgm.createIndex('quotation_items', 'quotation_id');
  pgm.createIndex('quotation_items', 'sort_order');
};

exports.down = pgm => {
  pgm.dropTable('quotation_items', { cascade: true });
};
