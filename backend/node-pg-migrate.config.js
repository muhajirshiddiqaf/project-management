module.exports = {
  migrationFolder: 'migrations',
  direction: 'up',
  logFileName: 'node-pg-migrate.log',
  databaseUrl: process.env.DATABASE_URL || {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'project_management',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  },
  migrationsTable: 'pgmigrations',
  schema: 'public',
  createSchema: true,
  verbose: true
};
