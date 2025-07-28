// Order module database queries
const orderQueries = {
  // Find all orders for organization
  findAllOrders: `
    SELECT o.*,
           c.name as client_name,
           c.email as client_email,
           u.first_name || ' ' || u.last_name as assigned_to_name,
           p.name as project_name
    FROM orders o
    LEFT JOIN clients c ON o.client_id = c.id
    LEFT JOIN users u ON o.assigned_to = u.id
    LEFT JOIN projects p ON o.project_id = p.id
    WHERE o.organization_id = $1
      AND o.is_active = true
      AND ($2::text IS NULL OR o.status = $2)
      AND ($3::text IS NULL OR o.priority = $3)
      AND ($4::uuid IS NULL OR o.client_id = $4)
      AND ($5::uuid IS NULL OR o.assigned_to = $5)
    ORDER BY o.${sortBy} ${sortOrder}
    LIMIT $6 OFFSET $7
  `,

  // Count orders for organization
  countOrders: `
    SELECT COUNT(*) as count
    FROM orders
    WHERE organization_id = $1
      AND is_active = true
      AND ($2::text IS NULL OR status = $2)
      AND ($3::text IS NULL OR priority = $3)
      AND ($4::uuid IS NULL OR client_id = $4)
      AND ($5::uuid IS NULL OR assigned_to = $5)
  `,

  // Find order by ID
  findOrderById: `
    SELECT o.*,
           c.name as client_name,
           c.email as client_email,
           u.first_name || ' ' || u.last_name as assigned_to_name,
           p.name as project_name
    FROM orders o
    LEFT JOIN clients c ON o.client_id = c.id
    LEFT JOIN users u ON o.assigned_to = u.id
    LEFT JOIN projects p ON o.project_id = p.id
    WHERE o.id = $1 AND o.organization_id = $2 AND o.is_active = true
  `,

  // Create new order
  createOrder: `
    INSERT INTO orders (
      title, description, client_id, project_id, order_date, due_date,
      total_amount, currency, status, priority, assigned_to, notes,
      organization_id, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *
  `,

  // Update order
  updateOrder: `
    UPDATE orders
    SET title = COALESCE($3, title),
        description = COALESCE($4, description),
        client_id = COALESCE($5, client_id),
        project_id = COALESCE($6, project_id),
        order_date = COALESCE($7, order_date),
        due_date = COALESCE($8, due_date),
        total_amount = COALESCE($9, total_amount),
        currency = COALESCE($10, currency),
        status = COALESCE($11, status),
        priority = COALESCE($12, priority),
        assigned_to = COALESCE($13, assigned_to),
        notes = COALESCE($14, notes),
        updated_at = NOW()
    WHERE id = $1 AND organization_id = $2 AND is_active = true
    RETURNING *
  `,

  // Delete order (soft delete)
  deleteOrder: `
    UPDATE orders
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2 AND is_active = true
  `,

  // Search orders
  searchOrders: `
    SELECT o.*,
           c.name as client_name,
           c.email as client_email,
           u.first_name || ' ' || u.last_name as assigned_to_name,
           p.name as project_name
    FROM orders o
    LEFT JOIN clients c ON o.client_id = c.id
    LEFT JOIN users u ON o.assigned_to = u.id
    LEFT JOIN projects p ON o.project_id = p.id
    WHERE o.organization_id = $1
      AND o.is_active = true
      AND (
        o.title ILIKE $2 OR
        o.description ILIKE $2 OR
        c.name ILIKE $2
      )
      AND ($3::text IS NULL OR o.status = $3)
      AND ($4::text IS NULL OR o.priority = $4)
    ORDER BY o.${sortBy} ${sortOrder}
    LIMIT $5 OFFSET $6
  `,

  // Count search results
  countSearchOrders: `
    SELECT COUNT(*) as count
    FROM orders o
    LEFT JOIN clients c ON o.client_id = c.id
    WHERE o.organization_id = $1
      AND o.is_active = true
      AND (
        o.title ILIKE $2 OR
        o.description ILIKE $2 OR
        c.name ILIKE $2
      )
      AND ($3::text IS NULL OR o.status = $3)
      AND ($4::text IS NULL OR o.priority = $4)
  `,

  // Update order status
  updateOrderStatus: `
    UPDATE orders
    SET status = $3,
        notes = COALESCE($4, notes),
        updated_at = NOW()
    WHERE id = $1 AND organization_id = $2 AND is_active = true
    RETURNING *
  `,

  // Assign order
  assignOrder: `
    UPDATE orders
    SET assigned_to = $3,
        updated_at = NOW()
    WHERE id = $1 AND organization_id = $2 AND is_active = true
    RETURNING *
  `,

  // Get order statistics
  getOrderStatistics: `
    SELECT
      COUNT(*) as total_orders,
      COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_orders,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
      COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_orders,
      COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_orders,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
      COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
      COUNT(CASE WHEN priority = 'urgent' THEN 1 END) as urgent_orders,
      COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority_orders,
      SUM(total_amount) as total_amount,
      AVG(total_amount) as average_amount
    FROM orders
    WHERE organization_id = $1 AND is_active = true
  `
};

module.exports = orderQueries;
