-- Migration: 004_create_dependencies_table.sql
-- Description: Create dependencies table for dependency management
-- Version: 1.0.0
-- Type: schema

CREATE TABLE IF NOT EXISTS dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL,
  source_type VARCHAR(20) NOT NULL CHECK (source_type IN ('migration', 'seed', 'version')),
  target_id UUID NOT NULL,
  target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('migration', 'seed', 'version')),
  dependency_type VARCHAR(20) DEFAULT 'required' CHECK (dependency_type IN ('required', 'optional', 'conflicts')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(source_id, source_type, target_id, target_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dependencies_source ON dependencies(source_id, source_type);
CREATE INDEX IF NOT EXISTS idx_dependencies_target ON dependencies(target_id, target_type);
CREATE INDEX IF NOT EXISTS idx_dependencies_type ON dependencies(dependency_type);
CREATE INDEX IF NOT EXISTS idx_dependencies_created_at ON dependencies(created_at);
