// Ticket module database queries
const ticketQueries = {
  // === TICKET CRUD QUERIES ===

  // Find all tickets
  findAllTickets: `
    SELECT t.*,
           c.name as client_name,
           c.email as client_email,
           u.first_name || ' ' || u.last_name as assigned_to_name,
           p.name as project_name,
           o.title as order_title,
           COUNT(tm.id) as message_count,
           COUNT(CASE WHEN tm.is_internal = true THEN 1 END) as internal_message_count
    FROM tickets t
    LEFT JOIN clients c ON t.client_id = c.id
    LEFT JOIN users u ON t.assigned_to = u.id
    LEFT JOIN projects p ON t.project_id = p.id
    LEFT JOIN orders o ON t.order_id = o.id
    LEFT JOIN ticket_messages tm ON t.id = tm.ticket_id AND tm.is_active = true
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
    ORDER BY t.$9 $10
    LIMIT $11 OFFSET $12
  `,

  // Count tickets
  countTickets: `
    SELECT COUNT(*) FROM tickets
    WHERE organization_id = $1 AND is_active = true
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

  // Create ticket
  createTicket: `
    INSERT INTO tickets (
      title, description, category, priority, status, client_id, project_id,
      order_id, assigned_to, due_date, tags, attachments, organization_id, created_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *
  `,

  // Delete ticket
  deleteTicket: `
    UPDATE tickets
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2 AND is_active = true
    RETURNING *
  `,

  // Search tickets
  searchTickets: `
    SELECT t.*,
           c.name as client_name,
           c.email as client_email,
           u.first_name || ' ' || u.last_name as assigned_to_name,
           p.name as project_name,
           o.title as order_title,
           COUNT(tm.id) as message_count
    FROM tickets t
    LEFT JOIN clients c ON t.client_id = c.id
    LEFT JOIN users u ON t.assigned_to = u.id
    LEFT JOIN projects p ON t.project_id = p.id
    LEFT JOIN orders o ON t.order_id = o.id
    LEFT JOIN ticket_messages tm ON t.id = tm.ticket_id AND tm.is_active = true
    WHERE t.organization_id = $1
      AND t.is_active = true
      AND (
        t.title ILIKE $2 OR
        t.description ILIKE $2 OR
        c.name ILIKE $2 OR
        p.name ILIKE $2
      )
    GROUP BY t.id, c.name, c.email, u.first_name, u.last_name, p.name, o.title
    ORDER BY t.$3 $4
    LIMIT $5 OFFSET $6
  `,

  // Count search tickets
  countSearchTickets: `
    SELECT COUNT(*) FROM tickets t
    LEFT JOIN clients c ON t.client_id = c.id
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.organization_id = $1 AND t.is_active = true
      AND (
        t.title ILIKE $2 OR
        t.description ILIKE $2 OR
        c.name ILIKE $2 OR
        p.name ILIKE $2
      )
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
    INSERT INTO ticket_messages (
      ticket_id, content, message_type, is_internal, attachments, organization_id, created_by
    )
    VALUES ($1, $2, 'comment', $3, $4, $5, $6)
    RETURNING *
  `,

  // Get ticket comments
  getTicketComments: `
    SELECT tm.*,
           u.first_name || ' ' || u.last_name as created_by_name,
           t.title as ticket_title
    FROM ticket_messages tm
    JOIN tickets t ON tm.ticket_id = t.id
    LEFT JOIN users u ON tm.created_by = u.id
    WHERE tm.ticket_id = $1 AND tm.organization_id = $2 AND tm.is_active = true
      AND tm.message_type = 'comment'
    ORDER BY tm.created_at DESC
    LIMIT $3 OFFSET $4
  `,

  // Count ticket comments
  countTicketComments: `
    SELECT COUNT(*) FROM ticket_messages
    WHERE ticket_id = $1 AND organization_id = $2 AND is_active = true
      AND message_type = 'comment'
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
      COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_tickets_30_days,
      COUNT(CASE WHEN due_date < NOW() AND status NOT IN ('resolved', 'closed', 'cancelled') THEN 1 END) as overdue_tickets
    FROM tickets
    WHERE organization_id = $1 AND is_active = true
  `,

  // === TICKET MESSAGING QUERIES ===

  // Find all ticket messages
  findAllTicketMessages: `
    SELECT tm.*,
           u.first_name || ' ' || u.last_name as created_by_name,
           t.title as ticket_title,
           pm.content as parent_message_content
    FROM ticket_messages tm
    JOIN tickets t ON tm.ticket_id = t.id
    LEFT JOIN users u ON tm.created_by = u.id
    LEFT JOIN ticket_messages pm ON tm.parent_message_id = pm.id
    WHERE tm.ticket_id = $1 AND tm.organization_id = $2 AND tm.is_active = true
      AND ($3::text IS NULL OR tm.message_type = $3)
      AND ($4::boolean IS NULL OR tm.is_internal = $4)
      AND ($5::uuid IS NULL OR tm.parent_message_id = $5)
    ORDER BY tm.created_at DESC
    LIMIT $6 OFFSET $7
  `,

  // Count ticket messages
  countTicketMessages: `
    SELECT COUNT(*) FROM ticket_messages
    WHERE ticket_id = $1 AND organization_id = $2 AND is_active = true
      AND ($3::text IS NULL OR message_type = $3)
      AND ($4::boolean IS NULL OR is_internal = $4)
      AND ($5::uuid IS NULL OR parent_message_id = $5)
  `,

  // Find ticket message by ID
  findTicketMessageById: `
    SELECT tm.*,
           u.first_name || ' ' || u.last_name as created_by_name,
           t.title as ticket_title,
           pm.content as parent_message_content
    FROM ticket_messages tm
    JOIN tickets t ON tm.ticket_id = t.id
    LEFT JOIN users u ON tm.created_by = u.id
    LEFT JOIN ticket_messages pm ON tm.parent_message_id = pm.id
    WHERE tm.id = $1 AND tm.organization_id = $2 AND tm.is_active = true
  `,

  // Create ticket message
  createTicketMessage: `
    INSERT INTO ticket_messages (
      ticket_id, content, message_type, is_internal, parent_message_id,
      attachments, notify_users, organization_id, created_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `,

  // Delete ticket message
  deleteTicketMessage: `
    UPDATE ticket_messages
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2 AND is_active = true
    RETURNING *
  `,

  // Reply to ticket message
  replyToTicketMessage: `
    INSERT INTO ticket_messages (
      ticket_id, parent_message_id, content, message_type, is_internal,
      attachments, organization_id, created_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `,

  // Mark ticket message as read
  markTicketMessageAsRead: `
    INSERT INTO ticket_message_reads (message_id, user_id, organization_id)
    VALUES ($1, $3, $2)
    ON CONFLICT (message_id, user_id) DO NOTHING
    RETURNING *
  `,

  // Get ticket message thread
  getTicketMessageThread: `
    WITH RECURSIVE message_thread AS (
      -- Get the root message
      SELECT tm.*, 0 as level
      FROM ticket_messages tm
      WHERE tm.id = $1 AND tm.organization_id = $2 AND tm.is_active = true

      UNION ALL

      -- Get all replies
      SELECT tm.*, mt.level + 1
      FROM ticket_messages tm
      JOIN message_thread mt ON tm.parent_message_id = mt.id
      WHERE tm.organization_id = $2 AND tm.is_active = true
        AND ($3::boolean IS NULL OR tm.is_internal = $3)
    )
    SELECT mt.*,
           u.first_name || ' ' || u.last_name as created_by_name
    FROM message_thread mt
    LEFT JOIN users u ON mt.created_by = u.id
    ORDER BY mt.level, mt.created_at
  `,

  // === TICKET MESSAGE STATISTICS QUERIES ===

  // Get ticket message statistics
  getTicketMessageStatistics: `
    SELECT
      COUNT(*) as total_messages,
      COUNT(CASE WHEN message_type = 'comment' THEN 1 END) as comment_messages,
      COUNT(CASE WHEN message_type = 'internal_note' THEN 1 END) as internal_note_messages,
      COUNT(CASE WHEN message_type = 'status_update' THEN 1 END) as status_update_messages,
      COUNT(CASE WHEN message_type = 'assignment_update' THEN 1 END) as assignment_update_messages,
      COUNT(CASE WHEN is_internal = true THEN 1 END) as internal_messages,
      COUNT(CASE WHEN parent_message_id IS NOT NULL THEN 1 END) as reply_messages,
      AVG(LENGTH(content)) as average_message_length
    FROM ticket_messages
    WHERE organization_id = $1 AND is_active = true
  `,

  // Get ticket message read statistics
  getTicketMessageReadStatistics: `
    SELECT
      COUNT(*) as total_reads,
      COUNT(DISTINCT message_id) as unique_messages_read,
      COUNT(DISTINCT user_id) as unique_readers,
      AVG(read_at - created_at) as average_read_delay
    FROM ticket_message_reads tmr
    JOIN ticket_messages tm ON tmr.message_id = tm.id
    WHERE tmr.organization_id = $1
  `
};

module.exports = ticketQueries;
