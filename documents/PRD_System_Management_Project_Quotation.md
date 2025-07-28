# Product Requirements Document (PRD)
## SaaS Sistem Management Project dan Quotation

### 1. Overview
Sistem management project dan quotation adalah aplikasi SaaS (Software as a Service) yang dirancang untuk mengelola proyek, quotation, dan workflow bisnis secara terintegrasi dengan dukungan multi-tenancy. Aplikasi ini dapat digunakan oleh berbagai perusahaan/organisasi secara bersamaan dengan isolasi data yang aman.

### 2. Tech Stack
- **Frontend**: React.js dengan SaaS UI Pro
- **Backend**: Node.js dengan Express.js
- **Database**: PostgreSQL dengan multi-tenancy
- **Containerization**: Docker
- **Authentication**: JWT dengan multi-tenant support
- **File Storage**: AWS S3 dengan tenant isolation
- **Payment Processing**: Stripe
- **Email Service**: SendGrid/AWS SES
- **Monitoring**: DataDog/New Relic
- **CDN**: CloudFlare/AWS CloudFront

### 3. Fitur Utama

#### 3.1 Multi-Tenancy & Organization Management
- Multi-tenant architecture dengan tenant isolation
- Organization/Company registration dan setup
- Tenant-specific configuration
- Data isolation per tenant
- Custom branding per organization
- White-label support

#### 3.2 Subscription & Billing Management
- Multiple subscription plans (Starter, Professional, Enterprise)
- Usage-based billing
- Payment processing dengan Stripe
- Invoice generation
- Subscription lifecycle management
- Usage tracking dan limits
- Plan upgrade/downgrade
- Trial period management

#### 3.3 Manajemen User & Team
- Multi-role user management (Super Admin, Admin, Manager, Staff)
- Organization-based user management
- Team creation dan assignment
- User invitation system
- SSO integration (Google, Microsoft)
- Two-factor authentication (2FA)
- Profile management dengan tenant-specific settings

#### 3.4 Master Client Management
- **Independent Client Database**: Client terpisah dari users, tidak wajib memiliki user account
- **Client Profile Management**: Complete client information (name, email, phone, address, company)
- **Client Categories**: Categorize clients (VIP, Regular, Prospect, etc.)
- **Client Status Tracking**: Active, Inactive, Prospect, Converted
- **Client Communication History**: Track semua komunikasi dengan client
- **Client Import/Export**: Bulk import client data dari Excel/CSV
- **Client Search & Filtering**: Advanced search dengan multiple criteria
- **Client Analytics**: Client performance dan engagement metrics

#### 3.5 Manajemen Project
- CRUD Project dengan tenant isolation
- Project status tracking (Draft, Active, Completed, Cancelled)
- Project timeline dan milestones
- File attachment untuk project dengan tenant isolation
- Project team assignment
- Project budget tracking
- Project templates
- Project categories dan tags
- Advanced project filtering dan search
- **Project Cost Calculator** - Sistem perhitungan harga project berdasarkan:
  - Jenis layanan dan kompleksitas
  - Estimasi waktu pengerjaan
  - Rate per jam/jenis resource
  - Material dan overhead costs
  - Profit margin
  - Tax calculation
  - Discount management

#### 3.6 Manajemen Quotation
- CRUD Quotation dengan tenant isolation
- Quotation status (Draft, Sent, Approved, Rejected)
- Custom quotation templates per tenant
- **Advanced PDF Generation** dengan tenant branding:
  - Professional PDF quotation dengan custom branding
  - Multiple PDF templates (modern, classic, corporate)
  - Dynamic content insertion (client info, project details, pricing)
  - Digital signature support
  - PDF password protection
  - PDF compression dan optimization
  - Batch PDF generation
- **Email notification dengan tenant customization**:
  - Automated email sending untuk quotation
  - Email tracking dan delivery status
  - Email templates dengan dynamic content
  - Bulk email sending
  - Email scheduling
  - Email analytics dan open rates
- Quotation approval workflow
- Quotation versioning
- Bulk quotation operations
- **Auto-Generated Quotation** dari Project Cost Calculator:
  - Generate quotation otomatis dari hasil perhitungan project
  - Breakdown detail biaya (materials, labor, overhead, profit)
  - Multiple quotation options (basic, standard, premium)
  - Validity period management
  - Revision tracking dan comparison

#### 3.7 Dashboard & Analytics
- Multi-tenant dashboard
- Project overview dashboard
- Quotation statistics
- Revenue tracking per tenant
- Performance metrics
- Custom reports dengan tenant isolation
- Export functionality (PDF, Excel, CSV)
- Real-time analytics
- **Cost Analysis Dashboard**:
  - Project cost breakdown analysis
  - Profit margin tracking
  - Cost vs budget comparison
  - Historical pricing trends
  - Competitive pricing analysis
- **Client Analytics Dashboard**:
  - Client performance metrics
  - Client engagement tracking
  - Client revenue analysis
  - Client communication history

#### 3.8 Notifications & Communication
- Email notifications dengan tenant branding
- In-app notifications
- Real-time updates
- Push notifications
- Custom notification preferences
- Email templates per tenant
- **Advanced Email System**:
  - Automated email sending untuk quotation
  - Email tracking dan delivery status
  - Email templates dengan dynamic content
  - Bulk email sending
  - Email scheduling
  - Email analytics dan open rates
  - Email signature customization per tenant

#### 3.9 API & Integrations
- RESTful API dengan tenant isolation
- Webhook support
- Third-party integrations (Slack, Teams, Zapier)
- API rate limiting per tenant
- API documentation dengan tenant-specific examples
- **Pricing Engine Integration**:
  - Integration dengan external pricing databases
  - Real-time material cost updates
  - Currency conversion APIs
  - Tax calculation APIs

### 4. Database Schema

#### 4.1 Organizations Table (Tenants)
```sql
CREATE TABLE organizations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  domain VARCHAR(255),
  logo_url VARCHAR(500),
  primary_color VARCHAR(7),
  secondary_color VARCHAR(7),
  subscription_plan VARCHAR(50) NOT NULL,
  subscription_status VARCHAR(50) NOT NULL,
  trial_ends_at TIMESTAMP,
  subscription_ends_at TIMESTAMP,
  max_users INTEGER DEFAULT 10,
  max_projects INTEGER DEFAULT 50,
  max_storage_gb INTEGER DEFAULT 5,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.2 Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP,
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organization_id, email)
);
```

#### 4.3 Clients Table
```sql
CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  client_code VARCHAR(50) UNIQUE NOT NULL, -- Auto-generated client code
  company_name VARCHAR(255),
  contact_person VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  mobile VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  website VARCHAR(255),
  industry VARCHAR(100),
  client_category VARCHAR(50) DEFAULT 'regular', -- 'vip', 'regular', 'prospect'
  client_status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'prospect', 'converted'
  source VARCHAR(100), -- How client was acquired
  notes TEXT,
  tags TEXT[], -- Array of tags for categorization
  total_revenue DECIMAL(15,2) DEFAULT 0.00,
  total_projects INTEGER DEFAULT 0,
  last_contact_date TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.4 Client Contacts Table
```sql
CREATE TABLE client_contacts (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  client_id INTEGER REFERENCES clients(id),
  contact_name VARCHAR(255) NOT NULL,
  position VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  mobile VARCHAR(50),
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.5 Client Communication History Table
```sql
CREATE TABLE client_communications (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  client_id INTEGER REFERENCES clients(id),
  communication_type VARCHAR(50) NOT NULL, -- 'email', 'call', 'meeting', 'quotation_sent'
  subject VARCHAR(255),
  message TEXT,
  communication_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  next_follow_up_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'completed', -- 'completed', 'pending', 'scheduled'
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.6 Projects Table
```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL,
  start_date DATE,
  end_date DATE,
  budget DECIMAL(10,2),
  client_id INTEGER REFERENCES clients(id), -- Changed from users to clients
  manager_id INTEGER REFERENCES users(id),
  category VARCHAR(100),
  tags TEXT[],
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.7 Quotations Table
```sql
CREATE TABLE quotations (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  project_id INTEGER REFERENCES projects(id),
  client_id INTEGER REFERENCES clients(id), -- Changed from users to clients
  title VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) NOT NULL,
  valid_until DATE,
  version INTEGER DEFAULT 1,
  template_id INTEGER,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.5 Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  plan_name VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.6 Usage Tracking Table
```sql
CREATE TABLE usage_tracking (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  metric_name VARCHAR(100) NOT NULL,
  metric_value INTEGER NOT NULL,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.7 Service Categories Table
```sql
CREATE TABLE service_categories (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  base_rate DECIMAL(10,2) NOT NULL,
  complexity_multiplier DECIMAL(3,2) DEFAULT 1.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.8 Resource Rates Table
```sql
CREATE TABLE resource_rates (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  resource_type VARCHAR(100) NOT NULL, -- 'developer', 'designer', 'manager', etc.
  hourly_rate DECIMAL(10,2) NOT NULL,
  daily_rate DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.9 Materials Table
```sql
CREATE TABLE materials (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  unit VARCHAR(50) NOT NULL, -- 'piece', 'meter', 'kg', etc.
  unit_price DECIMAL(10,2) NOT NULL,
  supplier VARCHAR(255),
  currency VARCHAR(3) DEFAULT 'USD',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.10 Project Cost Calculations Table
```sql
CREATE TABLE project_cost_calculations (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  project_id INTEGER REFERENCES projects(id),
  calculation_name VARCHAR(255) NOT NULL,
  labor_cost DECIMAL(10,2) NOT NULL,
  materials_cost DECIMAL(10,2) NOT NULL,
  overhead_cost DECIMAL(10,2) NOT NULL,
  profit_margin DECIMAL(5,2) NOT NULL, -- percentage
  tax_rate DECIMAL(5,2) DEFAULT 0.00,
  discount_percentage DECIMAL(5,2) DEFAULT 0.00,
  total_cost DECIMAL(10,2) NOT NULL,
  final_price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  calculation_details JSONB,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.11 Project Tasks Table
```sql
CREATE TABLE project_tasks (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  project_id INTEGER REFERENCES projects(id),
  task_name VARCHAR(255) NOT NULL,
  description TEXT,
  service_category_id INTEGER REFERENCES service_categories(id),
  estimated_hours DECIMAL(5,2) NOT NULL,
  assigned_resource_type VARCHAR(100),
  hourly_rate DECIMAL(10,2),
  task_cost DECIMAL(10,2),
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.12 Project Materials Table
```sql
CREATE TABLE project_materials (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  project_id INTEGER REFERENCES projects(id),
  material_id INTEGER REFERENCES materials(id),
  quantity DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_cost DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.13 Email Templates Table
```sql
CREATE TABLE email_templates (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  template_name VARCHAR(255) NOT NULL,
  template_type VARCHAR(100) NOT NULL, -- 'quotation', 'invoice', 'notification'
  subject VARCHAR(500) NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  variables JSONB DEFAULT '{}', -- Dynamic variables like {{client_name}}, {{quotation_amount}}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.14 Email Campaigns Table
```sql
CREATE TABLE email_campaigns (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  campaign_name VARCHAR(255) NOT NULL,
  template_id INTEGER REFERENCES email_templates(id),
  subject VARCHAR(500) NOT NULL,
  recipient_list JSONB, -- Array of email addresses
  scheduled_at TIMESTAMP,
  sent_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'scheduled', 'sending', 'sent', 'failed'
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.15 Email Tracking Table
```sql
CREATE TABLE email_tracking (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  campaign_id INTEGER REFERENCES email_campaigns(id),
  quotation_id INTEGER REFERENCES quotations(id),
  recipient_email VARCHAR(255) NOT NULL,
  email_type VARCHAR(100) NOT NULL, -- 'quotation', 'invoice', 'notification'
  subject VARCHAR(500) NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delivered_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'sent', -- 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed'
  error_message TEXT,
  tracking_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.16 PDF Templates Table
```sql
CREATE TABLE pdf_templates (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  template_name VARCHAR(255) NOT NULL,
  template_type VARCHAR(100) NOT NULL, -- 'quotation', 'invoice', 'contract'
  template_file VARCHAR(500), -- Path to template file
  html_template TEXT, -- HTML template for PDF generation
  css_styles TEXT, -- Custom CSS styles
  variables JSONB DEFAULT '{}', -- Dynamic variables
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.17 Generated PDFs Table
```sql
CREATE TABLE generated_pdfs (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  quotation_id INTEGER REFERENCES quotations(id),
  template_id INTEGER REFERENCES pdf_templates(id),
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER, -- Size in bytes
  download_count INTEGER DEFAULT 0,
  is_password_protected BOOLEAN DEFAULT false,
  password_hash VARCHAR(255),
  generated_by INTEGER REFERENCES users(id),
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.18 Orders Table
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  order_id VARCHAR(50) UNIQUE NOT NULL, -- Auto-generated: ODR-000001
  client_id INTEGER REFERENCES clients(id),
  order_title VARCHAR(255) NOT NULL,
  description TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
  payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'overdue'
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  due_date TIMESTAMP,
  completed_date TIMESTAMP,
  assigned_to INTEGER REFERENCES users(id),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.19 Order Items Table
```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  order_id INTEGER REFERENCES orders(id),
  service_id INTEGER, -- Reference to services table
  item_name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.20 Tickets Table
```sql
CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  ticket_id VARCHAR(50) UNIQUE NOT NULL, -- Auto-generated: ST000001
  client_id INTEGER REFERENCES clients(id),
  order_id INTEGER REFERENCES orders(id),
  subject VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  status VARCHAR(50) DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
  category VARCHAR(100),
  assigned_to INTEGER REFERENCES users(id),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP
);
```

#### 4.21 Ticket Messages Table
```sql
CREATE TABLE ticket_messages (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  ticket_id INTEGER REFERENCES tickets(id),
  user_id INTEGER REFERENCES users(id),
  message TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false, -- Internal notes vs client messages
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.22 Invoices Table
```sql
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  invoice_number VARCHAR(50) UNIQUE NOT NULL, -- Auto-generated: INV-000001
  client_id INTEGER REFERENCES clients(id),
  order_id INTEGER REFERENCES orders(id),
  quotation_id INTEGER REFERENCES quotations(id),
  invoice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  due_date TIMESTAMP,
  total_amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0.00,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  final_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'overdue', 'cancelled'
  payment_method VARCHAR(100),
  paid_date TIMESTAMP,
  notes TEXT,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.23 Services Table
```sql
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  service_name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  base_price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  is_active BOOLEAN DEFAULT true,
  service_template JSONB, -- Template configuration
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.24 Order Forms Table
```sql
CREATE TABLE order_forms (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  form_name VARCHAR(255) NOT NULL,
  form_description TEXT,
  form_config JSONB NOT NULL, -- Form fields configuration
  is_active BOOLEAN DEFAULT true,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.25 Form Submissions Table
```sql
CREATE TABLE form_submissions (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  form_id INTEGER REFERENCES order_forms(id),
  client_id INTEGER REFERENCES clients(id),
  submission_data JSONB NOT NULL, -- Form submission data
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processed', 'converted_to_order'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. API Endpoints

#### 5.1 Authentication & Organization
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Organization registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/2fa/enable` - Enable 2FA
- `POST /api/auth/2fa/verify` - Verify 2FA
- `POST /api/organizations` - Create organization
- `GET /api/organizations/:id` - Get organization details
- `PUT /api/organizations/:id` - Update organization

#### 5.2 User Management
- `GET /api/users` - List users (organization-scoped)
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user detail
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/invite` - Invite user to organization
- `POST /api/users/:id/activate` - Activate user
- `POST /api/users/:id/deactivate` - Deactivate user

#### 5.3 Client Management
- `GET /api/clients` - List clients (organization-scoped)
- `POST /api/clients` - Create client
- `GET /api/clients/:id` - Get client detail
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client
- `GET /api/clients/:id/contacts` - Get client contacts
- `POST /api/clients/:id/contacts` - Add client contact
- `PUT /api/clients/:id/contacts/:contact_id` - Update client contact
- `DELETE /api/clients/:id/contacts/:contact_id` - Delete client contact
- `GET /api/clients/:id/communications` - Get client communication history
- `POST /api/clients/:id/communications` - Add communication record
- `POST /api/clients/import` - Bulk import clients
- `GET /api/clients/export` - Export clients data
- `GET /api/clients/search` - Advanced client search

#### 5.4 Projects
- `GET /api/projects` - List projects (organization-scoped)
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project detail
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/team` - Get project team
- `POST /api/projects/:id/team` - Assign team to project

#### 5.5 Quotations
- `GET /api/quotations` - List quotations (organization-scoped)
- `POST /api/quotations` - Create quotation
- `GET /api/quotations/:id` - Get quotation detail
- `PUT /api/quotations/:id` - Update quotation
- `DELETE /api/quotations/:id` - Delete quotation
- `POST /api/quotations/:id/approve` - Approve quotation
- `POST /api/quotations/:id/reject` - Reject quotation
- `POST /api/quotations/:id/send` - Send quotation via email
- `GET /api/quotations/:id/pdf` - Generate PDF quotation
- `POST /api/quotations/:id/generate-pdf` - Generate PDF dengan custom template
- `GET /api/quotations/:id/download-pdf` - Download generated PDF
- `POST /api/quotations/:id/send-with-pdf` - Send quotation with PDF attachment
- `POST /api/quotations/generate-from-project/:project_id` - Generate quotation from project cost calculation

#### 5.6 Cost Calculation & Pricing
- `GET /api/service-categories` - List service categories
- `POST /api/service-categories` - Create service category
- `PUT /api/service-categories/:id` - Update service category
- `GET /api/resource-rates` - List resource rates
- `POST /api/resource-rates` - Create resource rate
- `PUT /api/resource-rates/:id` - Update resource rate
- `GET /api/materials` - List materials
- `POST /api/materials` - Create material
- `PUT /api/materials/:id` - Update material
- `POST /api/projects/:id/calculate-cost` - Calculate project cost
- `GET /api/projects/:id/cost-breakdown` - Get project cost breakdown
- `POST /api/projects/:id/tasks` - Add task to project
- `PUT /api/projects/:id/tasks/:task_id` - Update project task
- `POST /api/projects/:id/materials` - Add material to project
- `PUT /api/projects/:id/materials/:material_id` - Update project material

#### 5.7 Subscription & Billing
- `GET /api/subscriptions` - Get subscription details
- `POST /api/subscriptions` - Create subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `POST /api/subscriptions/:id/cancel` - Cancel subscription
- `GET /api/billing/invoices` - List invoices
- `GET /api/billing/usage` - Get usage metrics
- `POST /api/billing/upgrade` - Upgrade plan
- `POST /api/billing/downgrade` - Downgrade plan

#### 5.8 Analytics & Reports
- `GET /api/analytics/dashboard` - Dashboard metrics
- `GET /api/analytics/projects` - Project analytics
- `GET /api/analytics/quotations` - Quotation analytics
- `GET /api/analytics/revenue` - Revenue analytics
- `GET /api/analytics/cost-analysis` - Cost analysis
- `GET /api/analytics/profit-margins` - Profit margin analysis
- `GET /api/analytics/email-performance` - Email analytics
- `GET /api/analytics/pdf-downloads` - PDF download analytics
- `GET /api/analytics/client-performance` - Client analytics
- `GET /api/reports/export` - Export reports

#### 5.9 Email & PDF Management
- `GET /api/email-templates` - List email templates
- `POST /api/email-templates` - Create email template
- `PUT /api/email-templates/:id` - Update email template
- `DELETE /api/email-templates/:id` - Delete email template
- `GET /api/pdf-templates` - List PDF templates
- `POST /api/pdf-templates` - Create PDF template
- `PUT /api/pdf-templates/:id` - Update PDF template
- `DELETE /api/pdf-templates/:id` - Delete PDF template
- `POST /api/email/send` - Send single email
- `POST /api/email/send-bulk` - Send bulk emails
- `POST /api/email/schedule` - Schedule email
- `GET /api/email/tracking/:tracking_id` - Get email tracking info
- `GET /api/pdf/generated` - List generated PDFs
- `GET /api/pdf/:id/download` - Download PDF
- `POST /api/pdf/protect` - Password protect PDF

#### 5.10 Order Management
- `GET /api/orders` - List orders (organization-scoped)
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order detail
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order
- `POST /api/orders/:id/items` - Add item to order
- `PUT /api/orders/:id/items/:item_id` - Update order item
- `DELETE /api/orders/:id/items/:item_id` - Delete order item
- `POST /api/orders/:id/status` - Update order status
- `POST /api/orders/:id/assign` - Assign order to team member

#### 5.11 Ticket Management
- `GET /api/tickets` - List tickets (organization-scoped)
- `POST /api/tickets` - Create ticket
- `GET /api/tickets/:id` - Get ticket detail
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket
- `POST /api/tickets/:id/messages` - Add message to ticket
- `PUT /api/tickets/:id/status` - Update ticket status
- `POST /api/tickets/:id/assign` - Assign ticket to team member
- `POST /api/tickets/:id/priority` - Update ticket priority

#### 5.12 Invoice Management
- `GET /api/invoices` - List invoices (organization-scoped)
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/:id` - Get invoice detail
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `POST /api/invoices/:id/status` - Update invoice status
- `GET /api/invoices/:id/pdf` - Generate invoice PDF
- `POST /api/invoices/:id/send` - Send invoice via email

#### 5.13 Service Management
- `GET /api/services` - List services (organization-scoped)
- `POST /api/services` - Create service
- `GET /api/services/:id` - Get service detail
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service
- `GET /api/services/categories` - List service categories

#### 5.14 Order Forms Management
- `GET /api/order-forms` - List order forms (organization-scoped)
- `POST /api/order-forms` - Create order form
- `GET /api/order-forms/:id` - Get order form detail
- `PUT /api/order-forms/:id` - Update order form
- `DELETE /api/order-forms/:id` - Delete order form
- `POST /api/order-forms/:id/submit` - Submit form data
- `GET /api/order-forms/:id/submissions` - Get form submissions

### 6. Frontend Pages

#### 6.1 Authentication & Onboarding
- Login page dengan SSO support
- Organization registration page
- User invitation page
- Two-factor authentication setup
- Password reset page
- Email verification page

#### 6.2 Dashboard & Analytics
- **Main Dashboard**: Revenue overview, clients overview, recent orders, recent tickets
- **Revenue Analytics**: Monthly revenue tracking dengan charts
- **Client Analytics**: Client growth dan engagement metrics
- **Order Analytics**: Order status dan performance tracking
- **Ticket Analytics**: Support ticket management dan resolution

#### 6.3 MAIN Navigation
- **Dashboard**: Main dashboard dengan metrics overview
- **Clients**: Client management dan client list
- **Orders**: Order management dan order tracking
- **Tickets**: Support ticket management
- **Invoice**: Invoice generation dan management
- **Team Members**: Team management dan user roles

#### 6.4 SETUP Navigation
- **Services**: Service catalog dan service management
- **Order Forms**: Custom order form builder
- **Quotation**: Quotation management dan generation

#### 6.5 OTHERS Navigation
- **Settings**: System configuration dan preferences
- **Email Template**: Email template management
- **File Manager**: File storage dan management

#### 6.6 SUBSCRIPTION Navigation
- **My Subscription**: Subscription plan management

#### 6.7 Client Management
- **Client List page**: List semua clients dengan filtering dan search
- **Client Detail page**: Complete client information dan history
- **Create/Edit Client page**: Form untuk create dan edit client
- **Client Contacts page**: Manage multiple contacts per client
- **Client Communication page**: Track semua komunikasi dengan client
- **Client Import/Export page**: Bulk import dan export client data
- **Client Analytics page**: Client performance dan engagement metrics

#### 6.8 Order Management
- **Order List page**: List semua orders dengan status tracking
- **Order Detail page**: Complete order information
- **Create/Edit Order page**: Order creation dan editing
- **Order Status Tracking**: Real-time order status updates
- **Order History**: Complete order history dan timeline

#### 6.9 Ticket Management
- **Ticket List page**: List semua support tickets
- **Ticket Detail page**: Ticket information dan conversation
- **Create/Edit Ticket page**: Ticket creation dan editing
- **Ticket Priority Management**: Priority levels (High, Medium, Low)
- **Ticket Resolution Tracking**: Ticket status dan resolution time

#### 6.10 Invoice Management
- **Invoice List page**: List semua invoices
- **Invoice Detail page**: Invoice information dan payment status
- **Create/Edit Invoice page**: Invoice creation dan editing
- **Payment Status Tracking**: Pending, Paid, Overdue status
- **Invoice PDF Generation**: Professional invoice PDFs

#### 6.11 Team Management
- **Team Members List**: List semua team members
- **User Roles**: Role assignment dan permissions
- **Team Performance**: Team metrics dan performance tracking
- **User Activity**: User activity logs dan analytics

#### 6.12 Service Management
- **Service Catalog**: List semua services
- **Service Categories**: Service categorization
- **Service Pricing**: Service pricing management
- **Service Templates**: Service template creation

#### 6.13 Order Forms
- **Form Builder**: Custom order form creation
- **Form Templates**: Pre-built form templates
- **Form Analytics**: Form submission analytics
- **Form Integration**: Integration dengan quotation system

#### 6.14 Quotation Management
- **Quotation List page**: List semua quotations
- **Quotation Detail page**: Complete quotation information
- **Create/Edit Quotation page**: Quotation creation dan editing
- **Quotation Templates**: Template management
- **Quotation PDF Generation**: Professional PDF generation
- **Quotation Email Sending**: Automated email sending

#### 6.15 Settings & Configuration
- **System Settings**: General system configuration
- **Email Templates**: Email template management
- **File Manager**: File storage dan organization
- **User Profile**: Personal profile management
- **Notification Settings**: Notification preferences
- **Security Settings**: Security configuration

### 7. Security Requirements
- JWT authentication dengan multi-tenant support
- Role-based access control (RBAC) per organization
- Input validation dan sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting per tenant
- Data encryption at rest dan in transit
- Tenant isolation di database level
- Audit logging untuk semua operations
- Two-factor authentication (2FA)
- SSO integration dengan enterprise providers

### 8. Performance Requirements
- Page load time < 3 seconds
- API response time < 500ms
- Support 1000+ concurrent users
- 99.9% uptime
- Auto-scaling capability
- CDN integration untuk static assets
- Database connection pooling
- Caching strategy (Redis)
- Background job processing

### 9. SaaS-Specific Requirements
- Multi-tenant architecture
- Subscription management
- Usage tracking dan billing
- White-label support
- Custom branding per tenant
- API rate limiting per tenant
- Data export/import capabilities
- Backup dan disaster recovery
- Compliance (GDPR, SOC2, etc.)

### 10. Deployment & Infrastructure
- Docker containerization
- Kubernetes orchestration
- Environment-based configuration
- CI/CD pipeline dengan multi-environment
- Monitoring dan logging (DataDog/New Relic)
- Auto-scaling infrastructure
- Load balancing
- Database clustering
- CDN integration

### 11. Subscription Plans

#### Starter Plan ($29/month)
- Up to 5 users
- Up to 20 projects
- Basic reporting
- Email support
- 5GB storage

#### Professional Plan ($99/month)
- Up to 25 users
- Up to 100 projects
- Advanced analytics
- Priority support
- 25GB storage
- Custom branding
- API access

#### Enterprise Plan ($299/month)
- Unlimited users
- Unlimited projects
- Advanced reporting
- Dedicated support
- 100GB storage
- White-label solution
- SSO integration
- Custom integrations
- SLA guarantee

### 12. Cost Calculation Workflow

#### 12.1 Project Cost Calculation Process
1. **Project Setup**: User membuat project baru
2. **Service Selection**: Memilih jenis layanan dan kompleksitas
3. **Task Breakdown**: Menambahkan tasks dengan estimasi waktu
4. **Resource Assignment**: Menetapkan resource dan rate per jam
5. **Material Addition**: Menambahkan materials yang diperlukan
6. **Overhead Calculation**: Menghitung overhead costs
7. **Profit Margin**: Menetapkan profit margin
8. **Tax & Discount**: Menghitung tax dan discount
9. **Final Calculation**: Menghasilkan total cost dan final price
10. **Quotation Generation**: Generate quotation otomatis dari hasil calculation

### 13. Client Management Workflow

#### 13.1 Client Onboarding Process
1. **Client Registration**: Input basic client information
2. **Client Categorization**: Assign client category (VIP, Regular, Prospect)
3. **Contact Information**: Add primary dan secondary contacts
4. **Client Profile Completion**: Complete address, industry, source info
5. **Initial Communication**: Record first contact/meeting
6. **Follow-up Scheduling**: Schedule next follow-up
7. **Client Activation**: Activate client untuk project assignment

#### 13.2 Client Communication Process
1. **Communication Recording**: Record semua komunikasi (email, call, meeting)
2. **Follow-up Management**: Track dan schedule follow-ups
3. **Communication History**: Maintain complete communication timeline
4. **Client Engagement**: Monitor client engagement metrics
5. **Relationship Management**: Build dan maintain client relationships

### 14. Email & PDF Workflow

#### 14.1 Email Sending Process
1. **Template Selection**: Memilih email template yang sesuai
2. **Recipient Management**: Menambahkan recipient email addresses
3. **Content Customization**: Mengisi dynamic variables ({{client_name}}, {{quotation_amount}})
4. **Scheduling**: Set waktu pengiriman (immediate atau scheduled)
5. **Preview**: Preview email sebelum dikirim
6. **Sending**: Kirim email dengan tracking
7. **Tracking**: Monitor delivery status, open rates, click rates

#### 14.2 PDF Generation Process
1. **Template Selection**: Memilih PDF template (modern, classic, corporate)
2. **Content Population**: Auto-populate dengan data quotation
3. **Branding Customization**: Apply tenant branding (logo, colors, fonts)
4. **Digital Signature**: Add digital signature jika diperlukan
5. **Security Settings**: Set password protection jika diperlukan
6. **Generation**: Generate PDF dengan compression
7. **Download/Share**: Download PDF atau share via email

#### 14.3 Email Templates Variables
- `{{client_name}}` - Nama client
- `{{client_email}}` - Email client
- `{{quotation_number}}` - Nomor quotation
- `{{quotation_amount}}` - Total amount quotation
- `{{quotation_date}}` - Tanggal quotation
- `{{valid_until}}` - Valid until date
- `{{project_title}}` - Judul project
- `{{organization_name}}` - Nama organization
- `{{sender_name}}` - Nama pengirim
- `{{pdf_download_link}}` - Link download PDF

#### 14.4 PDF Templates Features
- **Modern Template**: Clean, professional design
- **Classic Template**: Traditional business format
- **Corporate Template**: Enterprise-level branding
- **Custom Branding**: Logo, colors, fonts per tenant
- **Dynamic Content**: Auto-populate client dan project info
- **Cost Breakdown**: Detailed cost breakdown table
- **Terms & Conditions**: Customizable terms section
- **Digital Signature**: Support digital signatures

#### 12.2 Cost Components
- **Labor Cost**: Rate per jam × estimasi waktu
- **Materials Cost**: Quantity × unit price
- **Overhead Cost**: Fixed percentage dari labor cost
- **Profit Margin**: Percentage dari total cost
- **Tax**: Percentage dari final price
- **Discount**: Percentage reduction dari final price

#### 12.3 Pricing Strategies
- **Cost-Plus Pricing**: Cost + profit margin
- **Value-Based Pricing**: Berdasarkan value yang diberikan
- **Competitive Pricing**: Berdasarkan market rate
- **Dynamic Pricing**: Berdasarkan demand dan availability

### 15. Future Enhancements
- Mobile app (iOS/Android)
- Advanced AI-powered analytics
- Integration dengan accounting software
- Multi-language support
- Advanced workflow automation
- Advanced reporting dengan custom dashboards
- Real-time collaboration features
- Advanced project templates
- Marketplace untuk integrations
- Advanced security features (SOC2 compliance)
- **AI-powered cost estimation**
- **Predictive pricing algorithms**
- **Automated supplier price updates**
- **Real-time currency conversion**
- **Advanced email automation**
- **AI-powered email content optimization**
- **Advanced PDF customization dengan drag-and-drop editor**
- **Electronic signature integration**
- **Email marketing automation**
- **Advanced PDF analytics dan tracking**
- **AI-powered client relationship management**
- **Predictive client behavior analysis**
- **Automated client communication workflows**
- **Advanced client segmentation dan targeting** 