-- Migration: 002_create_seeds_table.sql
-- Description: Create seeds table for data seeding operations
-- Version: 1.0.0
-- Type: schema

CREATE TABLE IF NOT EXISTS seeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  table_name VARCHAR(100) NOT NULL,
  data JSONB NOT NULL,
  conditions JSONB,
  update_existing BOOLEAN DEFAULT false,
  batch_size INTEGER DEFAULT 1000,
  dependencies JSONB DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  executed_at TIMESTAMP,
  executed_by UUID REFERENCES users(id),
  execution_duration INTEGER, -- in seconds
  execution_options JSONB,
  error_message TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_seeds_status ON seeds(status);
CREATE INDEX IF NOT EXISTS idx_seeds_table_name ON seeds(table_name);
CREATE INDEX IF NOT EXISTS idx_seeds_created_at ON seeds(created_at);
CREATE INDEX IF NOT EXISTS idx_seeds_executed_at ON seeds(executed_at);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_seeds_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_seeds_updated_at
  BEFORE UPDATE ON seeds
  FOR EACH ROW
  EXECUTE FUNCTION update_seeds_updated_at();
