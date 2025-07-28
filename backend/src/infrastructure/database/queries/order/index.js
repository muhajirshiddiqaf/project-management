// Order module database queries
const orderQueries = {
  // === ORDER CRUD QUERIES ===

  // Find all orders
  findAllOrders: `
    SELECT o.*,
           c.name as client_name,
           c.email as client_email,
           u.first_name || ' ' || u.last_name as assigned_to_name,
           p.name as project_name,
           COUNT(oi.id) as item_count,
           COALESCE(SUM(oi.quantity * oi.unit_price * (1 - oi.discount_percentage / 100)), 0) as total_amount
    FROM orders o
    LEFT JOIN clients c ON o.client_id = c.id
    LEFT JOIN users u ON o.assigned_to = u.id
    LEFT JOIN projects p ON o.project_id = p.id
    LEFT JOIN order_items oi ON o.id = oi.order_id AND oi.is_active = true
    WHERE o.organization_id = $1
      AND o.is_active = true
      AND ($2::text IS NULL OR o.status = $2)
      AND ($3::text IS NULL OR o.priority = $3)
      AND ($4::uuid IS NULL OR o.client_id = $4)
      AND ($5::uuid IS NULL OR o.assigned_to = $5)
    GROUP BY o.id, c.name, c.email, u.first_name, u.last_name, p.name
    ORDER BY o.created_at DESC
    LIMIT $6 OFFSET $7
  `,

  // Count orders
  countOrders: `
    SELECT COUNT(*) FROM orders
    WHERE organization_id = $1 AND is_active = true
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

  // Create order
  createOrder: `
    INSERT INTO orders (
      title, description, client_id, project_id, status, priority,
      due_date, assigned_to, tags, notes, organization_id, created_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *
  `,

  // Delete order
  deleteOrder: `
    UPDATE orders
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2 AND is_active = true
    RETURNING *
  `,

  // Search orders
  searchOrders: `
    SELECT o.*,
           c.name as client_name,
           c.email as client_email,
           u.first_name || ' ' || u.last_name as assigned_to_name,
           p.name as project_name,
           COUNT(oi.id) as item_count,
           COALESCE(SUM(oi.quantity * oi.unit_price * (1 - oi.discount_percentage / 100)), 0) as total_amount
    FROM orders o
    LEFT JOIN clients c ON o.client_id = c.id
    LEFT JOIN users u ON o.assigned_to = u.id
    LEFT JOIN projects p ON o.project_id = p.id
    LEFT JOIN order_items oi ON o.id = oi.order_id AND oi.is_active = true
    WHERE o.organization_id = $1
      AND o.is_active = true
      AND (
        o.title ILIKE $2 OR
        o.description ILIKE $2 OR
        c.name ILIKE $2 OR
        p.name ILIKE $2
      )
    GROUP BY o.id, c.name, c.email, u.first_name, u.last_name, p.name
    ORDER BY o.created_at DESC
    LIMIT $3 OFFSET $4
  `,

  // Count search orders
  countSearchOrders: `
    SELECT COUNT(*) FROM orders o
    LEFT JOIN clients c ON o.client_id = c.id
    LEFT JOIN projects p ON o.project_id = p.id
    WHERE o.organization_id = $1 AND o.is_active = true
      AND (
        o.title ILIKE $2 OR
        o.description ILIKE $2 OR
        c.name ILIKE $2 OR
        p.name ILIKE $2
      )
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

  // === ORDER ITEMS QUERIES ===

  // Find all order items
  findAllOrderItems: `
    SELECT oi.*,
           o.title as order_title,
           o.status as order_status
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE oi.order_id = $1 AND oi.organization_id = $2 AND oi.is_active = true
      AND ($3::text IS NULL OR oi.category = $3)
    ORDER BY oi.created_at DESC
    LIMIT $4 OFFSET $5
  `,

  // Count order items
  countOrderItems: `
    SELECT COUNT(*) FROM order_items
    WHERE order_id = $1 AND organization_id = $2 AND is_active = true
      AND ($3::text IS NULL OR category = $3)
  `,

  // Find order item by ID
  findOrderItemById: `
    SELECT oi.*,
           o.title as order_title,
           o.status as order_status
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE oi.id = $1 AND oi.organization_id = $2 AND oi.is_active = true
  `,

  // Create order item
  createOrderItem: `
    INSERT INTO order_items (
      order_id, name, description, quantity, unit_price, unit_type,
      category, tax_rate, discount_percentage, notes, organization_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *
  `,

  // Delete order item
  deleteOrderItem: `
    UPDATE order_items
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2 AND is_active = true
    RETURNING *
  `,

  // Calculate order totals
  calculateOrderTotals: `
    SELECT
      COUNT(*) as total_items,
      SUM(quantity) as total_quantity,
      SUM(quantity * unit_price) as subtotal,
      SUM(quantity * unit_price * (tax_rate / 100)) as total_tax,
      SUM(quantity * unit_price * (discount_percentage / 100)) as total_discount,
      SUM(quantity * unit_price * (1 - discount_percentage / 100)) as total_after_discount,
      SUM(quantity * unit_price * (1 - discount_percentage / 100) * (1 + tax_rate / 100)) as grand_total
    FROM order_items
    WHERE order_id = $1 AND organization_id = $2 AND is_active = true
  `,

  // === ORDER STATISTICS QUERIES ===

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
      COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_orders_30_days,
      COUNT(CASE WHEN due_date < NOW() AND status NOT IN ('completed', 'cancelled') THEN 1 END) as overdue_orders
    FROM orders
    WHERE organization_id = $1 AND is_active = true
  `,

  // Get order items statistics
  getOrderItemsStatistics: `
    SELECT
      COUNT(*) as total_items,
      COUNT(CASE WHEN category = 'service' THEN 1 END) as service_items,
      COUNT(CASE WHEN category = 'material' THEN 1 END) as material_items,
      COUNT(CASE WHEN category = 'labor' THEN 1 END) as labor_items,
      COUNT(CASE WHEN category = 'overhead' THEN 1 END) as overhead_items,
      COUNT(CASE WHEN category = 'other' THEN 1 END) as other_items,
      SUM(quantity * unit_price) as total_value,
      AVG(unit_price) as average_unit_price
    FROM order_items
    WHERE organization_id = $1 AND is_active = true
  `
};

module.exports = orderQueries;
