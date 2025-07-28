-- Migration: 005_create_migration_history_table.sql
-- Description: Create migration_history table for tracking migration execution history
-- Version: 1.0.0
-- Type: schema

CREATE TABLE IF NOT EXISTS migration_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  migration_id UUID REFERENCES migrations(id),
  version VARCHAR(20) NOT NULL,
  type VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('completed', 'failed', 'rolled_back')),
  executed_at TIMESTAMP NOT NULL,
  executed_by UUID REFERENCES users(id),
  execution_duration INTEGER, -- in seconds
  execution_options JSONB,
  error_message TEXT,
  rollback_at TIMESTAMP,
  rollback_by UUID REFERENCES users(id),
  rollback_duration INTEGER, -- in seconds
  rollback_options JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_migration_history_migration_id ON migration_history(migration_id);
CREATE INDEX IF NOT EXISTS idx_migration_history_status ON migration_history(status);
CREATE INDEX IF NOT EXISTS idx_migration_history_executed_at ON migration_history(executed_at);
CREATE INDEX IF NOT EXISTS idx_migration_history_version ON migration_history(version);
CREATE INDEX IF NOT EXISTS idx_migration_history_type ON migration_history(type);
