-- Migration: 001_create_migrations_table.sql
-- Description: Create migrations table for data migration management
-- Version: 1.0.0
-- Type: schema

CREATE TABLE IF NOT EXISTS migrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  version VARCHAR(20) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('schema', 'data', 'seed', 'rollback')),
  sql_up TEXT,
  sql_down TEXT,
  dependencies JSONB DEFAULT '[]',
  is_reversible BOOLEAN DEFAULT true,
  batch_size INTEGER DEFAULT 1000,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'rolled_back')),
  executed_at TIMESTAMP,
  executed_by UUID REFERENCES users(id),
  execution_duration INTEGER, -- in seconds
  execution_options JSONB,
  error_message TEXT,
  rollback_started_at TIMESTAMP,
  rollback_by UUID REFERENCES users(id),
  rollback_duration INTEGER, -- in seconds
  rollback_options JSONB,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_migrations_status ON migrations(status);
CREATE INDEX IF NOT EXISTS idx_migrations_version ON migrations(version);
CREATE INDEX IF NOT EXISTS idx_migrations_type ON migrations(type);
CREATE INDEX IF NOT EXISTS idx_migrations_created_at ON migrations(created_at);
CREATE INDEX IF NOT EXISTS idx_migrations_executed_at ON migrations(executed_at);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_migrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_migrations_updated_at
  BEFORE UPDATE ON migrations
  FOR EACH ROW
  EXECUTE FUNCTION update_migrations_updated_at();
