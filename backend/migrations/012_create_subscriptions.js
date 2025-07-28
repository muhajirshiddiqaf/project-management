/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Create subscriptions table
  pgm.createTable('subscriptions', {
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
    plan_name: { type: 'varchar(50)', notNull: true },
    status: { type: 'varchar(50)', default: 'active' },
    start_date: { type: 'date', notNull: true },
    end_date: { type: 'date' },
    billing_cycle: { type: 'varchar(20)', default: 'monthly' },
    amount: { type: 'decimal(10,2)', notNull: true },
    currency: { type: 'varchar(3)', default: 'USD' },
    stripe_subscription_id: { type: 'varchar(255)' },
    stripe_customer_id: { type: 'varchar(255)' },
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

  // Create usage_tracking table
  pgm.createTable('usage_tracking', {
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
    metric_name: { type: 'varchar(100)', notNull: true },
    metric_value: { type: 'integer', default: 0 },
    tracking_date: { type: 'date', default: pgm.func('current_date') },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });
};

exports.down = pgm => {
  pgm.dropTable('usage_tracking', { cascade: true });
  pgm.dropTable('subscriptions', { cascade: true });
};
