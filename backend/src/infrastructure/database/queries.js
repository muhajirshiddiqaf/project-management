// Database queries for all modules
const queries = {
  // Auth/User queries
  auth: {
    // Find user by email
    findUserByEmail: `
      SELECT u.*, o.name as organization_name, o.slug as organization_slug
      FROM users u
      JOIN organizations o ON u.organization_id = o.id
      WHERE u.email = $1 AND u.is_active = true AND o.is_active = true
    `,

    // Find user by ID
    findUserById: `
      SELECT u.*, o.name as organization_name, o.slug as organization_slug
      FROM users u
      JOIN organizations o ON u.organization_id = o.id
      WHERE u.id = $1 AND u.is_active = true
    `,

    // Check if email exists
    checkEmailExists: `
      SELECT id FROM users WHERE email = $1
    `,

    // Create user
    createUser: `
      INSERT INTO users (id, organization_id, email, password_hash, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email, first_name, last_name, role, organization_id
    `,

    // Update user last login
    updateLastLogin: `
      UPDATE users
      SET last_login_at = NOW()
      WHERE id = $1
    `,

    // Update user profile
    updateUserProfile: `
      UPDATE users
      SET first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          avatar_url = COALESCE($3, avatar_url),
          updated_at = NOW()
      WHERE id = $4
      RETURNING id, email, first_name, last_name, role, avatar_url
    `,

    // Update user password
    updateUserPassword: `
      UPDATE users
      SET password_hash = $1, updated_at = NOW()
      WHERE id = $2
    `,

    // Get user password hash
    getUserPasswordHash: `
      SELECT password_hash FROM users WHERE id = $1
    `,

    // Get user profile
    getUserProfile: `
      SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.permissions,
             u.avatar_url, u.two_factor_enabled, u.last_login_at,
             o.name as organization_name, o.slug as organization_slug
      FROM users u
      JOIN organizations o ON u.organization_id = o.id
      WHERE u.id = $1 AND u.is_active = true
    `
  },

  // Organization queries
  organization: {
    // Find organization by slug
    findOrganizationBySlug: `
      SELECT * FROM organizations WHERE slug = $1 AND is_active = true
    `,

    // Find organization by ID
    findOrganizationById: `
      SELECT * FROM organizations WHERE id = $1 AND is_active = true
    `,

    // Create organization
    createOrganization: `
      INSERT INTO organizations (id, name, slug, domain, subscription_plan, max_users, max_projects)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, slug
    `,

    // Update organization
    updateOrganization: `
      UPDATE organizations
      SET name = COALESCE($1, name),
          slug = COALESCE($2, slug),
          domain = COALESCE($3, domain),
          logo_url = COALESCE($4, logo_url),
          primary_color = COALESCE($5, primary_color),
          secondary_color = COALESCE($6, secondary_color),
          updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `,

    // Get organization users count
    getOrganizationUsersCount: `
      SELECT COUNT(*) as user_count
      FROM users
      WHERE organization_id = $1 AND is_active = true
    `,

    // Get organization projects count
    getOrganizationProjectsCount: `
      SELECT COUNT(*) as project_count
      FROM projects
      WHERE organization_id = $1 AND is_active = true
    `
  },

  // Project queries
  project: {
    // Find project by ID
    findProjectById: `
      SELECT p.*, c.name as client_name, c.email as client_email
      FROM projects p
      LEFT JOIN clients c ON p.client_id = c.id
      WHERE p.id = $1 AND p.organization_id = $2 AND p.is_active = true
    `,

    // Find projects by organization
    findProjectsByOrganization: `
      SELECT p.*, c.name as client_name, c.email as client_email
      FROM projects p
      LEFT JOIN clients c ON p.client_id = c.id
      WHERE p.organization_id = $1 AND p.is_active = true
      ORDER BY p.created_at DESC
    `,

    // Create project
    createProject: `
      INSERT INTO projects (id, organization_id, client_id, name, description, status,
                          start_date, end_date, budget, actual_cost, progress_percentage)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `,

    // Update project
    updateProject: `
      UPDATE projects
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          status = COALESCE($3, status),
          start_date = COALESCE($4, start_date),
          end_date = COALESCE($5, end_date),
          budget = COALESCE($6, budget),
          actual_cost = COALESCE($7, actual_cost),
          progress_percentage = COALESCE($8, progress_percentage),
          updated_at = NOW()
      WHERE id = $9 AND organization_id = $10
      RETURNING *
    `,

    // Delete project
    deleteProject: `
      UPDATE projects
      SET is_active = false, updated_at = NOW()
      WHERE id = $1 AND organization_id = $2
    `,

    // Get project statistics
    getProjectStatistics: `
      SELECT
        COUNT(*) as total_projects,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_projects,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_projects,
        COUNT(CASE WHEN status = 'on_hold' THEN 1 END) as on_hold_projects,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_projects,
        AVG(progress_percentage) as avg_progress,
        SUM(budget) as total_budget,
        SUM(actual_cost) as total_actual_cost
      FROM projects
      WHERE organization_id = $1 AND is_active = true
    `
  },

  // Quotation queries
  quotation: {
    // Find quotation by ID
    findQuotationById: `
      SELECT q.*, p.name as project_name, c.name as client_name
      FROM quotations q
      LEFT JOIN projects p ON q.project_id = p.id
      LEFT JOIN clients c ON q.client_id = c.id
      WHERE q.id = $1 AND q.organization_id = $2 AND q.is_active = true
    `,

    // Find quotations by organization
    findQuotationsByOrganization: `
      SELECT q.*, p.name as project_name, c.name as client_name
      FROM quotations q
      LEFT JOIN projects p ON q.project_id = p.id
      LEFT JOIN clients c ON q.client_id = c.id
      WHERE q.organization_id = $1 AND q.is_active = true
      ORDER BY q.created_at DESC
    `,

    // Create quotation
    createQuotation: `
      INSERT INTO quotations (id, organization_id, project_id, client_id, quotation_number,
                            title, description, total_amount, status, valid_until, terms_conditions)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `,

    // Update quotation
    updateQuotation: `
      UPDATE quotations
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          total_amount = COALESCE($3, total_amount),
          status = COALESCE($4, status),
          valid_until = COALESCE($5, valid_until),
          terms_conditions = COALESCE($6, terms_conditions),
          updated_at = NOW()
      WHERE id = $7 AND organization_id = $8
      RETURNING *
    `,

    // Delete quotation
    deleteQuotation: `
      UPDATE quotations
      SET is_active = false, updated_at = NOW()
      WHERE id = $1 AND organization_id = $2
    `,

    // Get quotation statistics
    getQuotationStatistics: `
      SELECT
        COUNT(*) as total_quotations,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_quotations,
        COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent_quotations,
        COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted_quotations,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_quotations,
        SUM(total_amount) as total_amount,
        AVG(total_amount) as avg_amount
      FROM quotations
      WHERE organization_id = $1 AND is_active = true
    `
  },

  // Client queries
  client: {
    // Find client by ID
    findClientById: `
      SELECT * FROM clients
      WHERE id = $1 AND organization_id = $2 AND is_active = true
    `,

    // Find clients by organization
    findClientsByOrganization: `
      SELECT * FROM clients
      WHERE organization_id = $1 AND is_active = true
      ORDER BY created_at DESC
    `,

    // Create client
    createClient: `
      INSERT INTO clients (id, organization_id, name, email, phone, address, company_name,
                         tax_id, website, notes, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `,

    // Update client
    updateClient: `
      UPDATE clients
      SET name = COALESCE($1, name),
          email = COALESCE($2, email),
          phone = COALESCE($3, phone),
          address = COALESCE($4, address),
          company_name = COALESCE($5, company_name),
          tax_id = COALESCE($6, tax_id),
          website = COALESCE($7, website),
          notes = COALESCE($8, notes),
          status = COALESCE($9, status),
          updated_at = NOW()
      WHERE id = $10 AND organization_id = $11
      RETURNING *
    `,

    // Delete client
    deleteClient: `
      UPDATE clients
      SET is_active = false, updated_at = NOW()
      WHERE id = $1 AND organization_id = $2
    `,

    // Get client statistics
    getClientStatistics: `
      SELECT
        COUNT(*) as total_clients,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_clients,
        COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_clients
      FROM clients
      WHERE organization_id = $1 AND is_active = true
    `
  },

  // Order queries
  order: {
    // Find order by ID
    findOrderById: `
      SELECT o.*, c.name as client_name, c.email as client_email
      FROM orders o
      LEFT JOIN clients c ON o.client_id = c.id
      WHERE o.id = $1 AND o.organization_id = $2 AND o.is_active = true
    `,

    // Find orders by organization
    findOrdersByOrganization: `
      SELECT o.*, c.name as client_name, c.email as client_email
      FROM orders o
      LEFT JOIN clients c ON o.client_id = c.id
      WHERE o.organization_id = $1 AND o.is_active = true
      ORDER BY o.created_at DESC
    `,

    // Create order
    createOrder: `
      INSERT INTO orders (id, organization_id, client_id, order_number, title, description,
                         total_amount, status, order_date, delivery_date, payment_terms)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `,

    // Update order
    updateOrder: `
      UPDATE orders
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          total_amount = COALESCE($3, total_amount),
          status = COALESCE($4, status),
          order_date = COALESCE($5, order_date),
          delivery_date = COALESCE($6, delivery_date),
          payment_terms = COALESCE($7, payment_terms),
          updated_at = NOW()
      WHERE id = $8 AND organization_id = $9
      RETURNING *
    `,

    // Delete order
    deleteOrder: `
      UPDATE orders
      SET is_active = false, updated_at = NOW()
      WHERE id = $1 AND organization_id = $2
    `,

    // Get order statistics
    getOrderStatistics: `
      SELECT
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_orders,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
        SUM(total_amount) as total_amount,
        AVG(total_amount) as avg_amount
      FROM orders
      WHERE organization_id = $1 AND is_active = true
    `
  },

  // Ticket queries
  ticket: {
    // Find ticket by ID
    findTicketById: `
      SELECT t.*, u.first_name, u.last_name, c.name as client_name
      FROM tickets t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN clients c ON t.client_id = c.id
      WHERE t.id = $1 AND t.organization_id = $2 AND t.is_active = true
    `,

    // Find tickets by organization
    findTicketsByOrganization: `
      SELECT t.*, u.first_name, u.last_name, c.name as client_name
      FROM tickets t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN clients c ON t.client_id = c.id
      WHERE t.organization_id = $1 AND t.is_active = true
      ORDER BY t.created_at DESC
    `,

    // Create ticket
    createTicket: `
      INSERT INTO tickets (id, organization_id, client_id, assigned_to, ticket_number,
                          title, description, priority, status, category, due_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `,

    // Update ticket
    updateTicket: `
      UPDATE tickets
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          priority = COALESCE($3, priority),
          status = COALESCE($4, status),
          category = COALESCE($5, category),
          assigned_to = COALESCE($6, assigned_to),
          due_date = COALESCE($7, due_date),
          updated_at = NOW()
      WHERE id = $8 AND organization_id = $9
      RETURNING *
    `,

    // Delete ticket
    deleteTicket: `
      UPDATE tickets
      SET is_active = false, updated_at = NOW()
      WHERE id = $1 AND organization_id = $2
    `,

    // Get ticket statistics
    getTicketStatistics: `
      SELECT
        COUNT(*) as total_tickets,
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open_tickets,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tickets,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_tickets,
        COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_tickets,
        COUNT(CASE WHEN priority = 'low' THEN 1 END) as low_priority_tickets,
        COUNT(CASE WHEN priority = 'medium' THEN 1 END) as medium_priority_tickets,
        COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority_tickets,
        COUNT(CASE WHEN priority = 'urgent' THEN 1 END) as urgent_tickets
      FROM tickets
      WHERE organization_id = $1 AND is_active = true
    `
  },

  // Invoice queries
  invoice: {
    // Find invoice by ID
    findInvoiceById: `
      SELECT i.*, c.name as client_name, c.email as client_email
      FROM invoices i
      LEFT JOIN clients c ON i.client_id = c.id
      WHERE i.id = $1 AND i.organization_id = $2 AND i.is_active = true
    `,

    // Find invoices by organization
    findInvoicesByOrganization: `
      SELECT i.*, c.name as client_name, c.email as client_email
      FROM invoices i
      LEFT JOIN clients c ON i.client_id = c.id
      WHERE i.organization_id = $1 AND i.is_active = true
      ORDER BY i.created_at DESC
    `,

    // Create invoice
    createInvoice: `
      INSERT INTO invoices (id, organization_id, client_id, invoice_number, title, description,
                          subtotal, tax_amount, total_amount, status, issue_date, due_date,
                          payment_terms, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `,

    // Update invoice
    updateInvoice: `
      UPDATE invoices
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          subtotal = COALESCE($3, subtotal),
          tax_amount = COALESCE($4, tax_amount),
          total_amount = COALESCE($5, total_amount),
          status = COALESCE($6, status),
          issue_date = COALESCE($7, issue_date),
          due_date = COALESCE($8, due_date),
          payment_terms = COALESCE($9, payment_terms),
          notes = COALESCE($10, notes),
          updated_at = NOW()
      WHERE id = $11 AND organization_id = $12
      RETURNING *
    `,

    // Delete invoice
    deleteInvoice: `
      UPDATE invoices
      SET is_active = false, updated_at = NOW()
      WHERE id = $1 AND organization_id = $2
    `,

    // Get invoice statistics
    getInvoiceStatistics: `
      SELECT
        COUNT(*) as total_invoices,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_invoices,
        COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent_invoices,
        COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_invoices,
        COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_invoices,
        SUM(total_amount) as total_amount,
        SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END) as paid_amount,
        SUM(CASE WHEN status = 'overdue' THEN total_amount ELSE 0 END) as overdue_amount
      FROM invoices
      WHERE organization_id = $1 AND is_active = true
    `
  },

  // Service queries
  service: {
    // Find service by ID
    findServiceById: `
      SELECT * FROM services
      WHERE id = $1 AND organization_id = $2 AND is_active = true
    `,

    // Find services by organization
    findServicesByOrganization: `
      SELECT * FROM services
      WHERE organization_id = $1 AND is_active = true
      ORDER BY created_at DESC
    `,

    // Create service
    createService: `
      INSERT INTO services (id, organization_id, name, description, category, unit_price,
                          unit_type, is_active, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `,

    // Update service
    updateService: `
      UPDATE services
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          category = COALESCE($3, category),
          unit_price = COALESCE($4, unit_price),
          unit_type = COALESCE($5, unit_type),
          is_active = COALESCE($6, is_active),
          notes = COALESCE($7, notes),
          updated_at = NOW()
      WHERE id = $8 AND organization_id = $9
      RETURNING *
    `,

    // Delete service
    deleteService: `
      UPDATE services
      SET is_active = false, updated_at = NOW()
      WHERE id = $1 AND organization_id = $2
    `,

    // Get service statistics
    getServiceStatistics: `
      SELECT
        COUNT(*) as total_services,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_services,
        COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_services,
        AVG(unit_price) as avg_unit_price
      FROM services
      WHERE organization_id = $1
    `
  }
};

module.exports = queries;
