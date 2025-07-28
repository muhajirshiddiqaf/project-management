-- Migration: 003_create_migration_versions_table.sql
-- Description: Create migration_versions table for versioning system
-- Version: 1.0.0
-- Type: schema

CREATE TABLE IF NOT EXISTS migration_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version VARCHAR(20) NOT NULL UNIQUE,
  description TEXT,
  release_notes TEXT,
  is_major BOOLEAN DEFAULT false,
  is_breaking BOOLEAN DEFAULT false,
  dependencies JSONB DEFAULT '[]',
  migrations JSONB DEFAULT '[]',
  seeds JSONB DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_migration_versions_version ON migration_versions(version);
CREATE INDEX IF NOT EXISTS idx_migration_versions_status ON migration_versions(status);
CREATE INDEX IF NOT EXISTS idx_migration_versions_created_at ON migration_versions(created_at);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_migration_versions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_migration_versions_updated_at
  BEFORE UPDATE ON migration_versions
  FOR EACH ROW
  EXECUTE FUNCTION update_migration_versions_updated_at();
