-- Seed: 003_initial_versions_data.sql
-- Description: Initial seed data for migration_versions table
-- Version: 1.0.0
-- Type: seed

-- Insert sample migration versions for testing
INSERT INTO migration_versions (
  version,
  description,
  release_notes,
  is_major,
  is_breaking,
  dependencies,
  migrations,
  seeds,
  status,
  created_by
) VALUES
(
  '1.0.0',
  'Initial release with basic user and organization management',
  '## Version 1.0.0 - Initial Release

### Features
- User authentication and authorization
- Multi-tenant organization support
- Basic user management
- Role-based access control

### Database Changes
- Created users table
- Created organizations table
- Added organization_id to users table

### Breaking Changes
- None

### Migration Notes
- This is the initial release
- All existing data will be preserved',
  true,
  false,
  '[]',
  '["001_create_users_table", "002_create_organizations_table", "003_add_organization_id_to_users"]',
  '["001_default_user_roles", "002_default_service_categories"]',
  'completed',
  (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1)
),
(
  '1.1.0',
  'Project and quotation management features',
  '## Version 1.1.0 - Project Management

### Features
- Project creation and management
- Quotation generation from projects
- Project status tracking
- Team assignment to projects

### Database Changes
- Created projects table
- Created quotations table
- Added project statuses
- Added quotation statuses

### Breaking Changes
- None

### Migration Notes
- New features are backward compatible
- Existing users and organizations remain unchanged',
  false,
  false,
  '["1.0.0"]',
  '["004_create_projects_table", "005_create_quotations_table"]',
  '["003_default_project_statuses", "004_default_quotation_statuses"]',
  'pending',
  (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1)
),
(
  '1.2.0',
  'Invoice and payment management',
  '## Version 1.2.0 - Invoice Management

### Features
- Invoice generation from quotations
- Payment tracking and management
- Invoice status management
- Payment gateway integration

### Database Changes
- Created invoices table
- Created payments table
- Added invoice statuses
- Added payment methods

### Breaking Changes
- None

### Migration Notes
- New invoice features are optional
- Existing quotations remain unchanged',
  false,
  false,
  '["1.1.0"]',
  '["006_create_invoices_table", "007_create_payments_table"]',
  '["005_default_invoice_statuses"]',
  'pending',
  (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1)
),
(
  '2.0.0',
  'Major update with advanced features',
  '## Version 2.0.0 - Advanced Features

### Features
- Advanced reporting and analytics
- Real-time notifications
- API rate limiting
- Enhanced security features

### Database Changes
- Added analytics tables
- Enhanced audit logging
- Improved performance indexes

### Breaking Changes
- Some API endpoints have changed
- New authentication requirements

### Migration Notes
- **IMPORTANT**: Backup your data before upgrading
- Review API documentation for changes
- Update client applications accordingly',
  true,
  true,
  '["1.2.0"]',
  '["008_create_analytics_tables", "009_enhance_audit_logging"]',
  '["006_analytics_initial_data"]',
  'pending',
  (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1)
);
