-- Migration: 007_create_audit_logs_table.sql
-- Description: Create migration_audit_logs table for tracking all migration and seeding activities
-- Version: 1.0.0
-- Type: schema

CREATE TABLE IF NOT EXISTS migration_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  resource VARCHAR(50) NOT NULL,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_migration_audit_logs_user_id ON migration_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_migration_audit_logs_action ON migration_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_migration_audit_logs_resource ON migration_audit_logs(resource);
CREATE INDEX IF NOT EXISTS idx_migration_audit_logs_resource_id ON migration_audit_logs(resource_id);
CREATE INDEX IF NOT EXISTS idx_migration_audit_logs_created_at ON migration_audit_logs(created_at);
