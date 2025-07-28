// Ticket module database queries
const ticketQueries = {
  // Find all tickets for organization
  findAllTickets: `
    SELECT t.*,
           c.name as client_name,
           c.email as client_email,
           u.first_name || ' ' || u.last_name as assigned_to_name,
           p.name as project_name,
           o.title as order_title,
           COUNT(tc.id) as comment_count
    FROM tickets t
    LEFT JOIN clients c ON t.client_id = c.id
    LEFT JOIN users u ON t.assigned_to = u.id
    LEFT JOIN projects p ON t.project_id = p.id
    LEFT JOIN orders o ON t.order_id = o.id
    LEFT JOIN ticket_comments tc ON t.id = tc.ticket_id AND tc.is_active = true
    WHERE t.organization_id = $1
      AND t.is_active = true
      AND ($2::text IS NULL OR t.status = $2)
      AND ($3::text IS NULL OR t.priority = $3)
      AND ($4::text IS NULL OR t.category = $4)
      AND ($5::uuid IS NULL OR t.client_id = $5)
      AND ($6::uuid IS NULL OR t.project_id = $6)
      AND ($7::uuid IS NULL OR t.assigned_to = $7)
      AND ($8::uuid IS NULL OR t.created_by = $8)
    GROUP BY t.id, c.name, c.email, u.first_name, u.last_name, p.name, o.title
    ORDER BY t.${sortBy} ${sortOrder}
    LIMIT $9 OFFSET $10
  `,

  // Count tickets for organization
  countTickets: `
    SELECT COUNT(*) as count
    FROM tickets
    WHERE organization_id = $1
      AND is_active = true
      AND ($2::text IS NULL OR status = $2)
      AND ($3::text IS NULL OR priority = $3)
      AND ($4::text IS NULL OR category = $4)
      AND ($5::uuid IS NULL OR client_id = $5)
      AND ($6::uuid IS NULL OR project_id = $6)
      AND ($7::uuid IS NULL OR assigned_to = $7)
      AND ($8::uuid IS NULL OR created_by = $8)
  `,

  // Find ticket by ID
  findTicketById: `
    SELECT t.*,
           c.name as client_name,
           c.email as client_email,
           u.first_name || ' ' || u.last_name as assigned_to_name,
           p.name as project_name,
           o.title as order_title
    FROM tickets t
    LEFT JOIN clients c ON t.client_id = c.id
    LEFT JOIN users u ON t.assigned_to = u.id
    LEFT JOIN projects p ON t.project_id = p.id
    LEFT JOIN orders o ON t.order_id = o.id
    WHERE t.id = $1 AND t.organization_id = $2 AND t.is_active = true
  `,

  // Create new ticket
  createTicket: `
    INSERT INTO tickets (
      title, description, category, priority, status, client_id, project_id,
      order_id, assigned_to, due_date, tags, attachments, organization_id, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *
  `,

  // Update ticket
  updateTicket: `
    UPDATE tickets
    SET title = COALESCE($3, title),
        description = COALESCE($4, description),
        category = COALESCE($5, category),
        priority = COALESCE($6, priority),
        status = COALESCE($7, status),
        client_id = COALESCE($8, client_id),
        project_id = COALESCE($9, project_id),
        order_id = COALESCE($10, order_id),
        assigned_to = COALESCE($11, assigned_to),
        due_date = COALESCE($12, due_date),
        tags = COALESCE($13, tags),
        attachments = COALESCE($14, attachments),
        updated_at = NOW()
    WHERE id = $1 AND organization_id = $2 AND is_active = true
    RETURNING *
  `,

  // Delete ticket (soft delete)
  deleteTicket: `
    UPDATE tickets
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2 AND is_active = true
  `,

  // Search tickets
  searchTickets: `
    SELECT t.*,
           c.name as client_name,
           c.email as client_email,
           u.first_name || ' ' || u.last_name as assigned_to_name,
           p.name as project_name,
           o.title as order_title,
           COUNT(tc.id) as comment_count
    FROM tickets t
    LEFT JOIN clients c ON t.client_id = c.id
    LEFT JOIN users u ON t.assigned_to = u.id
    LEFT JOIN projects p ON t.project_id = p.id
    LEFT JOIN orders o ON t.order_id = o.id
    LEFT JOIN ticket_comments tc ON t.id = tc.ticket_id AND tc.is_active = true
    WHERE t.organization_id = $1
      AND t.is_active = true
      AND (
        t.title ILIKE $2 OR
        t.description ILIKE $2 OR
        c.name ILIKE $2
      )
      AND ($3::text IS NULL OR t.status = $3)
      AND ($4::text IS NULL OR t.priority = $4)
      AND ($5::text IS NULL OR t.category = $5)
    GROUP BY t.id, c.name, c.email, u.first_name, u.last_name, p.name, o.title
    ORDER BY t.${sortBy} ${sortOrder}
    LIMIT $6 OFFSET $7
  `,

  // Count search results
  countSearchTickets: `
    SELECT COUNT(*) as count
    FROM tickets t
    LEFT JOIN clients c ON t.client_id = c.id
    WHERE t.organization_id = $1
      AND t.is_active = true
      AND (
        t.title ILIKE $2 OR
        t.description ILIKE $2 OR
        c.name ILIKE $2
      )
      AND ($3::text IS NULL OR t.status = $3)
      AND ($4::text IS NULL OR t.priority = $4)
      AND ($5::text IS NULL OR t.category = $5)
  `,

  // Update ticket status
  updateTicketStatus: `
    UPDATE tickets
    SET status = $3,
        notes = COALESCE($4, notes),
        updated_at = NOW()
    WHERE id = $1 AND organization_id = $2 AND is_active = true
    RETURNING *
  `,

  // Assign ticket
  assignTicket: `
    UPDATE tickets
    SET assigned_to = $3,
        updated_at = NOW()
    WHERE id = $1 AND organization_id = $2 AND is_active = true
    RETURNING *
  `,

  // Add ticket comment
  addTicketComment: `
    INSERT INTO ticket_comments (
      ticket_id, organization_id, content, is_internal, attachments, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `,

  // Get ticket comments
  getTicketComments: `
    SELECT tc.*,
           u.first_name || ' ' || u.last_name as created_by_name
    FROM ticket_comments tc
    LEFT JOIN users u ON tc.created_by = u.id
    WHERE tc.ticket_id = $1 AND tc.organization_id = $2 AND tc.is_active = true
    ORDER BY tc.created_at ASC
    LIMIT $3 OFFSET $4
  `,

  // Count ticket comments
  countTicketComments: `
    SELECT COUNT(*) as count
    FROM ticket_comments
    WHERE ticket_id = $1 AND organization_id = $2 AND is_active = true
  `,

  // Get ticket statistics
  getTicketStatistics: `
    SELECT
      COUNT(*) as total_tickets,
      COUNT(CASE WHEN status = 'open' THEN 1 END) as open_tickets,
      COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tickets,
      COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_tickets,
      COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_tickets,
      COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_tickets,
      COUNT(CASE WHEN priority = 'urgent' THEN 1 END) as urgent_tickets,
      COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority_tickets,
      COUNT(CASE WHEN category = 'bug' THEN 1 END) as bug_tickets,
      COUNT(CASE WHEN category = 'feature' THEN 1 END) as feature_tickets,
      COUNT(CASE WHEN category = 'support' THEN 1 END) as support_tickets,
      COUNT(CASE WHEN category = 'question' THEN 1 END) as question_tickets,
      COUNT(CASE WHEN assigned_to IS NULL THEN 1 END) as unassigned_tickets,
      AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/3600) as avg_resolution_hours
    FROM tickets
    WHERE organization_id = $1 AND is_active = true
  `
};

module.exports = ticketQueries;
