/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Create order_forms table
  pgm.createTable('order_forms', {
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
    form_data: { type: 'jsonb', notNull: true },
    is_active: { type: 'boolean', default: true },
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

  // Create form_submissions table
  pgm.createTable('form_submissions', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()')
    },
    form_id: {
      type: 'uuid',
      notNull: true,
      references: '"order_forms"',
      onDelete: 'CASCADE'
    },
    client_id: {
      type: 'uuid',
      references: '"clients"',
      onDelete: 'SET NULL'
    },
    submission_data: { type: 'jsonb', notNull: true },
    status: { type: 'varchar(50)', default: 'pending' },
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
  pgm.dropTable('form_submissions', { cascade: true });
  pgm.dropTable('order_forms', { cascade: true });
};
