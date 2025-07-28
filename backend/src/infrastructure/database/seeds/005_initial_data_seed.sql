-- Seed: 005_initial_data_seed.sql
-- Description: Initial data seed from schema.sql
-- Version: 1.0.0
-- Type: seed

-- Insert default organization
INSERT INTO organizations (id, name, slug, domain, subscription_plan, max_users, max_projects)
VALUES (
    uuid_generate_v4(),
    'Default Organization',
    'default',
    'localhost',
    'starter',
    5,
    10
);

-- Insert default service categories
INSERT INTO service_categories (organization_id, name, description)
SELECT
    o.id,
    'Web Development',
    'Custom web application development'
FROM organizations o WHERE o.slug = 'default'
UNION ALL
SELECT
    o.id,
    'Mobile Development',
    'Mobile application development'
FROM organizations o WHERE o.slug = 'default'
UNION ALL
SELECT
    o.id,
    'Consulting',
    'IT consulting services'
FROM organizations o WHERE o.slug = 'default';
