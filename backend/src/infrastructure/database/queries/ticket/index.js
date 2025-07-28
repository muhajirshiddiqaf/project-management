// Ticket module database queries
const ticketQueries = {
  // Find ticket by ID
  findTicketById: `
    SELECT t.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name,
           a.first_name || ' ' || a.last_name as assigned_to_name
    FROM tickets t
    LEFT JOIN clients c ON t.client_id = c.id
    LEFT JOIN users u ON t.created_by = u.id
    LEFT JOIN users a ON t.assigned_to = a.id
    WHERE t.id = $1 AND t.organization_id = $2 AND t.is_active = true
  `,

  // Find tickets by organization
  findTicketsByOrganization: `
    SELECT t.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name,
           a.first_name || ' ' || a.last_name as assigned_to_name
    FROM tickets t
    LEFT JOIN clients c ON t.client_id = c.id
    LEFT JOIN users u ON t.created_by = u.id
    LEFT JOIN users a ON t.assigned_to = a.id
    WHERE t.organization_id = $1 AND t.is_active = true
    ORDER BY t.created_at DESC
  `,

  // Create ticket
  createTicket: `
    INSERT INTO tickets (id, organization_id, client_id, title, description,
                       priority, status, category, assigned_to, created_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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
        updated_at = NOW()
    WHERE id = $7 AND organization_id = $8
    RETURNING *
  `,

  // Delete ticket (soft delete)
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
      COUNT(CASE WHEN priority = 'urgent' THEN 1 END) as urgent_tickets,
      AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600) as avg_resolution_hours
    FROM tickets
    WHERE organization_id = $1 AND is_active = true
  `,

  // Search tickets
  searchTickets: `
    SELECT t.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name,
           a.first_name || ' ' || a.last_name as assigned_to_name
    FROM tickets t
    LEFT JOIN clients c ON t.client_id = c.id
    LEFT JOIN users u ON t.created_by = u.id
    LEFT JOIN users a ON t.assigned_to = a.id
    WHERE t.organization_id = $1 AND t.is_active = true
    AND (
      LOWER(t.title) LIKE LOWER($2) OR
      LOWER(t.description) LIKE LOWER($2) OR
      LOWER(c.name) LIKE LOWER($2)
    )
    ORDER BY t.created_at DESC
  `,

  // Get tickets by status
  getTicketsByStatus: `
    SELECT t.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name,
           a.first_name || ' ' || a.last_name as assigned_to_name
    FROM tickets t
    LEFT JOIN clients c ON t.client_id = c.id
    LEFT JOIN users u ON t.created_by = u.id
    LEFT JOIN users a ON t.assigned_to = a.id
    WHERE t.organization_id = $1 AND t.status = $2 AND t.is_active = true
    ORDER BY t.created_at DESC
  `,

  // Get tickets by priority
  getTicketsByPriority: `
    SELECT t.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name,
           a.first_name || ' ' || a.last_name as assigned_to_name
    FROM tickets t
    LEFT JOIN clients c ON t.client_id = c.id
    LEFT JOIN users u ON t.created_by = u.id
    LEFT JOIN users a ON t.assigned_to = a.id
    WHERE t.organization_id = $1 AND t.priority = $2 AND t.is_active = true
    ORDER BY t.created_at DESC
  `,

  // Get tickets by assigned user
  getTicketsByAssignedUser: `
    SELECT t.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name,
           a.first_name || ' ' || a.last_name as assigned_to_name
    FROM tickets t
    LEFT JOIN clients c ON t.client_id = c.id
    LEFT JOIN users u ON t.created_by = u.id
    LEFT JOIN users a ON t.assigned_to = a.id
    WHERE t.organization_id = $1 AND t.assigned_to = $2 AND t.is_active = true
    ORDER BY t.created_at DESC
  `,

  // Get tickets by client
  getTicketsByClient: `
    SELECT t.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name,
           a.first_name || ' ' || a.last_name as assigned_to_name
    FROM tickets t
    LEFT JOIN clients c ON t.client_id = c.id
    LEFT JOIN users u ON t.created_by = u.id
    LEFT JOIN users a ON t.assigned_to = a.id
    WHERE t.organization_id = $1 AND t.client_id = $2 AND t.is_active = true
    ORDER BY t.created_at DESC
  `,

  // Get ticket comments
  getTicketComments: `
    SELECT tc.*, u.first_name || ' ' || u.last_name as created_by_name
    FROM ticket_comments tc
    LEFT JOIN users u ON tc.created_by = u.id
    WHERE tc.ticket_id = $1 AND tc.organization_id = $2 AND tc.is_active = true
    ORDER BY tc.created_at ASC
  `,

  // Create ticket comment
  createTicketComment: `
    INSERT INTO ticket_comments (id, organization_id, ticket_id, content, created_by)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `,

  // Update ticket comment
  updateTicketComment: `
    UPDATE ticket_comments
    SET content = COALESCE($1, content),
        updated_at = NOW()
    WHERE id = $2 AND organization_id = $3
    RETURNING *
  `,

  // Delete ticket comment
  deleteTicketComment: `
    UPDATE ticket_comments
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2
  `,

  // Get ticket attachments
  getTicketAttachments: `
    SELECT * FROM ticket_attachments
    WHERE ticket_id = $1 AND organization_id = $2 AND is_active = true
    ORDER BY created_at ASC
  `,

  // Create ticket attachment
  createTicketAttachment: `
    INSERT INTO ticket_attachments (id, organization_id, ticket_id, file_name,
                                  file_path, file_size, file_type, created_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `,

  // Delete ticket attachment
  deleteTicketAttachment: `
    UPDATE ticket_attachments
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2
  `,

  // Get ticket history
  getTicketHistory: `
    SELECT th.*, u.first_name || ' ' || u.last_name as performed_by_name
    FROM ticket_history th
    LEFT JOIN users u ON th.performed_by = u.id
    WHERE th.ticket_id = $1 AND th.organization_id = $2 AND th.is_active = true
    ORDER BY th.created_at DESC
  `,

  // Create ticket history
  createTicketHistory: `
    INSERT INTO ticket_history (id, organization_id, ticket_id, action, description,
                              performed_by, old_values, new_values)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `,

  // Get ticket dashboard data
  getTicketDashboardData: `
    SELECT
      t.id,
      t.title,
      t.status,
      t.priority,
      t.category,
      t.created_at,
      t.resolved_at,
      c.name as client_name,
      u.first_name || ' ' || u.last_name as created_by_name,
      a.first_name || ' ' || a.last_name as assigned_to_name,
      COUNT(tc.id) as total_comments,
      COUNT(ta.id) as total_attachments
    FROM tickets t
    LEFT JOIN clients c ON t.client_id = c.id
    LEFT JOIN users u ON t.created_by = u.id
    LEFT JOIN users a ON t.assigned_to = a.id
    LEFT JOIN ticket_comments tc ON t.id = tc.ticket_id AND tc.is_active = true
    LEFT JOIN ticket_attachments ta ON t.id = ta.ticket_id AND ta.is_active = true
    WHERE t.organization_id = $1 AND t.is_active = true
    GROUP BY t.id, t.title, t.status, t.priority, t.category, t.created_at, t.resolved_at,
             c.name, u.first_name, u.last_name, a.first_name, a.last_name
    ORDER BY t.created_at DESC
  `,

  // Get ticket timeline
  getTicketTimeline: `
    SELECT
      'comment' as type,
      tc.id,
      tc.content as title,
      tc.created_at as date,
      'added' as status,
      u.first_name || ' ' || u.last_name as performed_by_name
    FROM ticket_comments tc
    LEFT JOIN users u ON tc.created_by = u.id
    WHERE tc.ticket_id = $1 AND tc.organization_id = $2 AND tc.is_active = true

    UNION ALL

    SELECT
      'attachment' as type,
      ta.id,
      ta.file_name as title,
      ta.created_at as date,
      'uploaded' as status,
      u.first_name || ' ' || u.last_name as performed_by_name
    FROM ticket_attachments ta
    LEFT JOIN users u ON ta.created_by = u.id
    WHERE ta.ticket_id = $1 AND ta.organization_id = $2 AND ta.is_active = true

    UNION ALL

    SELECT
      'history' as type,
      th.id,
      th.action as title,
      th.created_at as date,
      th.description as status,
      u.first_name || ' ' || u.last_name as performed_by_name
    FROM ticket_history th
    LEFT JOIN users u ON th.performed_by = u.id
    WHERE th.ticket_id = $1 AND th.organization_id = $2 AND th.is_active = true

    ORDER BY date DESC
  `,

  // Update ticket status
  updateTicketStatus: `
    UPDATE tickets
    SET status = $1,
        resolved_at = CASE WHEN $1 IN ('resolved', 'closed') THEN NOW() ELSE resolved_at END,
        updated_at = NOW()
    WHERE id = $2 AND organization_id = $3
    RETURNING *
  `,

  // Assign ticket
  assignTicket: `
    UPDATE tickets
    SET assigned_to = $1, updated_at = NOW()
    WHERE id = $2 AND organization_id = $3
    RETURNING *
  `,

  // Get open tickets
  getOpenTickets: `
    SELECT t.*, c.name as client_name, c.email as client_email
    FROM tickets t
    LEFT JOIN clients c ON t.client_id = c.id
    WHERE t.organization_id = $1 AND t.status IN ('open', 'in_progress') AND t.is_active = true
    ORDER BY t.priority DESC, t.created_at ASC
  `,

  // Get urgent tickets
  getUrgentTickets: `
    SELECT t.*, c.name as client_name, c.email as client_email
    FROM tickets t
    LEFT JOIN clients c ON t.client_id = c.id
    WHERE t.organization_id = $1 AND t.priority = 'urgent' AND t.status != 'closed' AND t.is_active = true
    ORDER BY t.created_at ASC
  `,

  // Get ticket resolution time
  getTicketResolutionTime: `
    SELECT
      AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600) as avg_resolution_hours,
      MIN(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600) as min_resolution_hours,
      MAX(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600) as max_resolution_hours
    FROM tickets
    WHERE organization_id = $1 AND status IN ('resolved', 'closed') AND resolved_at IS NOT NULL
    AND is_active = true
  `,

  // Get tickets by category
  getTicketsByCategory: `
    SELECT
      category,
      COUNT(*) as ticket_count,
      COUNT(CASE WHEN status = 'open' THEN 1 END) as open_count,
      COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_count
    FROM tickets
    WHERE organization_id = $1 AND is_active = true
    GROUP BY category
    ORDER BY ticket_count DESC
  `
};

module.exports = ticketQueries;
