/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Create service_categories table
  pgm.createTable('service_categories', {
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
    description: { type: 'text' },
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

  // Create services table
  pgm.createTable('services', {
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
    category_id: {
      type: 'uuid',
      references: '"service_categories"',
      onDelete: 'SET NULL'
    },
    name: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    base_price: { type: 'decimal(15,2)', notNull: true },
    currency: { type: 'varchar(3)', default: 'USD' },
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
};

exports.down = pgm => {
  pgm.dropTable('services', { cascade: true });
  pgm.dropTable('service_categories', { cascade: true });
};
