const Joi = require('@hapi/joi');

const migrationSchemas = {
  // === MIGRATION MANAGEMENT ===
  createMigration: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500).optional(),
    version: Joi.string().pattern(/^\d+\.\d+\.\d+$/).required(),
    type: Joi.string().valid('schema', 'data', 'seed', 'rollback').required(),
    sql_up: Joi.string().max(10000).optional(),
    sql_down: Joi.string().max(10000).optional(),
    dependencies: Joi.array().items(Joi.string()).optional(),
    is_reversible: Joi.boolean().default(true),
    batch_size: Joi.number().integer().min(1).max(10000).default(1000)
  }),

  getMigrations: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status: Joi.string().valid('pending', 'running', 'completed', 'failed', 'rolled_back').optional(),
    type: Joi.string().valid('schema', 'data', 'seed', 'rollback').optional(),
    version: Joi.string().pattern(/^\d+\.\d+\.\d+$/).optional(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    sort_by: Joi.string().valid('created_at', 'version', 'name', 'status').default('created_at'),
    sort_order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  getMigrationById: Joi.object({
    id: Joi.string().uuid().required()
  }),

  updateMigration: Joi.object({
    name: Joi.string().min(3).max(100).optional(),
    description: Joi.string().max(500).optional(),
    version: Joi.string().pattern(/^\d+\.\d+\.\d+$/).optional(),
    type: Joi.string().valid('schema', 'data', 'seed', 'rollback').optional(),
    sql_up: Joi.string().max(10000).optional(),
    sql_down: Joi.string().max(10000).optional(),
    dependencies: Joi.array().items(Joi.string()).optional(),
    is_reversible: Joi.boolean().optional(),
    batch_size: Joi.number().integer().min(1).max(10000).optional()
  }),

  deleteMigration: Joi.object({
    id: Joi.string().uuid().required()
  }),

  // === MIGRATION EXECUTION ===
  runMigration: Joi.object({
    id: Joi.string().uuid().required(),
    force: Joi.boolean().default(false),
    dry_run: Joi.boolean().default(false),
    rollback_on_failure: Joi.boolean().default(true),
    timeout_seconds: Joi.number().integer().min(30).max(3600).default(300)
  }),

  runMigrations: Joi.object({
    version: Joi.string().pattern(/^\d+\.\d+\.\d+$/).optional(),
    type: Joi.string().valid('schema', 'data', 'seed', 'rollback').optional(),
    force: Joi.boolean().default(false),
    dry_run: Joi.boolean().default(false),
    rollback_on_failure: Joi.boolean().default(true),
    timeout_seconds: Joi.number().integer().min(30).max(3600).default(300),
    batch_size: Joi.number().integer().min(1).max(10000).default(1000)
  }),

  rollbackMigration: Joi.object({
    id: Joi.string().uuid().required(),
    force: Joi.boolean().default(false),
    dry_run: Joi.boolean().default(false),
    timeout_seconds: Joi.number().integer().min(30).max(3600).default(300)
  }),

  rollbackMigrations: Joi.object({
    version: Joi.string().pattern(/^\d+\.\d+\.\d+$/).optional(),
    type: Joi.string().valid('schema', 'data', 'seed', 'rollback').optional(),
    force: Joi.boolean().default(false),
    dry_run: Joi.boolean().default(false),
    timeout_seconds: Joi.number().integer().min(30).max(3600).default(300),
    limit: Joi.number().integer().min(1).max(100).default(10)
  }),

  // === MIGRATION STATUS ===
  getMigrationStatus: Joi.object({
    id: Joi.string().uuid().optional(),
    version: Joi.string().pattern(/^\d+\.\d+\.\d+$/).optional()
  }),

  getMigrationHistory: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status: Joi.string().valid('completed', 'failed', 'rolled_back').optional(),
    type: Joi.string().valid('schema', 'data', 'seed', 'rollback').optional(),
    version: Joi.string().pattern(/^\d+\.\d+\.\d+$/).optional(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    sort_by: Joi.string().valid('executed_at', 'version', 'name').default('executed_at'),
    sort_order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  // === SEEDING OPERATIONS ===
  createSeed: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500).optional(),
    table_name: Joi.string().max(100).required(),
    data: Joi.array().items(Joi.object()).min(1).required(),
    conditions: Joi.object().optional(),
    update_existing: Joi.boolean().default(false),
    batch_size: Joi.number().integer().min(1).max(10000).default(1000),
    dependencies: Joi.array().items(Joi.string()).optional()
  }),

  getSeeds: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    table_name: Joi.string().max(100).optional(),
    status: Joi.string().valid('pending', 'running', 'completed', 'failed').optional(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    sort_by: Joi.string().valid('created_at', 'name', 'table_name').default('created_at'),
    sort_order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  getSeedById: Joi.object({
    id: Joi.string().uuid().required()
  }),

  updateSeed: Joi.object({
    name: Joi.string().min(3).max(100).optional(),
    description: Joi.string().max(500).optional(),
    table_name: Joi.string().max(100).optional(),
    data: Joi.array().items(Joi.object()).min(1).optional(),
    conditions: Joi.object().optional(),
    update_existing: Joi.boolean().optional(),
    batch_size: Joi.number().integer().min(1).max(10000).optional(),
    dependencies: Joi.array().items(Joi.string()).optional()
  }),

  deleteSeed: Joi.object({
    id: Joi.string().uuid().required()
  }),

  // === SEED EXECUTION ===
  runSeed: Joi.object({
    id: Joi.string().uuid().required(),
    force: Joi.boolean().default(false),
    dry_run: Joi.boolean().default(false),
    update_existing: Joi.boolean().default(false),
    timeout_seconds: Joi.number().integer().min(30).max(3600).default(300)
  }),

  runSeeds: Joi.object({
    table_name: Joi.string().max(100).optional(),
    force: Joi.boolean().default(false),
    dry_run: Joi.boolean().default(false),
    update_existing: Joi.boolean().default(false),
    timeout_seconds: Joi.number().integer().min(30).max(3600).default(300),
    batch_size: Joi.number().integer().min(1).max(10000).default(1000)
  }),

  // === VERSIONING ===
  getMigrationVersions: Joi.object({
    include_completed: Joi.boolean().default(true),
    include_failed: Joi.boolean().default(true),
    sort_order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  createVersion: Joi.object({
    version: Joi.string().pattern(/^\d+\.\d+\.\d+$/).required(),
    description: Joi.string().max(500).optional(),
    release_notes: Joi.string().max(2000).optional(),
    is_major: Joi.boolean().default(false),
    is_breaking: Joi.boolean().default(false),
    dependencies: Joi.array().items(Joi.string()).optional(),
    migrations: Joi.array().items(Joi.string().uuid()).optional(),
    seeds: Joi.array().items(Joi.string().uuid()).optional()
  }),

  getVersionById: Joi.object({
    id: Joi.string().uuid().required()
  }),

  updateVersion: Joi.object({
    description: Joi.string().max(500).optional(),
    release_notes: Joi.string().max(2000).optional(),
    is_major: Joi.boolean().optional(),
    is_breaking: Joi.boolean().optional(),
    dependencies: Joi.array().items(Joi.string()).optional(),
    migrations: Joi.array().items(Joi.string().uuid()).optional(),
    seeds: Joi.array().items(Joi.string().uuid()).optional()
  }),

  deleteVersion: Joi.object({
    id: Joi.string().uuid().required()
  }),

  // === DEPENDENCY MANAGEMENT ===
  getDependencies: Joi.object({
    migration_id: Joi.string().uuid().optional(),
    seed_id: Joi.string().uuid().optional(),
    version_id: Joi.string().uuid().optional(),
    type: Joi.string().valid('migration', 'seed', 'version').optional()
  }),

  addDependency: Joi.object({
    source_id: Joi.string().uuid().required(),
    source_type: Joi.string().valid('migration', 'seed', 'version').required(),
    target_id: Joi.string().uuid().required(),
    target_type: Joi.string().valid('migration', 'seed', 'version').required(),
    dependency_type: Joi.string().valid('required', 'optional', 'conflicts').default('required')
  }),

  removeDependency: Joi.object({
    source_id: Joi.string().uuid().required(),
    source_type: Joi.string().valid('migration', 'seed', 'version').required(),
    target_id: Joi.string().uuid().required(),
    target_type: Joi.string().valid('migration', 'seed', 'version').required()
  }),

  // === VALIDATION & TESTING ===
  validateMigration: Joi.object({
    id: Joi.string().uuid().required(),
    check_syntax: Joi.boolean().default(true),
    check_dependencies: Joi.boolean().default(true),
    check_conflicts: Joi.boolean().default(true),
    dry_run: Joi.boolean().default(true)
  }),

  validateSeed: Joi.object({
    id: Joi.string().uuid().required(),
    check_schema: Joi.boolean().default(true),
    check_constraints: Joi.boolean().default(true),
    check_data_types: Joi.boolean().default(true),
    dry_run: Joi.boolean().default(true)
  }),

  testMigration: Joi.object({
    id: Joi.string().uuid().required(),
    test_environment: Joi.string().valid('development', 'staging', 'production').default('development'),
    backup_before_test: Joi.boolean().default(true),
    restore_after_test: Joi.boolean().default(true),
    timeout_seconds: Joi.number().integer().min(30).max(3600).default(300)
  }),

  testSeed: Joi.object({
    id: Joi.string().uuid().required(),
    test_environment: Joi.string().valid('development', 'staging', 'production').default('development'),
    backup_before_test: Joi.boolean().default(true),
    restore_after_test: Joi.boolean().default(true),
    timeout_seconds: Joi.number().integer().min(30).max(3600).default(300)
  }),

  // === EXPORT & IMPORT ===
  exportMigration: Joi.object({
    id: Joi.string().uuid().required(),
    format: Joi.string().valid('sql', 'json', 'yaml').default('sql'),
    include_dependencies: Joi.boolean().default(true),
    include_metadata: Joi.boolean().default(true)
  }),

  exportSeed: Joi.object({
    id: Joi.string().uuid().required(),
    format: Joi.string().valid('sql', 'json', 'csv').default('json'),
    include_metadata: Joi.boolean().default(true)
  }),

  importMigration: Joi.object({
    file: Joi.object().required(),
    format: Joi.string().valid('sql', 'json', 'yaml').default('sql'),
    validate_before_import: Joi.boolean().default(true),
    overwrite_existing: Joi.boolean().default(false)
  }),

  importSeed: Joi.object({
    file: Joi.object().required(),
    format: Joi.string().valid('sql', 'json', 'csv').default('json'),
    validate_before_import: Joi.boolean().default(true),
    overwrite_existing: Joi.boolean().default(false)
  }),

  // === BULK OPERATIONS ===
  bulkCreateMigrations: Joi.object({
    migrations: Joi.array().items(Joi.object({
      name: Joi.string().min(3).max(100).required(),
      description: Joi.string().max(500).optional(),
      version: Joi.string().pattern(/^\d+\.\d+\.\d+$/).required(),
      type: Joi.string().valid('schema', 'data', 'seed', 'rollback').required(),
      sql_up: Joi.string().max(10000).optional(),
      sql_down: Joi.string().max(10000).optional(),
      dependencies: Joi.array().items(Joi.string()).optional(),
      is_reversible: Joi.boolean().default(true),
      batch_size: Joi.number().integer().min(1).max(10000).default(1000)
    })).min(1).max(100).required(),
    validate_before_create: Joi.boolean().default(true)
  }),

  bulkCreateSeeds: Joi.object({
    seeds: Joi.array().items(Joi.object({
      name: Joi.string().min(3).max(100).required(),
      description: Joi.string().max(500).optional(),
      table_name: Joi.string().max(100).required(),
      data: Joi.array().items(Joi.object()).min(1).required(),
      conditions: Joi.object().optional(),
      update_existing: Joi.boolean().default(false),
      batch_size: Joi.number().integer().min(1).max(10000).default(1000),
      dependencies: Joi.array().items(Joi.string()).optional()
    })).min(1).max(100).required(),
    validate_before_create: Joi.boolean().default(true)
  }),

  // === STATISTICS & REPORTING ===
  getMigrationStatistics: Joi.object({
    period: Joi.string().valid('1d', '7d', '30d', '90d').default('30d'),
    type: Joi.string().valid('schema', 'data', 'seed', 'rollback').optional(),
    include_details: Joi.boolean().default(false)
  }),

  getSeedStatistics: Joi.object({
    period: Joi.string().valid('1d', '7d', '30d', '90d').default('30d'),
    table_name: Joi.string().max(100).optional(),
    include_details: Joi.boolean().default(false)
  }),

  generateMigrationReport: Joi.object({
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    type: Joi.string().valid('schema', 'data', 'seed', 'rollback').optional(),
    format: Joi.string().valid('pdf', 'excel', 'json').default('pdf'),
    include_details: Joi.boolean().default(true)
  }),

  generateSeedReport: Joi.object({
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    table_name: Joi.string().max(100).optional(),
    format: Joi.string().valid('pdf', 'excel', 'json').default('pdf'),
    include_details: Joi.boolean().default(true)
  })
};

module.exports = migrationSchemas;
