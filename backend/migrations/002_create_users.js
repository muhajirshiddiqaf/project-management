/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Create users table
  pgm.createTable('users', {
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
    email: { type: 'varchar(255)', notNull: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    first_name: { type: 'varchar(100)', notNull: true },
    last_name: { type: 'varchar(100)', notNull: true },
    avatar_url: { type: 'text' },
    role: { type: 'varchar(50)', default: 'user' },
    permissions: { type: 'jsonb', default: '{}' },
    two_factor_enabled: { type: 'boolean', default: false },
    two_factor_secret: { type: 'varchar(255)' },
    last_login_at: { type: 'timestamp' },
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

  // Create unique constraint for organization_id + email
  pgm.addConstraint('users', 'users_organization_email_unique', {
    unique: ['organization_id', 'email']
  });

  // Create indexes
  pgm.createIndex('users', 'organization_id');
  pgm.createIndex('users', 'email');
};

exports.down = pgm => {
  pgm.dropTable('users', { cascade: true });
};
