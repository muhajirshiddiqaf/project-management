-- Seed: 002_initial_seeds_data.sql
-- Description: Initial seed data for seeds table
-- Version: 1.0.0
-- Type: seed

-- Insert sample seeds for testing
INSERT INTO seeds (
  name,
  description,
  table_name,
  data,
  conditions,
  update_existing,
  batch_size,
  dependencies,
  status,
  created_by
) VALUES
(
  'Default User Roles',
  'Seed data for default user roles (admin, manager, user)',
  'roles',
  '[
    {"name": "admin", "description": "Administrator with full access", "permissions": ["*"]},
    {"name": "manager", "description": "Manager with project and team access", "permissions": ["project:*", "team:*", "quotation:read"]},
    {"name": "user", "description": "Regular user with basic access", "permissions": ["project:read", "quotation:read"]}
  ]',
  '{"active": true}',
  false,
  1000,
  '[]',
  'completed',
  (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1)
),
(
  'Default Service Categories',
  'Seed data for default service categories',
  'service_categories',
  '[
    {"name": "Web Development", "description": "Website and web application development", "is_active": true},
    {"name": "Mobile Development", "description": "Mobile application development", "is_active": true},
    {"name": "UI/UX Design", "description": "User interface and user experience design", "is_active": true},
    {"name": "Consulting", "description": "IT consulting and advisory services", "is_active": true},
    {"name": "Maintenance", "description": "System maintenance and support", "is_active": true}
  ]',
  '{"is_active": true}',
  false,
  1000,
  '[]',
  'completed',
  (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1)
),
(
  'Default Project Statuses',
  'Seed data for default project statuses',
  'project_statuses',
  '[
    {"name": "Planning", "description": "Project is in planning phase", "color": "#3498db", "is_active": true},
    {"name": "In Progress", "description": "Project is currently being worked on", "color": "#f39c12", "is_active": true},
    {"name": "Review", "description": "Project is under review", "color": "#9b59b6", "is_active": true},
    {"name": "Completed", "description": "Project has been completed", "color": "#27ae60", "is_active": true},
    {"name": "On Hold", "description": "Project is temporarily on hold", "color": "#e74c3c", "is_active": true}
  ]',
  '{"is_active": true}',
  false,
  1000,
  '[]',
  'completed',
  (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1)
),
(
  'Default Quotation Statuses',
  'Seed data for default quotation statuses',
  'quotation_statuses',
  '[
    {"name": "Draft", "description": "Quotation is in draft state", "color": "#95a5a6", "is_active": true},
    {"name": "Sent", "description": "Quotation has been sent to client", "color": "#3498db", "is_active": true},
    {"name": "Under Review", "description": "Client is reviewing the quotation", "color": "#f39c12", "is_active": true},
    {"name": "Approved", "description": "Quotation has been approved", "color": "#27ae60", "is_active": true},
    {"name": "Rejected", "description": "Quotation has been rejected", "color": "#e74c3c", "is_active": true}
  ]',
  '{"is_active": true}',
  false,
  1000,
  '[]',
  'completed',
  (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1)
),
(
  'Default Invoice Statuses',
  'Seed data for default invoice statuses',
  'invoice_statuses',
  '[
    {"name": "Draft", "description": "Invoice is in draft state", "color": "#95a5a6", "is_active": true},
    {"name": "Sent", "description": "Invoice has been sent to client", "color": "#3498db", "is_active": true},
    {"name": "Viewed", "description": "Client has viewed the invoice", "color": "#9b59b6", "is_active": true},
    {"name": "Paid", "description": "Invoice has been paid", "color": "#27ae60", "is_active": true},
    {"name": "Overdue", "description": "Invoice payment is overdue", "color": "#e74c3c", "is_active": true}
  ]',
  '{"is_active": true}',
  false,
  1000,
  '[]',
  'pending',
  (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1)
);
