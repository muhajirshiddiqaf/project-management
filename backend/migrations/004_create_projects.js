/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Create projects table
  pgm.createTable('projects', {
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
    name: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    status: { type: 'varchar(50)', default: 'draft' },
    priority: { type: 'varchar(20)', default: 'medium' },
    start_date: { type: 'date' },
    end_date: { type: 'date' },
    budget: { type: 'decimal(15,2)' },
    actual_cost: { type: 'decimal(15,2)', default: 0 },
    progress: { type: 'integer', default: 0 },
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

  // Create indexes
  pgm.createIndex('projects', 'organization_id');
  pgm.createIndex('projects', 'client_id');
  pgm.createIndex('projects', 'status');
};

exports.down = pgm => {
  pgm.dropTable('projects', { cascade: true });
};
