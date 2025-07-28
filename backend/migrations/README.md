# Database Migrations with node-pg-migrate

This directory contains database migrations using `node-pg-migrate` for the Project Management & Quotation System.

## 📁 Migration Files

### Core Tables

- **001_create_organizations.js** - Organizations table (multi-tenant)
- **002_create_users.js** - Users table with organization relationship
- **003_create_clients.js** - Clients, contacts, and communications
- **004_create_projects.js** - Projects table
- **005_create_quotations.js** - Quotations table
- **006_create_orders.js** - Orders and order items
- **007_create_tickets.js** - Tickets and ticket messages
- **008_create_invoices.js** - Invoices and invoice items

### Service Management

- **009_create_services.js** - Service categories and services
- **010_create_cost_calculations.js** - Resource rates, materials, project tasks, cost calculations

### Email & PDF Management

- **011_create_email_pdf.js** - Email templates, campaigns, tracking, PDF templates, generated PDFs

### Subscription & Forms

- **012_create_subscriptions.js** - Subscriptions and usage tracking
- **013_create_order_forms.js** - Order forms and form submissions

### System Features

- **014_create_triggers.js** - Updated_at triggers for all tables
- **015_seed_initial_data.js** - Initial data seeding

## 🚀 Quick Start

### 1. Run All Migrations

```bash
# Run all pending migrations
npm run migrate

# Or using npx directly
npx node-pg-migrate up
```

### 2. Check Migration Status

```bash
# Check migration status
npm run migrate:status

# Or using npx directly
npx node-pg-migrate status
```

### 3. Rollback Migrations

```bash
# Rollback last migration
npm run migrate:down

# Rollback specific number of migrations
npx node-pg-migrate down --count 3
```

### 4. Create New Migration

```bash
# Create new migration file
npm run migrate:create

# Create with specific name
npx node-pg-migrate create add_new_table
```

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

# Or use DATABASE_URL
DATABASE_URL=postgres://user:password@localhost:5432/project_management
```

### Configuration File

The migrations use `node-pg-migrate.config.js` in the backend root:

```javascript
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
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  },
  migrationsTable: 'pgmigrations',
  schema: 'public',
  createSchema: true,
  verbose: true,
};
```

## 📋 Migration Structure

Each migration file follows this structure:

```javascript
/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Migration logic here
  pgm.createTable('table_name', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    // ... other columns
  });
};

exports.down = (pgm) => {
  // Rollback logic here
  pgm.dropTable('table_name', { cascade: true });
};
```

## 🗄️ Database Schema

### Core Entities

#### Organizations (Multi-tenant)

- Basic organization info
- Subscription management
- Multi-tenant configuration

#### Users

- Organization-based users
- Role and permission management
- Two-factor authentication support

#### Clients

- Master client data
- Contact information
- Communication history

### Business Entities

#### Projects

- Project management
- Client relationships
- Progress tracking

#### Quotations

- Quote generation
- Pricing calculations
- Approval workflow

#### Orders

- Order management
- Item tracking
- Status management

#### Tickets

- Support ticket system
- Message threading
- Assignment tracking

#### Invoices

- Invoice generation
- Payment tracking
- Financial management

### Supporting Systems

#### Services

- Service catalog
- Pricing management
- Category organization

#### Cost Calculations

- Resource rates
- Material costs
- Project cost tracking

#### Email & PDF

- Template management
- Campaign tracking
- Document generation

#### Subscriptions

- Plan management
- Usage tracking
- Billing integration

## 🔄 Migration Commands

### Basic Commands

```bash
# Run migrations
npx node-pg-migrate up

# Rollback migrations
npx node-pg-migrate down

# Check status
npx node-pg-migrate status

# Create new migration
npx node-pg-migrate create migration_name
```

### Advanced Commands

```bash
# Run specific number of migrations
npx node-pg-migrate up --count 5

# Rollback specific number
npx node-pg-migrate down --count 3

# Run to specific migration
npx node-pg-migrate up --to 20231201000000

# Rollback to specific migration
npx node-pg-migrate down --to 20231201000000

# Dry run (show what would be executed)
npx node-pg-migrate up --dry-run
```

## 📊 Migration Tracking

The system tracks migrations in the `pgmigrations` table:

- **Migration name**
- **Execution timestamp**
- **Success/failure status**
- **Execution duration**

## 🔐 Best Practices

### Migration Naming

- Use descriptive names
- Include table/feature name
- Follow chronological order

### Migration Structure

- Keep migrations atomic
- Include both up and down methods
- Test rollback functionality

### Data Integrity

- Use foreign key constraints
- Include proper indexes
- Handle data relationships

### Performance

- Add indexes for frequently queried columns
- Use appropriate data types
- Consider partitioning for large tables

## 🚨 Troubleshooting

### Common Issues

1. **Connection Failed**

   ```bash
   # Check database connection
   psql -h localhost -U postgres -d project_management
   ```

2. **Migration Failed**

   ```bash
   # Check migration status
   npx node-pg-migrate status

   # Check logs
   tail -f node-pg-migrate.log
   ```

3. **Rollback Issues**

   ```bash
   # Check migration history
   npx node-pg-migrate status

   # Manual rollback
   npx node-pg-migrate down --count 1
   ```

### Debug Mode

```bash
# Enable verbose logging
npx node-pg-migrate up --verbose

# Dry run to see what would happen
npx node-pg-migrate up --dry-run
```

## 📚 Additional Resources

- [node-pg-migrate Documentation](https://github.com/salsita/node-pg-migrate)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Database Migration Best Practices](https://www.prisma.io/dataguide/types/relational/best-practices-for-sql-migrations)

## 📞 Support

For migration issues:

1. Check the migration logs
2. Verify database connection
3. Review migration status
4. Test in development environment first
