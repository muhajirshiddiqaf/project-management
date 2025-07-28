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

// Function to read and execute SQL file
async function executeSqlFile(filePath) {
  try {
    console.log(`📄 Executing: ${path.basename(filePath)}`);
    const sqlContent = await fs.readFile(filePath, 'utf8');
    await pool.query(sqlContent);
    console.log(`✅ Successfully executed: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`❌ Error executing ${path.basename(filePath)}:`, error.message);
    throw error;
  }
}

// Function to setup complete database
async function setupDatabase() {
  console.log('🚀 Setting up complete database...\n');

  try {
    // 1. Run schema migration
    console.log('📋 Step 1: Creating database schema...');
    await executeSqlFile(path.join(__dirname, 'seeds', '004_complete_database_schema.sql'));
    console.log('✅ Database schema created successfully\n');

    // 2. Run initial data seed
    console.log('🌱 Step 2: Seeding initial data...');
    await executeSqlFile(path.join(__dirname, 'seeds', '005_initial_data_seed.sql'));
    console.log('✅ Initial data seeded successfully\n');

    // 3. Run migration system setup
    console.log('🔧 Step 3: Setting up migration system...');
    const migrationFiles = [
      '001_create_migrations_table.sql',
      '002_create_seeds_table.sql',
      '003_create_migration_versions_table.sql',
      '004_create_dependencies_table.sql',
      '005_create_migration_history_table.sql',
      '006_create_validation_tables.sql',
      '007_create_audit_logs_table.sql'
    ];

    for (const file of migrationFiles) {
      await executeSqlFile(path.join(__dirname, 'migrations', file));
    }
    console.log('✅ Migration system setup completed\n');

    // 4. Run sample data seeds
    console.log('📊 Step 4: Seeding sample data...');
    const seedFiles = [
      '001_initial_migration_seed.sql',
      '002_initial_seeds_data.sql',
      '003_initial_versions_data.sql'
    ];

    for (const file of seedFiles) {
      await executeSqlFile(path.join(__dirname, 'seeds', file));
    }
    console.log('✅ Sample data seeded successfully\n');

    console.log('🎉 Database setup completed successfully!');
    console.log('\n📊 Database Summary:');
    console.log('   ✅ Complete schema created');
    console.log('   ✅ Migration system initialized');
    console.log('   ✅ Initial data seeded');
    console.log('   ✅ Sample data populated');
    console.log('   ✅ Indexes and triggers created');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Function to reset database
async function resetDatabase() {
  console.log('🔄 Resetting database...\n');

  try {
    // Drop all tables (be careful with this in production!)
    const dropTablesQuery = `
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
      END $$;
    `;

    await pool.query(dropTablesQuery);
    console.log('✅ All tables dropped successfully\n');

    // Run complete setup
    await setupDatabase();

  } catch (error) {
    console.error('❌ Database reset failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Function to check database status
async function checkDatabaseStatus() {
  console.log('📊 Checking database status...\n');

  try {
    // Check if tables exist
    const tablesQuery = `
      SELECT
        table_name,
        (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    const result = await pool.query(tablesQuery);

    console.log('📋 Database Tables:');
    console.log('Table Name'.padEnd(30) + 'Columns');
    console.log('-'.repeat(40));

    result.rows.forEach(row => {
      console.log(row.table_name.padEnd(30) + row.column_count);
    });

    console.log(`\n📊 Total Tables: ${result.rows.length}`);

    // Check organizations
    const orgResult = await pool.query('SELECT COUNT(*) as count FROM organizations');
    console.log(`🏢 Organizations: ${orgResult.rows[0].count}`);

    // Check users
    const userResult = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log(`👥 Users: ${userResult.rows[0].count}`);

    // Check migrations
    const migrationResult = await pool.query('SELECT COUNT(*) as count FROM migrations');
    console.log(`🔄 Migrations: ${migrationResult.rows[0].count}`);

    // Check seeds
    const seedResult = await pool.query('SELECT COUNT(*) as count FROM seeds');
    console.log(`🌱 Seeds: ${seedResult.rows[0].count}`);

  } catch (error) {
    console.error('❌ Failed to check database status:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Main execution
async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'setup':
      await setupDatabase();
      break;
    case 'reset':
      await resetDatabase();
      break;
    case 'status':
      await checkDatabaseStatus();
      break;
    default:
      console.log('Usage:');
      console.log('  node setup_database.js setup   - Setup complete database');
      console.log('  node setup_database.js reset   - Reset and setup database');
      console.log('  node setup_database.js status  - Check database status');
      process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the setup
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Database setup script failed:', error.message);
    process.exit(1);
  });
}

module.exports = {
  setupDatabase,
  resetDatabase,
  checkDatabaseStatus
};
