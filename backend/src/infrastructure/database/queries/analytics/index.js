// Analytics module database queries
const analyticsQueries = {
  // === DASHBOARD OVERVIEW QUERIES ===

  // Get dashboard overview
  getDashboardOverview: `
    SELECT
      (SELECT COUNT(*) FROM clients WHERE organization_id = $1) as total_clients,
      (SELECT COUNT(*) FROM projects WHERE organization_id = $1) as total_projects,
      (SELECT COUNT(*) FROM orders WHERE organization_id = $1) as total_orders,
      (SELECT COUNT(*) FROM invoices WHERE organization_id = $1) as total_invoices,
      (SELECT COUNT(*) FROM tickets WHERE organization_id = $1) as total_tickets,
      (SELECT COALESCE(SUM(total_amount), 0) FROM invoices WHERE organization_id = $1) as total_revenue
  `,

  // Get recent clients
  getRecentClients: `
    SELECT id, name, email, company_name, created_at
    FROM clients
    WHERE organization_id = $1
    ORDER BY created_at DESC
    LIMIT 5
  `,

  // Get recent projects
  getRecentProjects: `
    SELECT id, name, status, budget, created_at
    FROM projects
    WHERE organization_id = $1
    ORDER BY created_at DESC
    LIMIT 5
  `,

  // Get recent orders
  getRecentOrders: `
    SELECT id, order_number, total_amount, status, created_at
    FROM orders
    WHERE organization_id = $1
    ORDER BY created_at DESC
    LIMIT 5
  `,

  // === REVENUE ANALYTICS QUERIES ===

  // Get revenue analytics
  getRevenueAnalytics: `
    SELECT
      DATE_TRUNC('month', created_at) as period,
      SUM(total_amount) as revenue
    FROM invoices
    WHERE organization_id = $1
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY period DESC
  `,

  // === CLIENT ANALYTICS QUERIES ===

  // Get client analytics
  getClientAnalytics: `
    SELECT
      status,
      COUNT(*) as count
    FROM clients
    WHERE organization_id = $1
    GROUP BY status
  `,

  // === ORDER ANALYTICS QUERIES ===

  // Get order analytics
  getOrderAnalytics: `
    SELECT
      status,
      COUNT(*) as count,
      SUM(total_amount) as total_value
    FROM orders
    WHERE organization_id = $1
    GROUP BY status
  `,

  // === PROJECT ANALYTICS QUERIES ===

  // Get project analytics
  getProjectAnalytics: `
    SELECT
      status,
      COUNT(*) as count,
      SUM(budget) as total_budget
    FROM projects
    WHERE organization_id = $1
    GROUP BY status
  `,

  // === TICKET ANALYTICS QUERIES ===

  // Get ticket analytics
  getTicketAnalytics: `
    SELECT
      status,
      priority,
      COUNT(*) as count
    FROM tickets
    WHERE organization_id = $1
    GROUP BY status, priority
  `
};

module.exports = analyticsQueries;
