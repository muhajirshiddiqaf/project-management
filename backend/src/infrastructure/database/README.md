# Database Migration & Seeding System

This directory contains the database migration and seeding system for the Project Management & Quotation System.

## 📁 Directory Structure

```
database/
├── migrations/          # Database schema migrations
│   ├── 001_create_migrations_table.sql
│   ├── 002_create_seeds_table.sql
│   ├── 003_create_migration_versions_table.sql
│   ├── 004_create_dependencies_table.sql
│   ├── 005_create_migration_history_table.sql
│   ├── 006_create_validation_tables.sql
│   └── 007_create_audit_logs_table.sql
├── seeds/              # Initial data seeding
│   ├── 001_initial_migration_seed.sql
│   ├── 002_initial_seeds_data.sql
│   ├── 003_initial_versions_data.sql
│   ├── 004_complete_database_schema.sql
│   └── 005_initial_data_seed.sql
├── migrate.js          # Migration runner script
├── setup_database.js   # Complete database setup script
└── README.md          # This file
```

## 🚀 Quick Start

### 1. Complete Database Setup

```bash
# Setup complete database with all schema and data
node setup_database.js setup

# Reset and setup database (WARNING: This will drop all tables)
node setup_database.js reset

# Check database status
node setup_database.js status
```

### 2. Run Migrations

```bash
# Run all pending migrations
node migrate.js run

# Run with error continuation
CONTINUE_ON_ERROR=true node migrate.js run
```

### 3. Check Migration Status

```bash
# Show migration status
node migrate.js status
```

### 4. Rollback Migrations

```bash
# Rollback last migration
node migrate.js rollback

# Rollback last 3 migrations
node migrate.js rollback 3
```

## 📋 Migration Files

### Schema Migrations

#### 001_create_migrations_table.sql

- Creates the main migrations table
- Tracks migration execution status
- Stores SQL up/down scripts
- Includes dependency management

#### 002_create_seeds_table.sql

- Creates the seeds table for data seeding
- Supports batch processing
- Includes execution tracking

#### 003_create_migration_versions_table.sql

- Creates versioning system
- Tracks major/minor versions
- Includes release notes
- Manages breaking changes

#### 004_create_dependencies_table.sql

- Creates dependency management
- Supports required/optional/conflicts
- Links migrations, seeds, and versions

#### 005_create_migration_history_table.sql

- Tracks execution history
- Records performance metrics
- Stores error messages

#### 006_create_validation_tables.sql

- Migration validations
- Seed validations
- Migration tests
- Seed tests

#### 007_create_audit_logs_table.sql

- Comprehensive audit logging
- Tracks all migration activities
- Includes IP and user agent

## 🌱 Seed Files

### 001_initial_migration_seed.sql

Sample migrations for testing:

- Create Users Table
- Create Organizations Table
- Add Organization ID to Users
- Create Projects Table
- Create Quotations Table

### 002_initial_seeds_data.sql

Sample seed data:

- Default User Roles
- Default Service Categories
- Default Project Statuses
- Default Quotation Statuses
- Default Invoice Statuses

### 003_initial_versions_data.sql

Sample version data:

- Version 1.0.0 (Initial Release)
- Version 1.1.0 (Project Management)
- Version 1.2.0 (Invoice Management)
- Version 2.0.0 (Advanced Features)

### 004_complete_database_schema.sql

Complete database schema migration:

- All tables from the original schema.sql
- Organizations, Users, Clients, Projects
- Quotations, Orders, Tickets, Invoices
- Service management, Email & PDF management
- Subscription & Usage tracking
- All indexes and triggers

### 005_initial_data_seed.sql

Initial data from schema.sql:

- Default organization setup
- Default service categories
- Basic system configuration

## 🔧 Configuration

### Environment Variables

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=project_management
DB_USER=postgres
DB_PASSWORD=password
DB_SSL=false

# Migration Configuration
CONTINUE_ON_ERROR=false
```

## 🗄️ Complete Database Setup

### Setup Script

The `setup_database.js` script provides a complete database setup solution:

```bash
# Setup complete database with all schema and data
node setup_database.js setup

# Reset and setup database (WARNING: This will drop all tables)
node setup_database.js reset

# Check database status
node setup_database.js status
```

### What the Setup Script Does

1. **Schema Creation**: Creates all database tables from the original schema.sql
2. **Initial Data**: Seeds default organization and service categories
3. **Migration System**: Sets up the migration tracking system
4. **Sample Data**: Populates sample migrations, seeds, and versions
5. **Indexes & Triggers**: Creates all performance indexes and update triggers

### Database Schema Included

- **Organization & User Management**: Multi-tenant organizations and users
- **Client Management**: Clients, contacts, and communications
- **Project & Quotation Management**: Projects, quotations, and cost calculations
- **Order & Ticket Management**: Orders, tickets, and messages
- **Invoice Management**: Invoices and invoice items
- **Service Management**: Service categories and services
- **Email & PDF Management**: Templates, campaigns, and tracking
- **Subscription & Usage Tracking**: Subscription management and usage metrics
- **Order Forms**: Custom order forms and submissions

### Database Connection

The migration system uses the same database configuration as the main application:

```javascript
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'project_management',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
};
```

## 📊 Migration Tracking

The system automatically tracks:

- ✅ Execution status
- ⏱️ Execution duration
- 📝 Error messages
- 🔄 Rollback status
- 👤 Executed by user
- 📅 Execution timestamp

## 🔄 Rollback System

### Automatic Rollback

- Tracks rollback SQL scripts
- Supports partial rollbacks
- Maintains rollback history

### Manual Rollback

```bash
# Rollback specific migration
node migrate.js rollback 1

# Rollback multiple migrations
node migrate.js rollback 3
```

## 🧪 Testing & Validation

### Migration Validation

- Syntax checking
- Dependency validation
- Conflict detection
- Dry-run support

### Seed Validation

- Schema validation
- Constraint checking
- Data type validation
- Dry-run support

## 📈 Monitoring & Analytics

### Migration Statistics

- Total migrations
- Success/failure rates
- Average execution time
- Version distribution

### Seed Statistics

- Total seeds
- Success/failure rates
- Table distribution
- Data volume metrics

## 🔐 Security Features

### Access Control

- Role-based permissions
- User authentication
- IP tracking
- Audit logging

### Data Protection

- Backup before execution
- Transaction safety
- Error isolation
- Rollback protection

## 🚨 Error Handling

### Graceful Failures

- Detailed error messages
- Partial execution support
- Automatic cleanup
- Recovery procedures

### Error Recovery

```bash
# Continue on error
CONTINUE_ON_ERROR=true node migrate.js run

# Check failed migrations
node migrate.js status

# Retry failed migrations
node migrate.js run
```

## 📚 API Integration

The migration system is fully integrated with the REST API:

### Migration Management

```bash
# Create migration
POST /migrations

# Get migrations
GET /migrations

# Run migration
POST /migrations/{id}/run

# Rollback migration
POST /migrations/{id}/rollback
```

### Seed Management

```bash
# Create seed
POST /seeds

# Get seeds
GET /seeds

# Run seed
POST /seeds/{id}/run
```

### Version Management

```bash
# Create version
POST /migrations/versions

# Get versions
GET /migrations/versions

# Update version
PUT /migrations/versions/{id}
```

## 🔧 Development

### Adding New Migrations

1. Create migration file:

```sql
-- Migration: 008_new_feature.sql
-- Description: Add new feature
-- Version: 1.2.0
-- Type: schema

CREATE TABLE new_feature (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

2. Run migration:

```bash
node migrate.js run
```

### Adding New Seeds

1. Create seed file:

```sql
-- Seed: 004_new_data.sql
-- Description: Add new seed data
-- Version: 1.2.0
-- Type: seed

INSERT INTO seeds (name, table_name, data, created_by) VALUES (
  'New Seed Data',
  'new_table',
  '[{"name": "value"}]',
  (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1)
);
```

2. Run seeds:

```bash
node migrate.js run
```

## 📖 Best Practices

### Migration Naming

- Use descriptive names
- Include version numbers
- Follow consistent format
- Add clear descriptions

### SQL Standards

- Use consistent formatting
- Include rollback scripts
- Add proper indexes
- Handle errors gracefully

### Version Management

- Semantic versioning
- Breaking change tracking
- Dependency management
- Release notes

### Testing

- Test in development first
- Use dry-run mode
- Validate dependencies
- Check rollback scripts

## 🆘 Troubleshooting

### Common Issues

1. **Connection Failed**

   ```bash
   # Check database connection
   psql -h localhost -U postgres -d project_management
   ```

2. **Migration Failed**

   ```bash
   # Check error logs
   node migrate.js status

   # Retry with error continuation
   CONTINUE_ON_ERROR=true node migrate.js run
   ```

3. **Rollback Issues**

   ```bash
   # Check rollback status
   node migrate.js status

   # Manual rollback
   node migrate.js rollback 1
   ```

### Debug Mode

```bash
# Enable debug logging
DEBUG=true node migrate.js run

# Verbose output
VERBOSE=true node migrate.js run
```

## 📞 Support

For issues or questions:

1. Check the error logs
2. Review migration status
3. Test in development environment
4. Consult the API documentation

## 📄 License

This migration system is part of the Project Management & Quotation System and follows the same license terms.
