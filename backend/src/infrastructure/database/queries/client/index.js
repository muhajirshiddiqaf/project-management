// Client module database queries
const clientQueries = {
  // Find all clients for organization
  findAllClients: `
    SELECT c.*,
           COUNT(cc.id) as contact_count,
           COUNT(pr.id) as project_count
    FROM clients c
    LEFT JOIN client_contacts cc ON c.id = cc.client_id
    LEFT JOIN projects pr ON c.id = pr.client_id
    WHERE c.organization_id = $1 AND c.is_active = true
    GROUP BY c.id
    ORDER BY c.${sortBy} ${sortOrder}
    LIMIT $2 OFFSET $3
  `,

  // Count clients for organization
  countClients: `
    SELECT COUNT(*) as count
    FROM clients
    WHERE organization_id = $1 AND is_active = true
  `,

  // Find client by ID
  findClientById: `
    SELECT c.*,
           COUNT(cc.id) as contact_count,
           COUNT(pr.id) as project_count
    FROM clients c
    LEFT JOIN client_contacts cc ON c.id = cc.client_id
    LEFT JOIN projects pr ON c.id = pr.client_id
    WHERE c.id = $1 AND c.organization_id = $2 AND c.is_active = true
    GROUP BY c.id
  `,

  // Create new client
  createClient: `
    INSERT INTO clients (
      name, email, phone, address, company, website, notes, organization_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `,

  // Update client
  updateClient: `
    UPDATE clients
    SET name = COALESCE($3, name),
        email = COALESCE($4, email),
        phone = COALESCE($5, phone),
        address = COALESCE($6, address),
        company = COALESCE($7, company),
        website = COALESCE($8, website),
        notes = COALESCE($9, notes),
        updated_at = NOW()
    WHERE id = $1 AND organization_id = $2 AND is_active = true
    RETURNING *
  `,

  // Delete client (soft delete)
  deleteClient: `
    UPDATE clients
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2 AND is_active = true
  `,

  // Search clients
  searchClients: `
    SELECT c.*,
           COUNT(cc.id) as contact_count,
           COUNT(pr.id) as project_count
    FROM clients c
    LEFT JOIN client_contacts cc ON c.id = cc.client_id
    LEFT JOIN projects pr ON c.id = pr.client_id
    WHERE c.organization_id = $1
      AND c.is_active = true
      AND (
        c.name ILIKE $2 OR
        c.email ILIKE $2 OR
        c.company ILIKE $2
      )
    GROUP BY c.id
    ORDER BY c.${sortBy} ${sortOrder}
    LIMIT $3 OFFSET $4
  `,

  // Count search results
  countSearchClients: `
    SELECT COUNT(*) as count
    FROM clients
    WHERE organization_id = $1
      AND is_active = true
      AND (
        name ILIKE $2 OR
        email ILIKE $2 OR
        company ILIKE $2
      )
  `
};

module.exports = clientQueries;
