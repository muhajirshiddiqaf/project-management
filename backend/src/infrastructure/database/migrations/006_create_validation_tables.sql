-- Migration: 006_create_validation_tables.sql
-- Description: Create validation and testing tables for migrations and seeds
-- Version: 1.0.0
-- Type: schema

-- Migration validations table
CREATE TABLE IF NOT EXISTS migration_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  migration_id UUID REFERENCES migrations(id),
  check_syntax BOOLEAN DEFAULT true,
  check_dependencies BOOLEAN DEFAULT true,
  check_conflicts BOOLEAN DEFAULT true,
  dry_run BOOLEAN DEFAULT true,
  status VARCHAR(20) DEFAULT 'validating' CHECK (status IN ('validating', 'passed', 'failed')),
  validation_result JSONB,
  error_message TEXT,
  validated_by UUID REFERENCES users(id),
  validated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed validations table
CREATE TABLE IF NOT EXISTS seed_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seed_id UUID REFERENCES seeds(id),
  check_schema BOOLEAN DEFAULT true,
  check_constraints BOOLEAN DEFAULT true,
  check_data_types BOOLEAN DEFAULT true,
  dry_run BOOLEAN DEFAULT true,
  status VARCHAR(20) DEFAULT 'validating' CHECK (status IN ('validating', 'passed', 'failed')),
  validation_result JSONB,
  error_message TEXT,
  validated_by UUID REFERENCES users(id),
  validated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Migration tests table
CREATE TABLE IF NOT EXISTS migration_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  migration_id UUID REFERENCES migrations(id),
  test_environment VARCHAR(20) DEFAULT 'development' CHECK (test_environment IN ('development', 'staging', 'production')),
  backup_before_test BOOLEAN DEFAULT true,
  restore_after_test BOOLEAN DEFAULT true,
  timeout_seconds INTEGER DEFAULT 300,
  status VARCHAR(20) DEFAULT 'testing' CHECK (status IN ('testing', 'passed', 'failed')),
  test_result JSONB,
  error_message TEXT,
  tested_by UUID REFERENCES users(id),
  tested_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed tests table
CREATE TABLE IF NOT EXISTS seed_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seed_id UUID REFERENCES seeds(id),
  test_environment VARCHAR(20) DEFAULT 'development' CHECK (test_environment IN ('development', 'staging', 'production')),
  backup_before_test BOOLEAN DEFAULT true,
  restore_after_test BOOLEAN DEFAULT true,
  timeout_seconds INTEGER DEFAULT 300,
  status VARCHAR(20) DEFAULT 'testing' CHECK (status IN ('testing', 'passed', 'failed')),
  test_result JSONB,
  error_message TEXT,
  tested_by UUID REFERENCES users(id),
  tested_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_migration_validations_migration_id ON migration_validations(migration_id);
CREATE INDEX IF NOT EXISTS idx_migration_validations_status ON migration_validations(status);
CREATE INDEX IF NOT EXISTS idx_migration_validations_validated_at ON migration_validations(validated_at);

CREATE INDEX IF NOT EXISTS idx_seed_validations_seed_id ON seed_validations(seed_id);
CREATE INDEX IF NOT EXISTS idx_seed_validations_status ON seed_validations(status);
CREATE INDEX IF NOT EXISTS idx_seed_validations_validated_at ON seed_validations(validated_at);

CREATE INDEX IF NOT EXISTS idx_migration_tests_migration_id ON migration_tests(migration_id);
CREATE INDEX IF NOT EXISTS idx_migration_tests_status ON migration_tests(status);
CREATE INDEX IF NOT EXISTS idx_migration_tests_tested_at ON migration_tests(tested_at);

CREATE INDEX IF NOT EXISTS idx_seed_tests_seed_id ON seed_tests(seed_id);
CREATE INDEX IF NOT EXISTS idx_seed_tests_status ON seed_tests(status);
CREATE INDEX IF NOT EXISTS idx_seed_tests_tested_at ON seed_tests(tested_at);
