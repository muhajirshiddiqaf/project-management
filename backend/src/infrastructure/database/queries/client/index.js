// Client module database queries
const clientQueries = {
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

  // Delete client (soft delete)
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
      COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_clients,
      COUNT(CASE WHEN status = 'prospect' THEN 1 END) as prospect_clients
    FROM clients
    WHERE organization_id = $1 AND is_active = true
  `,

  // Search clients
  searchClients: `
    SELECT * FROM clients
    WHERE organization_id = $1 AND is_active = true
    AND (
      LOWER(name) LIKE LOWER($2) OR
      LOWER(email) LIKE LOWER($2) OR
      LOWER(company_name) LIKE LOWER($2) OR
      LOWER(phone) LIKE LOWER($2)
    )
    ORDER BY created_at DESC
  `,

  // Get client with projects
  getClientWithProjects: `
    SELECT
      c.*,
      COUNT(p.id) as total_projects,
      COUNT(CASE WHEN p.status = 'active' THEN 1 END) as active_projects,
      COUNT(CASE WHEN p.status = 'completed' THEN 1 END) as completed_projects,
      SUM(p.budget) as total_budget,
      SUM(p.actual_cost) as total_actual_cost
    FROM clients c
    LEFT JOIN projects p ON c.id = p.client_id AND p.is_active = true
    WHERE c.id = $1 AND c.organization_id = $2 AND c.is_active = true
    GROUP BY c.id, c.name, c.email, c.phone, c.address, c.company_name, c.tax_id, c.website, c.notes, c.status, c.created_at, c.updated_at
  `,

  // Get client with quotations
  getClientWithQuotations: `
    SELECT
      c.*,
      COUNT(q.id) as total_quotations,
      COUNT(CASE WHEN q.status = 'sent' THEN 1 END) as sent_quotations,
      COUNT(CASE WHEN q.status = 'accepted' THEN 1 END) as accepted_quotations,
      COUNT(CASE WHEN q.status = 'rejected' THEN 1 END) as rejected_quotations,
      SUM(q.total_amount) as total_quotation_amount
    FROM clients c
    LEFT JOIN quotations q ON c.id = q.client_id AND q.is_active = true
    WHERE c.id = $1 AND c.organization_id = $2 AND c.is_active = true
    GROUP BY c.id, c.name, c.email, c.phone, c.address, c.company_name, c.tax_id, c.website, c.notes, c.status, c.created_at, c.updated_at
  `,

  // Get client contacts
  getClientContacts: `
    SELECT * FROM client_contacts
    WHERE client_id = $1 AND organization_id = $2 AND is_active = true
    ORDER BY is_primary DESC, created_at DESC
  `,

  // Create client contact
  createClientContact: `
    INSERT INTO client_contacts (id, organization_id, client_id, name, email, phone, position, is_primary)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `,

  // Update client contact
  updateClientContact: `
    UPDATE client_contacts
    SET name = COALESCE($1, name),
        email = COALESCE($2, email),
        phone = COALESCE($3, phone),
        position = COALESCE($4, position),
        is_primary = COALESCE($5, is_primary),
        updated_at = NOW()
    WHERE id = $6 AND organization_id = $7
    RETURNING *
  `,

  // Delete client contact
  deleteClientContact: `
    UPDATE client_contacts
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2
  `,

  // Get client communications
  getClientCommunications: `
    SELECT * FROM client_communications
    WHERE client_id = $1 AND organization_id = $2 AND is_active = true
    ORDER BY communication_date DESC
  `,

  // Create client communication
  createClientCommunication: `
    INSERT INTO client_communications (id, organization_id, client_id, communication_type, subject,
                                     message, communication_date, follow_up_date, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `,

  // Update client communication
  updateClientCommunication: `
    UPDATE client_communications
    SET communication_type = COALESCE($1, communication_type),
        subject = COALESCE($2, subject),
        message = COALESCE($3, message),
        communication_date = COALESCE($4, communication_date),
        follow_up_date = COALESCE($5, follow_up_date),
        status = COALESCE($6, status),
        updated_at = NOW()
    WHERE id = $7 AND organization_id = $8
    RETURNING *
  `,

  // Delete client communication
  deleteClientCommunication: `
    UPDATE client_communications
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2
  `,

  // Get client dashboard data
  getClientDashboardData: `
    SELECT
      c.id,
      c.name,
      c.email,
      c.company_name,
      c.status,
      COUNT(DISTINCT p.id) as total_projects,
      COUNT(DISTINCT q.id) as total_quotations,
      COUNT(DISTINCT o.id) as total_orders,
      COUNT(DISTINCT t.id) as total_tickets,
      SUM(p.budget) as total_project_budget,
      SUM(q.total_amount) as total_quotation_amount,
      SUM(o.total_amount) as total_order_amount
    FROM clients c
    LEFT JOIN projects p ON c.id = p.client_id AND p.is_active = true
    LEFT JOIN quotations q ON c.id = q.client_id AND q.is_active = true
    LEFT JOIN orders o ON c.id = o.client_id AND o.is_active = true
    LEFT JOIN tickets t ON c.id = t.client_id AND t.is_active = true
    WHERE c.organization_id = $1 AND c.is_active = true
    GROUP BY c.id, c.name, c.email, c.company_name, c.status
    ORDER BY c.created_at DESC
  `,

  // Get client activity timeline
  getClientActivityTimeline: `
    SELECT
      'project' as type,
      p.id,
      p.name as title,
      p.created_at as date,
      p.status,
      u.first_name || ' ' || u.last_name as created_by
    FROM projects p
    JOIN users u ON p.created_by = u.id
    WHERE p.client_id = $1 AND p.organization_id = $2 AND p.is_active = true

    UNION ALL

    SELECT
      'quotation' as type,
      q.id,
      q.title,
      q.created_at as date,
      q.status,
      u.first_name || ' ' || u.last_name as created_by
    FROM quotations q
    JOIN users u ON q.created_by = u.id
    WHERE q.client_id = $1 AND q.organization_id = $2 AND q.is_active = true

    UNION ALL

    SELECT
      'order' as type,
      o.id,
      o.title,
      o.created_at as date,
      o.status,
      u.first_name || ' ' || u.last_name as created_by
    FROM orders o
    JOIN users u ON o.created_by = u.id
    WHERE o.client_id = $1 AND o.organization_id = $2 AND o.is_active = true

    ORDER BY date DESC
  `
};

module.exports = clientQueries;
