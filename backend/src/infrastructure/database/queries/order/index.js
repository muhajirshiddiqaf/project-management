// Order module database queries
const orderQueries = {
  // Find order by ID
  findOrderById: `
    SELECT o.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name
    FROM orders o
    LEFT JOIN clients c ON o.client_id = c.id
    LEFT JOIN users u ON o.created_by = u.id
    WHERE o.id = $1 AND o.organization_id = $2 AND o.is_active = true
  `,

  // Find orders by organization
  findOrdersByOrganization: `
    SELECT o.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name
    FROM orders o
    LEFT JOIN clients c ON o.client_id = c.id
    LEFT JOIN users u ON o.created_by = u.id
    WHERE o.organization_id = $1 AND o.is_active = true
    ORDER BY o.created_at DESC
  `,

  // Create order
  createOrder: `
    INSERT INTO orders (id, organization_id, client_id, title, description,
                      subtotal, tax_amount, discount_amount, total_amount,
                      status, payment_status, delivery_date, created_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *
  `,

  // Update order
  updateOrder: `
    UPDATE orders
    SET title = COALESCE($1, title),
        description = COALESCE($2, description),
        subtotal = COALESCE($3, subtotal),
        tax_amount = COALESCE($4, tax_amount),
        discount_amount = COALESCE($5, discount_amount),
        total_amount = COALESCE($6, total_amount),
        status = COALESCE($7, status),
        payment_status = COALESCE($8, payment_status),
        delivery_date = COALESCE($9, delivery_date),
        updated_at = NOW()
    WHERE id = $10 AND organization_id = $11
    RETURNING *
  `,

  // Delete order (soft delete)
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
      COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped_orders,
      COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
      COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
      COUNT(CASE WHEN payment_status = 'pending' THEN 1 END) as pending_payments,
      COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) as paid_orders,
      COUNT(CASE WHEN payment_status = 'failed' THEN 1 END) as failed_payments,
      SUM(total_amount) as total_order_amount,
      AVG(total_amount) as avg_order_amount,
      SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as paid_amount
    FROM orders
    WHERE organization_id = $1 AND is_active = true
  `,

  // Search orders
  searchOrders: `
    SELECT o.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name
    FROM orders o
    LEFT JOIN clients c ON o.client_id = c.id
    LEFT JOIN users u ON o.created_by = u.id
    WHERE o.organization_id = $1 AND o.is_active = true
    AND (
      LOWER(o.title) LIKE LOWER($2) OR
      LOWER(o.description) LIKE LOWER($2) OR
      LOWER(c.name) LIKE LOWER($2)
    )
    ORDER BY o.created_at DESC
  `,

  // Get orders by status
  getOrdersByStatus: `
    SELECT o.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name
    FROM orders o
    LEFT JOIN clients c ON o.client_id = c.id
    LEFT JOIN users u ON o.created_by = u.id
    WHERE o.organization_id = $1 AND o.status = $2 AND o.is_active = true
    ORDER BY o.created_at DESC
  `,

  // Get orders by payment status
  getOrdersByPaymentStatus: `
    SELECT o.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name
    FROM orders o
    LEFT JOIN clients c ON o.client_id = c.id
    LEFT JOIN users u ON o.created_by = u.id
    WHERE o.organization_id = $1 AND o.payment_status = $2 AND o.is_active = true
    ORDER BY o.created_at DESC
  `,

  // Get orders by client
  getOrdersByClient: `
    SELECT o.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name
    FROM orders o
    LEFT JOIN clients c ON o.client_id = c.id
    LEFT JOIN users u ON o.created_by = u.id
    WHERE o.organization_id = $1 AND o.client_id = $2 AND o.is_active = true
    ORDER BY o.created_at DESC
  `,

  // Get order items
  getOrderItems: `
    SELECT oi.*, s.name as service_name, s.description as service_description
    FROM order_items oi
    LEFT JOIN services s ON oi.service_id = s.id
    WHERE oi.order_id = $1 AND oi.organization_id = $2 AND oi.is_active = true
    ORDER BY oi.created_at ASC
  `,

  // Create order item
  createOrderItem: `
    INSERT INTO order_items (id, organization_id, order_id, service_id, description,
                           quantity, unit_price, total_price)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `,

  // Update order item
  updateOrderItem: `
    UPDATE order_items
    SET service_id = COALESCE($1, service_id),
        description = COALESCE($2, description),
        quantity = COALESCE($3, quantity),
        unit_price = COALESCE($4, unit_price),
        total_price = COALESCE($5, total_price),
        updated_at = NOW()
    WHERE id = $6 AND organization_id = $7
    RETURNING *
  `,

  // Delete order item
  deleteOrderItem: `
    UPDATE order_items
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2
  `,

  // Get order payments
  getOrderPayments: `
    SELECT * FROM order_payments
    WHERE order_id = $1 AND organization_id = $2 AND is_active = true
    ORDER BY created_at DESC
  `,

  // Create order payment
  createOrderPayment: `
    INSERT INTO order_payments (id, organization_id, order_id, payment_method,
                              amount, transaction_id, payment_date, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `,

  // Update order payment
  updateOrderPayment: `
    UPDATE order_payments
    SET payment_method = COALESCE($1, payment_method),
        amount = COALESCE($2, amount),
        transaction_id = COALESCE($3, transaction_id),
        payment_date = COALESCE($4, payment_date),
        status = COALESCE($5, status),
        updated_at = NOW()
    WHERE id = $6 AND organization_id = $7
    RETURNING *
  `,

  // Delete order payment
  deleteOrderPayment: `
    UPDATE order_payments
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2
  `,

  // Get order shipping
  getOrderShipping: `
    SELECT * FROM order_shipping
    WHERE order_id = $1 AND organization_id = $2 AND is_active = true
    ORDER BY created_at DESC
    LIMIT 1
  `,

  // Create order shipping
  createOrderShipping: `
    INSERT INTO order_shipping (id, organization_id, order_id, shipping_method,
                              tracking_number, shipping_date, estimated_delivery, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `,

  // Update order shipping
  updateOrderShipping: `
    UPDATE order_shipping
    SET shipping_method = COALESCE($1, shipping_method),
        tracking_number = COALESCE($2, tracking_number),
        shipping_date = COALESCE($3, shipping_date),
        estimated_delivery = COALESCE($4, estimated_delivery),
        status = COALESCE($5, status),
        updated_at = NOW()
    WHERE id = $6 AND organization_id = $7
    RETURNING *
  `,

  // Get order dashboard data
  getOrderDashboardData: `
    SELECT
      o.id,
      o.title,
      o.status,
      o.payment_status,
      o.total_amount,
      o.created_at,
      o.delivery_date,
      c.name as client_name,
      u.first_name || ' ' || u.last_name as created_by_name,
      COUNT(oi.id) as total_items,
      SUM(oi.total_price) as items_total
    FROM orders o
    LEFT JOIN clients c ON o.client_id = c.id
    LEFT JOIN users u ON o.created_by = u.id
    LEFT JOIN order_items oi ON o.id = oi.order_id AND oi.is_active = true
    WHERE o.organization_id = $1 AND o.is_active = true
    GROUP BY o.id, o.title, o.status, o.payment_status, o.total_amount, o.created_at,
             o.delivery_date, c.name, u.first_name, u.last_name
    ORDER BY o.created_at DESC
  `,

  // Get order timeline
  getOrderTimeline: `
    SELECT
      'item' as type,
      oi.id,
      oi.description as title,
      oi.created_at as date,
      'added' as status,
      NULL as performed_by_name
    FROM order_items oi
    WHERE oi.order_id = $1 AND oi.organization_id = $2 AND oi.is_active = true

    UNION ALL

    SELECT
      'payment' as type,
      op.id,
      op.payment_method as title,
      op.payment_date as date,
      op.status,
      NULL as performed_by_name
    FROM order_payments op
    WHERE op.order_id = $1 AND op.organization_id = $2 AND op.is_active = true

    UNION ALL

    SELECT
      'shipping' as type,
      os.id,
      os.shipping_method as title,
      os.shipping_date as date,
      os.status,
      NULL as performed_by_name
    FROM order_shipping os
    WHERE os.order_id = $1 AND os.organization_id = $2 AND os.is_active = true

    ORDER BY date DESC
  `,

  // Update order status
  updateOrderStatus: `
    UPDATE orders
    SET status = $1, updated_at = NOW()
    WHERE id = $2 AND organization_id = $3
    RETURNING *
  `,

  // Update order payment status
  updateOrderPaymentStatus: `
    UPDATE orders
    SET payment_status = $1, updated_at = NOW()
    WHERE id = $2 AND organization_id = $3
    RETURNING *
  `,

  // Get pending orders
  getPendingOrders: `
    SELECT o.*, c.name as client_name, c.email as client_email
    FROM orders o
    LEFT JOIN clients c ON o.client_id = c.id
    WHERE o.organization_id = $1 AND o.status = 'pending' AND o.is_active = true
    ORDER BY o.created_at ASC
  `,

  // Get overdue orders
  getOverdueOrders: `
    SELECT o.*, c.name as client_name, c.email as client_email
    FROM orders o
    LEFT JOIN clients c ON o.client_id = c.id
    WHERE o.organization_id = $1 AND o.delivery_date < NOW()
    AND o.status IN ('pending', 'processing') AND o.is_active = true
    ORDER BY o.delivery_date ASC
  `,

  // Get order revenue by period
  getOrderRevenueByPeriod: `
    SELECT
      DATE_TRUNC('month', created_at) as period,
      COUNT(*) as order_count,
      SUM(total_amount) as revenue,
      AVG(total_amount) as avg_order_value
    FROM orders
    WHERE organization_id = $1 AND payment_status = 'paid' AND is_active = true
    AND created_at >= $2 AND created_at <= $3
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY period DESC
  `
};

module.exports = orderQueries;
