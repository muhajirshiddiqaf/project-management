/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Create resource_rates table
  pgm.createTable('resource_rates', {
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
    user_id: {
      type: 'uuid',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE'
    },
    role: { type: 'varchar(100)', notNull: true },
    hourly_rate: { type: 'decimal(10,2)', notNull: true },
    daily_rate: { type: 'decimal(10,2)' },
    is_active: { type: 'boolean', default: true },
    effective_from: { type: 'date', default: pgm.func('current_date') },
    effective_to: { type: 'date' },
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

  // Create materials table
  pgm.createTable('materials', {
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
    unit: { type: 'varchar(50)', notNull: true },
    unit_cost: { type: 'decimal(10,2)', notNull: true },
    supplier: { type: 'varchar(255)' },
    supplier_contact: { type: 'text' },
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

  // Create project_cost_calculations table
  pgm.createTable('project_cost_calculations', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()')
    },
    project_id: {
      type: 'uuid',
      notNull: true,
      references: '"projects"',
      onDelete: 'CASCADE'
    },
    calculation_date: { type: 'date', default: pgm.func('current_date') },
    labor_cost: { type: 'decimal(15,2)', default: 0 },
    material_cost: { type: 'decimal(15,2)', default: 0 },
    overhead_cost: { type: 'decimal(15,2)', default: 0 },
    profit_margin: { type: 'decimal(5,2)', default: 0 },
    profit_amount: { type: 'decimal(15,2)', default: 0 },
    tax_rate: { type: 'decimal(5,2)', default: 0 },
    tax_amount: { type: 'decimal(15,2)', default: 0 },
    discount_rate: { type: 'decimal(5,2)', default: 0 },
    discount_amount: { type: 'decimal(15,2)', default: 0 },
    total_cost: { type: 'decimal(15,2)', default: 0 },
    final_price: { type: 'decimal(15,2)', default: 0 },
    currency: { type: 'varchar(3)', default: 'USD' },
    notes: { type: 'text' },
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

  // Create project_tasks table
  pgm.createTable('project_tasks', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()')
    },
    project_id: {
      type: 'uuid',
      notNull: true,
      references: '"projects"',
      onDelete: 'CASCADE'
    },
    name: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    estimated_hours: { type: 'decimal(8,2)' },
    actual_hours: { type: 'decimal(8,2)' },
    hourly_rate: { type: 'decimal(10,2)' },
    total_cost: { type: 'decimal(15,2)' },
    assigned_to: {
      type: 'uuid',
      references: '"users"',
      onDelete: 'SET NULL'
    },
    status: { type: 'varchar(50)', default: 'pending' },
    priority: { type: 'varchar(20)', default: 'medium' },
    start_date: { type: 'date' },
    end_date: { type: 'date' },
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

  // Create project_materials table
  pgm.createTable('project_materials', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()')
    },
    project_id: {
      type: 'uuid',
      notNull: true,
      references: '"projects"',
      onDelete: 'CASCADE'
    },
    material_id: {
      type: 'uuid',
      notNull: true,
      references: '"materials"',
      onDelete: 'CASCADE'
    },
    quantity: { type: 'decimal(10,2)', notNull: true },
    unit_cost: { type: 'decimal(10,2)', notNull: true },
    total_cost: { type: 'decimal(15,2)', notNull: true },
    notes: { type: 'text' },
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
  pgm.dropTable('project_materials', { cascade: true });
  pgm.dropTable('project_tasks', { cascade: true });
  pgm.dropTable('project_cost_calculations', { cascade: true });
  pgm.dropTable('materials', { cascade: true });
  pgm.dropTable('resource_rates', { cascade: true });
};
