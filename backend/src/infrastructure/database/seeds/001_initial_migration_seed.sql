-- Seed: 001_initial_migration_seed.sql
-- Description: Initial seed data for migrations table
-- Version: 1.0.0
-- Type: seed

-- Insert sample migrations for testing
INSERT INTO migrations (
  name,
  description,
  version,
  type,
  sql_up,
  sql_down,
  dependencies,
  is_reversible,
  batch_size,
  status,
  created_by
) VALUES
(
  'Create Users Table',
  'Initial migration to create users table with basic authentication fields',
  '1.0.0',
  'schema',
  'CREATE TABLE users (id UUID PRIMARY KEY, name VARCHAR(255), email VARCHAR(255) UNIQUE, password VARCHAR(255), created_at TIMESTAMP DEFAULT NOW())',
  'DROP TABLE users',
  '[]',
  true,
  1000,
  'completed',
  (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1)
),
(
  'Create Organizations Table',
  'Migration to create organizations table for multi-tenant support',
  '1.0.0',
  'schema',
  'CREATE TABLE organizations (id UUID PRIMARY KEY, name VARCHAR(255), slug VARCHAR(255) UNIQUE, created_at TIMESTAMP DEFAULT NOW())',
  'DROP TABLE organizations',
  '[]',
  true,
  1000,
  'completed',
  (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1)
),
(
  'Add Organization ID to Users',
  'Migration to add organization_id foreign key to users table',
  '1.0.1',
  'schema',
  'ALTER TABLE users ADD COLUMN organization_id UUID REFERENCES organizations(id)',
  'ALTER TABLE users DROP COLUMN organization_id',
  '["001_create_users_table", "002_create_organizations_table"]',
  true,
  1000,
  'completed',
  (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1)
),
(
  'Create Projects Table',
  'Migration to create projects table for project management',
  '1.1.0',
  'schema',
  'CREATE TABLE projects (id UUID PRIMARY KEY, name VARCHAR(255), description TEXT, organization_id UUID REFERENCES organizations(id), created_at TIMESTAMP DEFAULT NOW())',
  'DROP TABLE projects',
  '["001_create_users_table", "002_create_organizations_table"]',
  true,
  1000,
  'pending',
  (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1)
),
(
  'Create Quotations Table',
  'Migration to create quotations table for quotation management',
  '1.1.0',
  'schema',
  'CREATE TABLE quotations (id UUID PRIMARY KEY, project_id UUID REFERENCES projects(id), amount DECIMAL(10,2), status VARCHAR(50), created_at TIMESTAMP DEFAULT NOW())',
  'DROP TABLE quotations',
  '["004_create_projects_table"]',
  true,
  1000,
  'pending',
  (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1)
);
