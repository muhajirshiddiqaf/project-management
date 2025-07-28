const fs = require('fs').promises;
const path = require('path');
const { Pool } = require('pg');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'project_management',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
};

const pool = new Pool(dbConfig);

// Migration tracking table
const createMigrationTable = `
  CREATE TABLE IF NOT EXISTS migration_tracker (
    id SERIAL PRIMARY KEY,
    migration_name VARCHAR(255) NOT NULL UNIQUE,
    version VARCHAR(20) NOT NULL,
    executed_at TIMESTAMP DEFAULT NOW(),
    execution_duration INTEGER,
    status VARCHAR(20) DEFAULT 'completed',
    error_message TEXT
  )
`;

// Function to get all migration files
async function getMigrationFiles() {
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = await fs.readdir(migrationsDir);

  return files
    .filter(file => file.endsWith('.sql'))
    .sort()
    .map(file => ({
      name: file,
      path: path.join(migrationsDir, file),
      version: file.split('_')[0]
    }));
}

// Function to check if migration has been executed
async function isMigrationExecuted(migrationName) {
  const query = 'SELECT id FROM migration_tracker WHERE migration_name = $1';
  const result = await pool.query(query, [migrationName]);
  return result.rows.length > 0;
}

// Function to mark migration as executed
async function markMigrationExecuted(migrationName, version, duration, status = 'completed', errorMessage = null) {
  const query = `
    INSERT INTO migration_tracker (migration_name, version, execution_duration, status, error_message)
    VALUES ($1, $2, $3, $4, $5)
  `;
  await pool.query(query, [migrationName, version, duration, status, errorMessage]);
}

// Function to execute a single migration
async function executeMigration(migration) {
  console.log(`Executing migration: ${migration.name}`);

  const startTime = Date.now();

  try {
    // Read migration file
    const migrationContent = await fs.readFile(migration.path, 'utf8');

    // Extract version from file content
    const versionMatch = migrationContent.match(/-- Version: ([\d.]+)/);
    const version = versionMatch ? versionMatch[1] : '1.0.0';

    // Execute migration
    await pool.query(migrationContent);

    const duration = Math.floor((Date.now() - startTime) / 1000);

    // Mark as executed
    await markMigrationExecuted(migration.name, version, duration);

    console.log(`✅ Migration ${migration.name} executed successfully (${duration}s)`);

  } catch (error) {
    const duration = Math.floor((Date.now() - startTime) / 1000);

    // Mark as failed
    await markMigrationExecuted(migration.name, migration.version, duration, 'failed', error.message);

    console.error(`❌ Migration ${migration.name} failed:`, error.message);
    throw error;
  }
}

// Function to execute all pending migrations
async function runMigrations() {
  console.log('🚀 Starting database migrations...\n');

  try {
    // Create migration tracker table if it doesn't exist
    await pool.query(createMigrationTable);
    console.log('✅ Migration tracker table ready\n');

    // Get all migration files
    const migrations = await getMigrationFiles();
    console.log(`📁 Found ${migrations.length} migration files\n`);

    let executedCount = 0;
    let failedCount = 0;

    // Execute each migration
    for (const migration of migrations) {
      try {
        const isExecuted = await isMigrationExecuted(migration.name);

        if (!isExecuted) {
          await executeMigration(migration);
          executedCount++;
        } else {
          console.log(`⏭️  Migration ${migration.name} already executed, skipping`);
        }
      } catch (error) {
        failedCount++;
        console.error(`❌ Failed to execute migration ${migration.name}:`, error.message);

        // Ask user if they want to continue
        if (process.env.CONTINUE_ON_ERROR !== 'true') {
          console.log('\n❌ Migration failed. Set CONTINUE_ON_ERROR=true to continue with remaining migrations.');
          process.exit(1);
        }
      }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`   ✅ Executed: ${executedCount}`);
    console.log(`   ❌ Failed: ${failedCount}`);
    console.log(`   ⏭️  Skipped: ${migrations.length - executedCount - failedCount}`);

    if (failedCount === 0) {
      console.log('\n🎉 All migrations completed successfully!');
    } else {
      console.log(`\n⚠️  ${failedCount} migration(s) failed. Check the logs above for details.`);
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Migration process failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Function to rollback migrations
async function rollbackMigrations(count = 1) {
  console.log(`🔄 Rolling back ${count} migration(s)...\n`);

  try {
    // Get executed migrations in reverse order
    const query = `
      SELECT migration_name, version
      FROM migration_tracker
      WHERE status = 'completed'
      ORDER BY executed_at DESC
      LIMIT $1
    `;
    const result = await pool.query(query, [count]);

    if (result.rows.length === 0) {
      console.log('No migrations to rollback');
      return;
    }

    for (const migration of result.rows) {
      console.log(`Rolling back: ${migration.migration_name}`);

      // Note: This is a simplified rollback
      // In a real implementation, you would need to store and execute the rollback SQL
      const updateQuery = `
        UPDATE migration_tracker
        SET status = 'rolled_back',
            executed_at = NOW()
        WHERE migration_name = $1
      `;
      await pool.query(updateQuery, [migration.migration_name]);

      console.log(`✅ Rolled back: ${migration.migration_name}`);
    }

    console.log('\n🎉 Rollback completed successfully!');

  } catch (error) {
    console.error('❌ Rollback failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Function to show migration status
async function showStatus() {
  try {
    const query = `
      SELECT
        migration_name,
        version,
        status,
        executed_at,
        execution_duration
      FROM migration_tracker
      ORDER BY executed_at DESC
    `;
    const result = await pool.query(query);

    console.log('📊 Migration Status:\n');
    console.log('Migration Name'.padEnd(30) + 'Version'.padEnd(10) + 'Status'.padEnd(12) + 'Executed At'.padEnd(20) + 'Duration');
    console.log('-'.repeat(80));

    result.rows.forEach(row => {
      const executedAt = row.executed_at ? new Date(row.executed_at).toLocaleString() : 'N/A';
      const duration = row.execution_duration ? `${row.execution_duration}s` : 'N/A';
      const status = row.status === 'completed' ? '✅' : row.status === 'failed' ? '❌' : '⏭️';

      console.log(
        row.migration_name.padEnd(30) +
        row.version.padEnd(10) +
        `${status} ${row.status}`.padEnd(12) +
        executedAt.padEnd(20) +
        duration
      );
    });

  } catch (error) {
    console.error('❌ Failed to get migration status:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Main execution
async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'run':
      await runMigrations();
      break;
    case 'rollback':
      const count = parseInt(process.argv[3]) || 1;
      await rollbackMigrations(count);
      break;
    case 'status':
      await showStatus();
      break;
    default:
      console.log('Usage:');
      console.log('  node migrate.js run        - Run all pending migrations');
      console.log('  node migrate.js rollback   - Rollback last migration');
      console.log('  node migrate.js rollback N - Rollback last N migrations');
      console.log('  node migrate.js status     - Show migration status');
      process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the migration
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Migration script failed:', error.message);
    process.exit(1);
  });
}

module.exports = {
  runMigrations,
  rollbackMigrations,
  showStatus
};
