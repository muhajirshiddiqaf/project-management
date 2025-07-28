// Client module database queries
const clientQueries = {
  // === CLIENT CRUD QUERIES ===

  // Find all clients
  findAllClients: `
    SELECT * FROM clients
    WHERE organization_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `,

  // Count clients
  countClients: `
    SELECT COUNT(*) FROM clients
    WHERE organization_id = $1
  `,

  // Find client by ID
  findClientById: `
    SELECT * FROM clients
    WHERE id = $1 AND organization_id = $2
  `,

  // Create client
  createClient: `
    INSERT INTO clients (
      organization_id, name, company_name, email, phone, address,
      city, state, country, postal_code, website, industry,
      client_type, status, source, notes, tags
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
    RETURNING *
  `,

  // Update client
  updateClient: `
    UPDATE clients
    SET name = $3, company_name = $4, email = $5, phone = $6, address = $7,
        city = $8, state = $9, country = $10, postal_code = $11, website = $12,
        industry = $13, client_type = $14, status = $15, source = $16, notes = $17, tags = $18,
        updated_at = NOW()
    WHERE id = $1 AND organization_id = $2
    RETURNING *
  `,

  // Delete client
  deleteClient: `
    DELETE FROM clients
    WHERE id = $1 AND organization_id = $2
    RETURNING *
  `,

  // Search clients
  searchClients: `
    SELECT * FROM clients
    WHERE organization_id = $1
      AND (
        name ILIKE $2 OR
        email ILIKE $2 OR
        company_name ILIKE $2 OR
        phone ILIKE $2
      )
    ORDER BY created_at DESC
    LIMIT $3 OFFSET $4
  `,

  // Count search clients
  countSearchClients: `
    SELECT COUNT(*) FROM clients
    WHERE organization_id = $1
      AND (
        name ILIKE $2 OR
        email ILIKE $2 OR
        company_name ILIKE $2 OR
        phone ILIKE $2
      )
  `,

  // === CLIENT CONTACTS QUERIES ===

  // Find all client contacts
  findAllClientContacts: `
    SELECT cc.*, c.name as client_name, c.email as client_email
    FROM client_contacts cc
    JOIN clients c ON cc.client_id = c.id
    WHERE cc.client_id = $1
    ORDER BY cc.is_primary DESC, cc.created_at DESC
    LIMIT $2 OFFSET $3
  `,

  // Count client contacts
  countClientContacts: `
    SELECT COUNT(*) FROM client_contacts
    WHERE client_id = $1
  `,

  // Find client contact by ID
  findClientContactById: `
    SELECT cc.*, c.name as client_name, c.email as client_email
    FROM client_contacts cc
    JOIN clients c ON cc.client_id = c.id
    WHERE cc.id = $1
  `,

  // Create client contact
  createClientContact: `
    INSERT INTO client_contacts (
      client_id, name, email, phone, position, is_primary
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `,

  // Delete client contact
  deleteClientContact: `
    UPDATE client_contacts
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2 AND is_active = true
    RETURNING *
  `,

  // === CLIENT COMMUNICATIONS QUERIES ===

  // Find all client communications
  findAllClientCommunications: `
    SELECT cc.*,
           c.name as client_name,
           c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name,
           co.name as contact_name,
           co.email as contact_email
    FROM client_communications cc
    JOIN clients c ON cc.client_id = c.id
    LEFT JOIN users u ON cc.created_by = u.id
    LEFT JOIN client_contacts co ON cc.contact_id = co.id
    WHERE cc.client_id = $1 AND cc.organization_id = $2 AND cc.is_active = true
      AND ($3::text IS NULL OR cc.type = $3)
      AND ($4::text IS NULL OR cc.direction = $4)
    ORDER BY cc.created_at DESC
    LIMIT $5 OFFSET $6
  `,

  // Count client communications
  countClientCommunications: `
    SELECT COUNT(*) FROM client_communications
    WHERE client_id = $1 AND organization_id = $2 AND is_active = true
      AND ($3::text IS NULL OR type = $3)
      AND ($4::text IS NULL OR direction = $4)
  `,

  // Find client communication by ID
  findClientCommunicationById: `
    SELECT cc.*,
           c.name as client_name,
           c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name,
           co.name as contact_name,
           co.email as contact_email
    FROM client_communications cc
    JOIN clients c ON cc.client_id = c.id
    LEFT JOIN users u ON cc.created_by = u.id
    LEFT JOIN client_contacts co ON cc.contact_id = co.id
    WHERE cc.id = $1 AND cc.organization_id = $2 AND cc.is_active = true
  `,

  // Create client communication
  createClientCommunication: `
    INSERT INTO client_communications (
      client_id, type, subject, content, direction, contact_id,
      scheduled_follow_up, notes, organization_id, created_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `,

  // Delete client communication
  deleteClientCommunication: `
    UPDATE client_communications
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2 AND is_active = true
    RETURNING *
  `,

  // === CLIENT STATISTICS QUERIES ===

  // Get client statistics
  getClientStatistics: `
    SELECT
      COUNT(*) as total_clients,
      COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_clients_30_days,
      COUNT(CASE WHEN updated_at >= NOW() - INTERVAL '7 days' THEN 1 END) as updated_clients_7_days,
      COUNT(CASE WHEN company IS NOT NULL AND company != '' THEN 1 END) as clients_with_company
    FROM clients
    WHERE organization_id = $1 AND is_active = true
  `,

  // Get client contacts statistics
  getClientContactsStatistics: `
    SELECT
      COUNT(*) as total_contacts,
      COUNT(CASE WHEN is_primary = true THEN 1 END) as primary_contacts,
      COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_contacts_30_days
    FROM client_contacts
    WHERE organization_id = $1 AND is_active = true
  `,

  // Get client communications statistics
  getClientCommunicationsStatistics: `
    SELECT
      COUNT(*) as total_communications,
      COUNT(CASE WHEN type = 'email' THEN 1 END) as email_communications,
      COUNT(CASE WHEN type = 'phone' THEN 1 END) as phone_communications,
      COUNT(CASE WHEN type = 'meeting' THEN 1 END) as meeting_communications,
      COUNT(CASE WHEN direction = 'inbound' THEN 1 END) as inbound_communications,
      COUNT(CASE WHEN direction = 'outbound' THEN 1 END) as outbound_communications,
      COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as communications_7_days
    FROM client_communications
    WHERE organization_id = $1 AND is_active = true
  `
};

module.exports = clientQueries;
