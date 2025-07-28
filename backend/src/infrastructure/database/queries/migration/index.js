// === MIGRATION MANAGEMENT ===
const createMigration = `
  INSERT INTO migrations (
    name, description, version, type, sql_up, sql_down, dependencies,
    is_reversible, batch_size, status, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', $10
  ) RETURNING *
`;

const getMigrations = `
  SELECT
    m.id,
    m.name,
    m.description,
    m.version,
    m.type,
    m.sql_up,
    m.sql_down,
    m.dependencies,
    m.is_reversible,
    m.batch_size,
    m.status,
    m.created_by,
    u.name as created_by_name,
    m.created_at,
    m.updated_at
  FROM migrations m
  LEFT JOIN users u ON m.created_by = u.id
  ORDER BY m.created_at DESC
  LIMIT $1 OFFSET $2
`;

const countMigrations = `
  SELECT COUNT(*) as count
  FROM migrations m
`;

const getMigrationById = `
  SELECT
    m.id,
    m.name,
    m.description,
    m.version,
    m.type,
    m.sql_up,
    m.sql_down,
    m.dependencies,
    m.is_reversible,
    m.batch_size,
    m.status,
    m.created_by,
    u.name as created_by_name,
    m.created_at,
    m.updated_at
  FROM migrations m
  LEFT JOIN users u ON m.created_by = u.id
  WHERE m.id = $1
`;

const updateMigration = `
  UPDATE migrations
  SET
    name = COALESCE($2, name),
    description = COALESCE($3, description),
    version = COALESCE($4, version),
    type = COALESCE($5, type),
    sql_up = COALESCE($6, sql_up),
    sql_down = COALESCE($7, sql_down),
    dependencies = COALESCE($8, dependencies),
    is_reversible = COALESCE($9, is_reversible),
    batch_size = COALESCE($10, batch_size),
    updated_at = NOW()
  WHERE id = $1
  RETURNING *
`;

const deleteMigration = `
  DELETE FROM migrations WHERE id = $1 RETURNING *
`;

// === MIGRATION EXECUTION ===
const runMigration = `
  UPDATE migrations
  SET
    status = 'running',
    executed_at = NOW(),
    executed_by = $6,
    execution_options = jsonb_build_object(
      'force', $2,
      'dry_run', $3,
      'rollback_on_failure', $4,
      'timeout_seconds', $5
    )
  WHERE id = $1
  RETURNING *
`;

const runMigrations = `
  UPDATE migrations
  SET
    status = 'running',
    executed_at = NOW(),
    executed_by = $8,
    execution_options = jsonb_build_object(
      'version', $1,
      'type', $2,
      'force', $3,
      'dry_run', $4,
      'rollback_on_failure', $5,
      'timeout_seconds', $6,
      'batch_size', $7
    )
  WHERE status = 'pending'
  AND ($1 IS NULL OR version = $1)
  AND ($2 IS NULL OR type = $2)
  RETURNING *
`;

const rollbackMigration = `
  UPDATE migrations
  SET
    status = 'rolling_back',
    rollback_started_at = NOW(),
    rollback_by = $5,
    rollback_options = jsonb_build_object(
      'force', $2,
      'dry_run', $3,
      'timeout_seconds', $4
    )
  WHERE id = $1
  RETURNING *
`;

const rollbackMigrations = `
  UPDATE migrations
  SET
    status = 'rolling_back',
    rollback_started_at = NOW(),
    rollback_by = $7,
    rollback_options = jsonb_build_object(
      'version', $1,
      'type', $2,
      'force', $3,
      'dry_run', $4,
      'timeout_seconds', $5,
      'limit', $6
    )
  WHERE status = 'completed'
  AND ($1 IS NULL OR version = $1)
  AND ($2 IS NULL OR type = $2)
  ORDER BY executed_at DESC
  LIMIT $6
  RETURNING *
`;

// === MIGRATION STATUS ===
const getMigrationStatus = `
  SELECT
    m.id,
    m.name,
    m.version,
    m.type,
    m.status,
    m.executed_at,
    m.executed_by,
    m.rollback_started_at,
    m.rollback_by,
    u.name as executed_by_name,
    rb.name as rollback_by_name
  FROM migrations m
  LEFT JOIN users u ON m.executed_by = u.id
  LEFT JOIN users rb ON m.rollback_by = rb.id
  WHERE 1=1
  ORDER BY m.created_at DESC
`;

const getMigrationHistory = `
  SELECT
    mh.id,
    mh.migration_id,
    m.name as migration_name,
    mh.version,
    mh.type,
    mh.status,
    mh.executed_at,
    mh.executed_by,
    u.name as executed_by_name,
    mh.execution_duration,
    mh.error_message,
    mh.rollback_at,
    mh.rollback_by,
    rb.name as rollback_by_name,
    mh.rollback_duration
  FROM migration_history mh
  LEFT JOIN migrations m ON mh.migration_id = m.id
  LEFT JOIN users u ON mh.executed_by = u.id
  LEFT JOIN users rb ON mh.rollback_by = rb.id
  ORDER BY mh.executed_at DESC
  LIMIT $1 OFFSET $2
`;

const countMigrationHistory = `
  SELECT COUNT(*) as count
  FROM migration_history mh
`;

// === SEEDING OPERATIONS ===
const createSeed = `
  INSERT INTO seeds (
    name, description, table_name, data, conditions, update_existing,
    batch_size, dependencies, status, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9
  ) RETURNING *
`;

const getSeeds = `
  SELECT
    s.id,
    s.name,
    s.description,
    s.table_name,
    s.data,
    s.conditions,
    s.update_existing,
    s.batch_size,
    s.dependencies,
    s.status,
    s.created_by,
    u.name as created_by_name,
    s.created_at,
    s.updated_at
  FROM seeds s
  LEFT JOIN users u ON s.created_by = u.id
  ORDER BY s.created_at DESC
  LIMIT $1 OFFSET $2
`;

const countSeeds = `
  SELECT COUNT(*) as count
  FROM seeds s
`;

const getSeedById = `
  SELECT
    s.id,
    s.name,
    s.description,
    s.table_name,
    s.data,
    s.conditions,
    s.update_existing,
    s.batch_size,
    s.dependencies,
    s.status,
    s.created_by,
    u.name as created_by_name,
    s.created_at,
    s.updated_at
  FROM seeds s
  LEFT JOIN users u ON s.created_by = u.id
  WHERE s.id = $1
`;

const updateSeed = `
  UPDATE seeds
  SET
    name = COALESCE($2, name),
    description = COALESCE($3, description),
    table_name = COALESCE($4, table_name),
    data = COALESCE($5, data),
    conditions = COALESCE($6, conditions),
    update_existing = COALESCE($7, update_existing),
    batch_size = COALESCE($8, batch_size),
    dependencies = COALESCE($9, dependencies),
    updated_at = NOW()
  WHERE id = $1
  RETURNING *
`;

const deleteSeed = `
  DELETE FROM seeds WHERE id = $1 RETURNING *
`;

// === SEED EXECUTION ===
const runSeed = `
  UPDATE seeds
  SET
    status = 'running',
    executed_at = NOW(),
    executed_by = $6,
    execution_options = jsonb_build_object(
      'force', $2,
      'dry_run', $3,
      'update_existing', $4,
      'timeout_seconds', $5
    )
  WHERE id = $1
  RETURNING *
`;

const runSeeds = `
  UPDATE seeds
  SET
    status = 'running',
    executed_at = NOW(),
    executed_by = $7,
    execution_options = jsonb_build_object(
      'table_name', $1,
      'force', $2,
      'dry_run', $3,
      'update_existing', $4,
      'timeout_seconds', $5,
      'batch_size', $6
    )
  WHERE status = 'pending'
  AND ($1 IS NULL OR table_name = $1)
  RETURNING *
`;

// === VERSIONING ===
const getMigrationVersions = `
  SELECT
    mv.id,
    mv.version,
    mv.description,
    mv.release_notes,
    mv.is_major,
    mv.is_breaking,
    mv.dependencies,
    mv.migrations,
    mv.seeds,
    mv.created_by,
    u.name as created_by_name,
    mv.created_at,
    mv.updated_at
  FROM migration_versions mv
  LEFT JOIN users u ON mv.created_by = u.id
  WHERE ($1 = true OR mv.status != 'completed')
  AND ($2 = true OR mv.status != 'failed')
  ORDER BY mv.version DESC
`;

const createVersion = `
  INSERT INTO migration_versions (
    version, description, release_notes, is_major, is_breaking,
    dependencies, migrations, seeds, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9
  ) RETURNING *
`;

const getVersionById = `
  SELECT
    mv.id,
    mv.version,
    mv.description,
    mv.release_notes,
    mv.is_major,
    mv.is_breaking,
    mv.dependencies,
    mv.migrations,
    mv.seeds,
    mv.created_by,
    u.name as created_by_name,
    mv.created_at,
    mv.updated_at
  FROM migration_versions mv
  LEFT JOIN users u ON mv.created_by = u.id
  WHERE mv.id = $1
`;

const updateVersion = `
  UPDATE migration_versions
  SET
    description = COALESCE($2, description),
    release_notes = COALESCE($3, release_notes),
    is_major = COALESCE($4, is_major),
    is_breaking = COALESCE($5, is_breaking),
    dependencies = COALESCE($6, dependencies),
    migrations = COALESCE($7, migrations),
    seeds = COALESCE($8, seeds),
    updated_at = NOW()
  WHERE id = $1
  RETURNING *
`;

const deleteVersion = `
  DELETE FROM migration_versions WHERE id = $1 RETURNING *
`;

// === DEPENDENCY MANAGEMENT ===
const getDependencies = `
  SELECT
    d.id,
    d.source_id,
    d.source_type,
    d.target_id,
    d.target_type,
    d.dependency_type,
    d.created_by,
    u.name as created_by_name,
    d.created_at
  FROM dependencies d
  LEFT JOIN users u ON d.created_by = u.id
  ORDER BY d.created_at DESC
`;

const addDependency = `
  INSERT INTO dependencies (
    source_id, source_type, target_id, target_type, dependency_type, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6
  ) RETURNING *
`;

const removeDependency = `
  DELETE FROM dependencies
  WHERE source_id = $1
  AND source_type = $2
  AND target_id = $3
  AND target_type = $4
  RETURNING *
`;

// === VALIDATION & TESTING ===
const validateMigration = `
  INSERT INTO migration_validations (
    migration_id, check_syntax, check_dependencies, check_conflicts,
    dry_run, status, validated_by
  ) VALUES (
    $1, $2, $3, $4, $5, 'validating', $6
  ) RETURNING *
`;

const validateSeed = `
  INSERT INTO seed_validations (
    seed_id, check_schema, check_constraints, check_data_types,
    dry_run, status, validated_by
  ) VALUES (
    $1, $2, $3, $4, $5, 'validating', $6
  ) RETURNING *
`;

const testMigration = `
  INSERT INTO migration_tests (
    migration_id, test_environment, backup_before_test,
    restore_after_test, timeout_seconds, status, tested_by
  ) VALUES (
    $1, $2, $3, $4, $5, 'testing', $6
  ) RETURNING *
`;

const testSeed = `
  INSERT INTO seed_tests (
    seed_id, test_environment, backup_before_test,
    restore_after_test, timeout_seconds, status, tested_by
  ) VALUES (
    $1, $2, $3, $4, $5, 'testing', $6
  ) RETURNING *
`;

// === EXPORT & IMPORT ===
const exportMigration = `
  SELECT
    m.id,
    m.name,
    m.description,
    m.version,
    m.type,
    m.sql_up,
    m.sql_down,
    m.dependencies,
    m.is_reversible,
    m.batch_size,
    m.created_at,
    m.updated_at
  FROM migrations m
  WHERE m.id = $1
`;

const exportSeed = `
  SELECT
    s.id,
    s.name,
    s.description,
    s.table_name,
    s.data,
    s.conditions,
    s.update_existing,
    s.batch_size,
    s.dependencies,
    s.created_at,
    s.updated_at
  FROM seeds s
  WHERE s.id = $1
`;

const importMigration = `
  INSERT INTO migrations (
    name, description, version, type, sql_up, sql_down, dependencies,
    is_reversible, batch_size, status, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', $10
  ) RETURNING *
`;

const importSeed = `
  INSERT INTO seeds (
    name, description, table_name, data, conditions, update_existing,
    batch_size, dependencies, status, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9
  ) RETURNING *
`;

// === BULK OPERATIONS ===
const bulkCreateMigrations = `
  INSERT INTO migrations (
    name, description, version, type, sql_up, sql_down, dependencies,
    is_reversible, batch_size, status, created_by
  )
  SELECT
    unnest($1::text[]) as name,
    unnest($2::text[]) as description,
    unnest($3::text[]) as version,
    unnest($4::text[]) as type,
    unnest($5::text[]) as sql_up,
    unnest($6::text[]) as sql_down,
    unnest($7::jsonb[]) as dependencies,
    unnest($8::boolean[]) as is_reversible,
    unnest($9::integer[]) as batch_size,
    'pending' as status,
    $10 as created_by
  RETURNING *
`;

const bulkCreateSeeds = `
  INSERT INTO seeds (
    name, description, table_name, data, conditions, update_existing,
    batch_size, dependencies, status, created_by
  )
  SELECT
    unnest($1::text[]) as name,
    unnest($2::text[]) as description,
    unnest($3::text[]) as table_name,
    unnest($4::jsonb[]) as data,
    unnest($5::jsonb[]) as conditions,
    unnest($6::boolean[]) as update_existing,
    unnest($7::integer[]) as batch_size,
    unnest($8::jsonb[]) as dependencies,
    'pending' as status,
    $9 as created_by
  RETURNING *
`;

// === STATISTICS & REPORTING ===
const getMigrationStatistics = `
  SELECT
    'total_migrations' as metric,
    COUNT(*) as value,
    NOW() as timestamp
  FROM migrations
  UNION ALL
  SELECT
    'completed_migrations' as metric,
    COUNT(*) as value,
    NOW() as timestamp
  FROM migrations
  WHERE status = 'completed'
  UNION ALL
  SELECT
    'failed_migrations' as metric,
    COUNT(*) as value,
    NOW() as timestamp
  FROM migrations
  WHERE status = 'failed'
  UNION ALL
  SELECT
    'pending_migrations' as metric,
    COUNT(*) as value,
    NOW() as timestamp
  FROM migrations
  WHERE status = 'pending'
  UNION ALL
  SELECT
    'migrations_by_type' as metric,
    type as value,
    COUNT(*) as count,
    NOW() as timestamp
  FROM migrations
  GROUP BY type
  UNION ALL
  SELECT
    'migrations_by_version' as metric,
    version as value,
    COUNT(*) as count,
    NOW() as timestamp
  FROM migrations
  GROUP BY version
`;

const getSeedStatistics = `
  SELECT
    'total_seeds' as metric,
    COUNT(*) as value,
    NOW() as timestamp
  FROM seeds
  UNION ALL
  SELECT
    'completed_seeds' as metric,
    COUNT(*) as value,
    NOW() as timestamp
  FROM seeds
  WHERE status = 'completed'
  UNION ALL
  SELECT
    'failed_seeds' as metric,
    COUNT(*) as value,
    NOW() as timestamp
  FROM seeds
  WHERE status = 'failed'
  UNION ALL
  SELECT
    'pending_seeds' as metric,
    COUNT(*) as value,
    NOW() as timestamp
  FROM seeds
  WHERE status = 'pending'
  UNION ALL
  SELECT
    'seeds_by_table' as metric,
    table_name as value,
    COUNT(*) as count,
    NOW() as timestamp
  FROM seeds
  GROUP BY table_name
`;

const generateMigrationReport = `
  SELECT
    m.id,
    m.name,
    m.description,
    m.version,
    m.type,
    m.status,
    m.created_at,
    m.executed_at,
    m.executed_by,
    u.name as executed_by_name,
    m.execution_duration,
    m.error_message
  FROM migrations m
  LEFT JOIN users u ON m.executed_by = u.id
  WHERE ($1 IS NULL OR m.created_at >= $1)
  AND ($2 IS NULL OR m.created_at <= $2)
  AND ($3 IS NULL OR m.type = $3)
  ORDER BY m.created_at DESC
`;

const generateSeedReport = `
  SELECT
    s.id,
    s.name,
    s.description,
    s.table_name,
    s.status,
    s.created_at,
    s.executed_at,
    s.executed_by,
    u.name as executed_by_name,
    s.execution_duration,
    s.error_message
  FROM seeds s
  LEFT JOIN users u ON s.executed_by = u.id
  WHERE ($1 IS NULL OR s.created_at >= $1)
  AND ($2 IS NULL OR s.created_at <= $2)
  AND ($3 IS NULL OR s.table_name = $3)
  ORDER BY s.created_at DESC
`;

// === AUDIT LOGGING ===
const createAuditLog = `
  INSERT INTO migration_audit_logs (
    user_id, action, resource, resource_id, details, ip_address, user_agent
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7
  ) RETURNING *
`;

module.exports = {
  // Migration Management
  createMigration,
  getMigrations,
  countMigrations,
  getMigrationById,
  updateMigration,
  deleteMigration,

  // Migration Execution
  runMigration,
  runMigrations,
  rollbackMigration,
  rollbackMigrations,

  // Migration Status
  getMigrationStatus,
  getMigrationHistory,
  countMigrationHistory,

  // Seeding Operations
  createSeed,
  getSeeds,
  countSeeds,
  getSeedById,
  updateSeed,
  deleteSeed,

  // Seed Execution
  runSeed,
  runSeeds,

  // Versioning
  getMigrationVersions,
  createVersion,
  getVersionById,
  updateVersion,
  deleteVersion,

  // Dependency Management
  getDependencies,
  addDependency,
  removeDependency,

  // Validation & Testing
  validateMigration,
  validateSeed,
  testMigration,
  testSeed,

  // Export & Import
  exportMigration,
  exportSeed,
  importMigration,
  importSeed,

  // Bulk Operations
  bulkCreateMigrations,
  bulkCreateSeeds,

  // Statistics & Reporting
  getMigrationStatistics,
  getSeedStatistics,
  generateMigrationReport,
  generateSeedReport,

  // Audit Logging
  createAuditLog
};
