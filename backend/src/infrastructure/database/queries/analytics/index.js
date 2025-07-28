// Dashboard overview queries
const getDashboardOverview = `
  SELECT
    -- Revenue metrics
    COALESCE(SUM(i.total_amount), 0) as total_revenue,
    COALESCE(SUM(CASE WHEN i.status = 'paid' THEN i.total_amount ELSE 0 END), 0) as paid_revenue,
    COALESCE(SUM(CASE WHEN i.status = 'overdue' THEN i.total_amount ELSE 0 END), 0) as overdue_revenue,

    -- Client metrics
    COUNT(DISTINCT c.id) as total_clients,
    COUNT(DISTINCT CASE WHEN c.created_at >= NOW() - INTERVAL '30 days' THEN c.id END) as new_clients_30_days,

    -- Order metrics
    COUNT(DISTINCT o.id) as total_orders,
    COUNT(DISTINCT CASE WHEN o.status = 'completed' THEN o.id END) as completed_orders,
    COUNT(DISTINCT CASE WHEN o.status = 'in_progress' THEN o.id END) as active_orders,

    -- Ticket metrics
    COUNT(DISTINCT t.id) as total_tickets,
    COUNT(DISTINCT CASE WHEN t.status = 'open' THEN t.id END) as open_tickets,
    COUNT(DISTINCT CASE WHEN t.status = 'resolved' THEN t.id END) as resolved_tickets,

    -- Project metrics
    COUNT(DISTINCT p.id) as total_projects,
    COUNT(DISTINCT CASE WHEN p.status = 'in_progress' THEN p.id END) as active_projects,
    COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.id END) as completed_projects,

    -- Quotation metrics
    COUNT(DISTINCT q.id) as total_quotations,
    COUNT(DISTINCT CASE WHEN q.status = 'accepted' THEN q.id END) as accepted_quotations,
    COUNT(DISTINCT CASE WHEN q.status = 'sent' THEN q.id END) as sent_quotations,

    -- Invoice metrics
    COUNT(DISTINCT i.id) as total_invoices,
    COUNT(DISTINCT CASE WHEN i.status = 'paid' THEN i.id END) as paid_invoices,
    COUNT(DISTINCT CASE WHEN i.status = 'overdue' THEN i.id END) as overdue_invoices,

    -- Service metrics
    COUNT(DISTINCT s.id) as total_services,
    COUNT(DISTINCT sc.id) as total_service_categories,

    -- User metrics
    COUNT(DISTINCT u.id) as total_users,
    COUNT(DISTINCT CASE WHEN u.last_login >= NOW() - INTERVAL '7 days' THEN u.id END) as active_users_7_days,

    -- Recent activity
    COUNT(DISTINCT CASE WHEN i.created_at >= NOW() - INTERVAL '7 days' THEN i.id END) as invoices_7_days,
    COUNT(DISTINCT CASE WHEN o.created_at >= NOW() - INTERVAL '7 days' THEN o.id END) as orders_7_days,
    COUNT(DISTINCT CASE WHEN t.created_at >= NOW() - INTERVAL '7 days' THEN t.id END) as tickets_7_days
  FROM organizations org
  LEFT JOIN clients c ON org.id = c.organization_id
  LEFT JOIN orders o ON org.id = o.organization_id
  LEFT JOIN tickets t ON org.id = t.organization_id
  LEFT JOIN projects p ON org.id = p.organization_id
  LEFT JOIN quotations q ON org.id = q.organization_id
  LEFT JOIN invoices i ON org.id = i.organization_id
  LEFT JOIN services s ON org.id = s.organization_id
  LEFT JOIN service_categories sc ON org.id = sc.organization_id
  LEFT JOIN users u ON org.id = u.organization_id
  WHERE org.id = $1
`;

// Revenue analytics queries
const getRevenueAnalytics = `
  SELECT
    DATE_TRUNC('month', i.created_at) as period,
    SUM(i.total_amount) as revenue,
    COUNT(i.id) as invoice_count,
    AVG(i.total_amount) as average_invoice_amount,
    SUM(CASE WHEN i.status = 'paid' THEN i.total_amount ELSE 0 END) as paid_revenue,
    SUM(CASE WHEN i.status = 'overdue' THEN i.total_amount ELSE 0 END) as overdue_revenue,
    COUNT(CASE WHEN i.status = 'paid' THEN 1 END) as paid_invoice_count,
    COUNT(CASE WHEN i.status = 'overdue' THEN 1 END) as overdue_invoice_count
  FROM invoices i
  WHERE i.organization_id = $1
  GROUP BY DATE_TRUNC('month', i.created_at)
  ORDER BY period DESC
  LIMIT 12
`;

// Client analytics queries
const getClientAnalytics = `
  SELECT
    c.id,
    c.name as client_name,
    c.email as client_email,
    c.industry,
    c.region,
    COUNT(DISTINCT o.id) as total_orders,
    COUNT(DISTINCT i.id) as total_invoices,
    COUNT(DISTINCT t.id) as total_tickets,
    COUNT(DISTINCT p.id) as total_projects,
    COALESCE(SUM(i.total_amount), 0) as total_revenue,
    COALESCE(SUM(CASE WHEN i.status = 'paid' THEN i.total_amount ELSE 0 END), 0) as paid_revenue,
    MAX(i.created_at) as last_invoice_date,
    MAX(o.created_at) as last_order_date,
    MAX(t.created_at) as last_ticket_date
  FROM clients c
  LEFT JOIN orders o ON c.id = o.client_id
  LEFT JOIN invoices i ON c.id = i.client_id
  LEFT JOIN tickets t ON c.id = t.client_id
  LEFT JOIN projects p ON c.id = p.client_id
  WHERE c.organization_id = $1
  GROUP BY c.id, c.name, c.email, c.industry, c.region
  ORDER BY total_revenue DESC
  LIMIT 50
`;

// Order analytics queries
const getOrderAnalytics = `
  SELECT
    DATE_TRUNC('month', o.created_at) as period,
    COUNT(o.id) as total_orders,
    COUNT(CASE WHEN o.status = 'pending' THEN 1 END) as pending_orders,
    COUNT(CASE WHEN o.status = 'in_progress' THEN 1 END) as in_progress_orders,
    COUNT(CASE WHEN o.status = 'completed' THEN 1 END) as completed_orders,
    COUNT(CASE WHEN o.status = 'cancelled' THEN 1 END) as cancelled_orders,
    AVG(o.total_amount) as average_order_amount,
    SUM(o.total_amount) as total_order_value
  FROM orders o
  WHERE o.organization_id = $1
  GROUP BY DATE_TRUNC('month', o.created_at)
  ORDER BY period DESC
  LIMIT 12
`;

// Ticket analytics queries
const getTicketAnalytics = `
  SELECT
    DATE_TRUNC('month', t.created_at) as period,
    COUNT(t.id) as total_tickets,
    COUNT(CASE WHEN t.priority = 'low' THEN 1 END) as low_priority_tickets,
    COUNT(CASE WHEN t.priority = 'medium' THEN 1 END) as medium_priority_tickets,
    COUNT(CASE WHEN t.priority = 'high' THEN 1 END) as high_priority_tickets,
    COUNT(CASE WHEN t.priority = 'urgent' THEN 1 END) as urgent_priority_tickets,
    COUNT(CASE WHEN t.status = 'open' THEN 1 END) as open_tickets,
    COUNT(CASE WHEN t.status = 'in_progress' THEN 1 END) as in_progress_tickets,
    COUNT(CASE WHEN t.status = 'resolved' THEN 1 END) as resolved_tickets,
    COUNT(CASE WHEN t.status = 'closed' THEN 1 END) as closed_tickets,
    AVG(EXTRACT(EPOCH FROM (t.resolved_at - t.created_at))/3600) as average_resolution_hours
  FROM tickets t
  WHERE t.organization_id = $1
  GROUP BY DATE_TRUNC('month', t.created_at)
  ORDER BY period DESC
  LIMIT 12
`;

// Project analytics queries
const getProjectAnalytics = `
  SELECT
    DATE_TRUNC('month', p.created_at) as period,
    COUNT(p.id) as total_projects,
    COUNT(CASE WHEN p.status = 'planning' THEN 1 END) as planning_projects,
    COUNT(CASE WHEN p.status = 'in_progress' THEN 1 END) as in_progress_projects,
    COUNT(CASE WHEN p.status = 'completed' THEN 1 END) as completed_projects,
    COUNT(CASE WHEN p.status = 'on_hold' THEN 1 END) as on_hold_projects,
    COUNT(CASE WHEN p.status = 'cancelled' THEN 1 END) as cancelled_projects,
    AVG(p.budget) as average_project_budget,
    SUM(p.budget) as total_project_budget,
    AVG(EXTRACT(EPOCH FROM (p.completed_at - p.created_at))/86400) as average_project_duration_days
  FROM projects p
  WHERE p.organization_id = $1
  GROUP BY DATE_TRUNC('month', p.created_at)
  ORDER BY period DESC
  LIMIT 12
`;

// Service analytics queries
const getServiceAnalytics = `
  SELECT
    DATE_TRUNC('month', s.created_at) as period,
    COUNT(s.id) as total_services,
    COUNT(DISTINCT s.category_id) as unique_categories,
    AVG(s.price) as average_service_price,
    SUM(s.price) as total_service_value,
    COUNT(CASE WHEN s.is_active = true THEN 1 END) as active_services,
    COUNT(CASE WHEN s.is_active = false THEN 1 END) as inactive_services
  FROM services s
  WHERE s.organization_id = $1
  GROUP BY DATE_TRUNC('month', s.created_at)
  ORDER BY period DESC
  LIMIT 12
`;

// Quotation analytics queries
const getQuotationAnalytics = `
  SELECT
    DATE_TRUNC('month', q.created_at) as period,
    COUNT(q.id) as total_quotations,
    COUNT(CASE WHEN q.status = 'draft' THEN 1 END) as draft_quotations,
    COUNT(CASE WHEN q.status = 'sent' THEN 1 END) as sent_quotations,
    COUNT(CASE WHEN q.status = 'accepted' THEN 1 END) as accepted_quotations,
    COUNT(CASE WHEN q.status = 'rejected' THEN 1 END) as rejected_quotations,
    COUNT(CASE WHEN q.status = 'expired' THEN 1 END) as expired_quotations,
    AVG(q.total_amount) as average_quotation_amount,
    SUM(q.total_amount) as total_quotation_value,
    COUNT(CASE WHEN q.status = 'accepted' THEN 1 END) * 100.0 / COUNT(q.id) as acceptance_rate
  FROM quotations q
  WHERE q.organization_id = $1
  GROUP BY DATE_TRUNC('month', q.created_at)
  ORDER BY period DESC
  LIMIT 12
`;

// Invoice analytics queries
const getInvoiceAnalytics = `
  SELECT
    DATE_TRUNC('month', i.created_at) as period,
    COUNT(i.id) as total_invoices,
    COUNT(CASE WHEN i.status = 'draft' THEN 1 END) as draft_invoices,
    COUNT(CASE WHEN i.status = 'sent' THEN 1 END) as sent_invoices,
    COUNT(CASE WHEN i.status = 'paid' THEN 1 END) as paid_invoices,
    COUNT(CASE WHEN i.status = 'overdue' THEN 1 END) as overdue_invoices,
    COUNT(CASE WHEN i.status = 'cancelled' THEN 1 END) as cancelled_invoices,
    AVG(i.total_amount) as average_invoice_amount,
    SUM(i.total_amount) as total_invoice_value,
    SUM(CASE WHEN i.status = 'paid' THEN i.total_amount ELSE 0 END) as paid_invoice_value,
    SUM(CASE WHEN i.status = 'overdue' THEN i.total_amount ELSE 0 END) as overdue_invoice_value
  FROM invoices i
  WHERE i.organization_id = $1
  GROUP BY DATE_TRUNC('month', i.created_at)
  ORDER BY period DESC
  LIMIT 12
`;

// Performance metrics queries
const getPerformanceMetrics = `
  SELECT
    -- Revenue performance
    COALESCE(SUM(i.total_amount), 0) as total_revenue,
    COALESCE(SUM(CASE WHEN i.status = 'paid' THEN i.total_amount ELSE 0 END), 0) as paid_revenue,
    COALESCE(SUM(CASE WHEN i.status = 'overdue' THEN i.total_amount ELSE 0 END), 0) as overdue_revenue,

    -- Order performance
    COUNT(DISTINCT o.id) as total_orders,
    COUNT(DISTINCT CASE WHEN o.status = 'completed' THEN o.id END) as completed_orders,
    COUNT(DISTINCT CASE WHEN o.status = 'in_progress' THEN o.id END) as active_orders,

    -- Ticket performance
    COUNT(DISTINCT t.id) as total_tickets,
    COUNT(DISTINCT CASE WHEN t.status = 'resolved' THEN t.id END) as resolved_tickets,
    AVG(EXTRACT(EPOCH FROM (t.resolved_at - t.created_at))/3600) as average_ticket_resolution_hours,

    -- Project performance
    COUNT(DISTINCT p.id) as total_projects,
    COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.id END) as completed_projects,
    AVG(EXTRACT(EPOCH FROM (p.completed_at - p.created_at))/86400) as average_project_duration_days,

    -- Quotation performance
    COUNT(DISTINCT q.id) as total_quotations,
    COUNT(DISTINCT CASE WHEN q.status = 'accepted' THEN q.id END) as accepted_quotations,
    COUNT(DISTINCT CASE WHEN q.status = 'accepted' THEN q.id END) * 100.0 / COUNT(DISTINCT q.id) as quotation_acceptance_rate,

    -- Client performance
    COUNT(DISTINCT c.id) as total_clients,
    COUNT(DISTINCT CASE WHEN c.created_at >= NOW() - INTERVAL '30 days' THEN c.id END) as new_clients_30_days,

    -- User performance
    COUNT(DISTINCT u.id) as total_users,
    COUNT(DISTINCT CASE WHEN u.last_login >= NOW() - INTERVAL '7 days' THEN u.id END) as active_users_7_days
  FROM organizations org
  LEFT JOIN clients c ON org.id = c.organization_id
  LEFT JOIN orders o ON org.id = o.organization_id
  LEFT JOIN tickets t ON org.id = t.organization_id
  LEFT JOIN projects p ON org.id = p.organization_id
  LEFT JOIN quotations q ON org.id = q.organization_id
  LEFT JOIN invoices i ON org.id = i.organization_id
  LEFT JOIN users u ON org.id = u.organization_id
  WHERE org.id = $1
`;

// Growth analytics queries
const getGrowthAnalytics = `
  SELECT
    DATE_TRUNC('month', created_at) as period,
    COUNT(*) as count,
    LAG(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at)) as previous_count,
    (COUNT(*) - LAG(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at))) as growth,
    CASE
      WHEN LAG(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at)) > 0
      THEN ((COUNT(*) - LAG(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at))) * 100.0 / LAG(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at)))
      ELSE 0
    END as growth_percentage
  FROM (
    SELECT created_at FROM clients WHERE organization_id = $1
    UNION ALL
    SELECT created_at FROM orders WHERE organization_id = $1
    UNION ALL
    SELECT created_at FROM tickets WHERE organization_id = $1
    UNION ALL
    SELECT created_at FROM projects WHERE organization_id = $1
    UNION ALL
    SELECT created_at FROM invoices WHERE organization_id = $1
  ) combined_data
  GROUP BY DATE_TRUNC('month', created_at)
  ORDER BY period DESC
  LIMIT 12
`;

// Custom analytics queries
const getCustomRevenueAnalytics = `
  SELECT
    DATE_TRUNC('month', i.created_at) as period,
    SUM(i.total_amount) as revenue,
    COUNT(i.id) as invoice_count,
    AVG(i.total_amount) as average_amount,
    SUM(CASE WHEN i.status = 'paid' THEN i.total_amount ELSE 0 END) as paid_revenue,
    SUM(CASE WHEN i.status = 'overdue' THEN i.total_amount ELSE 0 END) as overdue_revenue
  FROM invoices i
  WHERE i.organization_id = $1
  GROUP BY DATE_TRUNC('month', i.created_at)
  ORDER BY period DESC
  LIMIT $2
`;

const getCustomClientAnalytics = `
  SELECT
    c.id,
    c.name,
    c.email,
    c.industry,
    c.region,
    COUNT(DISTINCT o.id) as order_count,
    COUNT(DISTINCT i.id) as invoice_count,
    COALESCE(SUM(i.total_amount), 0) as total_revenue
  FROM clients c
  LEFT JOIN orders o ON c.id = o.client_id
  LEFT JOIN invoices i ON c.id = i.client_id
  WHERE c.organization_id = $1
  GROUP BY c.id, c.name, c.email, c.industry, c.region
  ORDER BY total_revenue DESC
  LIMIT $2
`;

const getCustomOrderAnalytics = `
  SELECT
    o.id,
    o.order_number,
    o.status,
    o.total_amount,
    o.created_at,
    c.name as client_name,
    u.name as created_by_name
  FROM orders o
  LEFT JOIN clients c ON o.client_id = c.id
  LEFT JOIN users u ON o.created_by = u.id
  WHERE o.organization_id = $1
  ORDER BY o.created_at DESC
  LIMIT $2
`;

const getCustomTicketAnalytics = `
  SELECT
    t.id,
    t.ticket_number,
    t.subject,
    t.priority,
    t.status,
    t.created_at,
    t.resolved_at,
    c.name as client_name,
    u.name as assigned_to_name
  FROM tickets t
  LEFT JOIN clients c ON t.client_id = c.id
  LEFT JOIN users u ON t.assigned_to = u.id
  WHERE t.organization_id = $1
  ORDER BY t.created_at DESC
  LIMIT $2
`;

const getCustomProjectAnalytics = `
  SELECT
    p.id,
    p.project_name,
    p.status,
    p.budget,
    p.created_at,
    p.completed_at,
    c.name as client_name,
    u.name as manager_name
  FROM projects p
  LEFT JOIN clients c ON p.client_id = c.id
  LEFT JOIN users u ON p.manager_id = u.id
  WHERE p.organization_id = $1
  ORDER BY p.created_at DESC
  LIMIT $2
`;

const getCustomServiceAnalytics = `
  SELECT
    s.id,
    s.name,
    s.description,
    s.price,
    s.is_active,
    s.created_at,
    sc.name as category_name
  FROM services s
  LEFT JOIN service_categories sc ON s.category_id = sc.id
  WHERE s.organization_id = $1
  ORDER BY s.created_at DESC
  LIMIT $2
`;

const getCustomQuotationAnalytics = `
  SELECT
    q.id,
    q.quotation_number,
    q.status,
    q.total_amount,
    q.created_at,
    q.valid_until,
    c.name as client_name,
    u.name as created_by_name
  FROM quotations q
  LEFT JOIN clients c ON q.client_id = c.id
  LEFT JOIN users u ON q.created_by = u.id
  WHERE q.organization_id = $1
  ORDER BY q.created_at DESC
  LIMIT $2
`;

const getCustomInvoiceAnalytics = `
  SELECT
    i.id,
    i.invoice_number,
    i.status,
    i.total_amount,
    i.created_at,
    i.due_date,
    c.name as client_name,
    u.name as created_by_name
  FROM invoices i
  LEFT JOIN clients c ON i.client_id = c.id
  LEFT JOIN users u ON i.created_by = u.id
  WHERE i.organization_id = $1
  ORDER BY i.created_at DESC
  LIMIT $2
`;

// Real-time analytics queries
const getRealTimeDashboard = `
  SELECT
    -- Recent activity counts
    COUNT(DISTINCT CASE WHEN i.created_at >= NOW() - INTERVAL '1 hour' THEN i.id END) as invoices_last_hour,
    COUNT(DISTINCT CASE WHEN o.created_at >= NOW() - INTERVAL '1 hour' THEN o.id END) as orders_last_hour,
    COUNT(DISTINCT CASE WHEN t.created_at >= NOW() - INTERVAL '1 hour' THEN t.id END) as tickets_last_hour,

    -- Active items
    COUNT(DISTINCT CASE WHEN o.status = 'in_progress' THEN o.id END) as active_orders,
    COUNT(DISTINCT CASE WHEN t.status IN ('open', 'in_progress') THEN t.id END) as active_tickets,
    COUNT(DISTINCT CASE WHEN p.status = 'in_progress' THEN p.id END) as active_projects,

    -- Overdue items
    COUNT(DISTINCT CASE WHEN i.status = 'overdue' THEN i.id END) as overdue_invoices,
    COUNT(DISTINCT CASE WHEN q.status = 'sent' AND q.valid_until < NOW() THEN q.id END) as expired_quotations,

    -- Recent revenue
    COALESCE(SUM(CASE WHEN i.created_at >= NOW() - INTERVAL '24 hours' THEN i.total_amount ELSE 0 END), 0) as revenue_24_hours,
    COALESCE(SUM(CASE WHEN i.created_at >= NOW() - INTERVAL '7 days' THEN i.total_amount ELSE 0 END), 0) as revenue_7_days
  FROM organizations org
  LEFT JOIN invoices i ON org.id = i.organization_id
  LEFT JOIN orders o ON org.id = o.organization_id
  LEFT JOIN tickets t ON org.id = t.organization_id
  LEFT JOIN projects p ON org.id = p.organization_id
  LEFT JOIN quotations q ON org.id = q.organization_id
  WHERE org.id = $1
`;

// Activity feed queries
const getActivityFeed = `
  SELECT
    'invoice' as activity_type,
    i.id as activity_id,
    i.invoice_number as reference,
    i.status,
    i.created_at,
    c.name as client_name,
    u.name as user_name,
    'Invoice ' || i.status as description
  FROM invoices i
  LEFT JOIN clients c ON i.client_id = c.id
  LEFT JOIN users u ON i.created_by = u.id
  WHERE i.organization_id = $1

  UNION ALL

  SELECT
    'order' as activity_type,
    o.id as activity_id,
    o.order_number as reference,
    o.status,
    o.created_at,
    c.name as client_name,
    u.name as user_name,
    'Order ' || o.status as description
  FROM orders o
  LEFT JOIN clients c ON o.client_id = c.id
  LEFT JOIN users u ON o.created_by = u.id
  WHERE o.organization_id = $1

  UNION ALL

  SELECT
    'ticket' as activity_type,
    t.id as activity_id,
    t.ticket_number as reference,
    t.status,
    t.created_at,
    c.name as client_name,
    u.name as user_name,
    'Ticket ' || t.status as description
  FROM tickets t
  LEFT JOIN clients c ON t.client_id = c.id
  LEFT JOIN users u ON t.created_by = u.id
  WHERE t.organization_id = $1

  ORDER BY created_at DESC
  LIMIT $2 OFFSET $3
`;

const countActivityFeed = `
  SELECT COUNT(*) as count
  FROM (
    SELECT i.created_at FROM invoices i WHERE i.organization_id = $1
    UNION ALL
    SELECT o.created_at FROM orders o WHERE o.organization_id = $1
    UNION ALL
    SELECT t.created_at FROM tickets t WHERE t.organization_id = $1
  ) combined_activities
`;

// Alerts and notifications queries
const getAlertsAndNotifications = `
  SELECT
    'overdue_invoice' as alert_type,
    'high' as priority,
    'active' as status,
    i.id as reference_id,
    i.invoice_number as reference,
    'Invoice overdue by ' || EXTRACT(DAY FROM NOW() - i.due_date) || ' days' as message,
    i.due_date as created_at
  FROM invoices i
  WHERE i.organization_id = $1 AND i.status = 'overdue'

  UNION ALL

  SELECT
    'expired_quotation' as alert_type,
    'medium' as priority,
    'active' as status,
    q.id as reference_id,
    q.quotation_number as reference,
    'Quotation expired' as message,
    q.valid_until as created_at
  FROM quotations q
  WHERE q.organization_id = $1 AND q.status = 'sent' AND q.valid_until < NOW()

  UNION ALL

  SELECT
    'urgent_ticket' as alert_type,
    'urgent' as priority,
    'active' as status,
    t.id as reference_id,
    t.ticket_number as reference,
    'Urgent ticket requires attention' as message,
    t.created_at
  FROM tickets t
  WHERE t.organization_id = $1 AND t.priority = 'urgent' AND t.status IN ('open', 'in_progress')

  ORDER BY created_at DESC
  LIMIT $2 OFFSET $3
`;

const countAlertsAndNotifications = `
  SELECT COUNT(*) as count
  FROM (
    SELECT 1 FROM invoices i WHERE i.organization_id = $1 AND i.status = 'overdue'
    UNION ALL
    SELECT 1 FROM quotations q WHERE q.organization_id = $1 AND q.status = 'sent' AND q.valid_until < NOW()
    UNION ALL
    SELECT 1 FROM tickets t WHERE t.organization_id = $1 AND t.priority = 'urgent' AND t.status IN ('open', 'in_progress')
  ) combined_alerts
`;

module.exports = {
  getDashboardOverview,
  getRevenueAnalytics,
  getClientAnalytics,
  getOrderAnalytics,
  getTicketAnalytics,
  getProjectAnalytics,
  getServiceAnalytics,
  getQuotationAnalytics,
  getInvoiceAnalytics,
  getPerformanceMetrics,
  getGrowthAnalytics,
  getCustomRevenueAnalytics,
  getCustomClientAnalytics,
  getCustomOrderAnalytics,
  getCustomTicketAnalytics,
  getCustomProjectAnalytics,
  getCustomServiceAnalytics,
  getCustomQuotationAnalytics,
  getCustomInvoiceAnalytics,
  getRealTimeDashboard,
  getActivityFeed,
  countActivityFeed,
  getAlertsAndNotifications,
  countAlertsAndNotifications
};
