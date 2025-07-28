// Invoice module database queries
const invoiceQueries = {
  // Find invoice by ID
  findInvoiceById: `
    SELECT i.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name
    FROM invoices i
    LEFT JOIN clients c ON i.client_id = c.id
    LEFT JOIN users u ON i.created_by = u.id
    WHERE i.id = $1 AND i.organization_id = $2 AND i.is_active = true
  `,

  // Find invoices by organization
  findInvoicesByOrganization: `
    SELECT i.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name
    FROM invoices i
    LEFT JOIN clients c ON i.client_id = c.id
    LEFT JOIN users u ON i.created_by = u.id
    WHERE i.organization_id = $1 AND i.is_active = true
    ORDER BY i.created_at DESC
  `,

  // Create invoice
  createInvoice: `
    INSERT INTO invoices (id, organization_id, client_id, invoice_number, title,
                        subtotal, tax_amount, discount_amount, total_amount,
                        status, due_date, created_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *
  `,

  // Update invoice
  updateInvoice: `
    UPDATE invoices
    SET title = COALESCE($1, title),
        subtotal = COALESCE($2, subtotal),
        tax_amount = COALESCE($3, tax_amount),
        discount_amount = COALESCE($4, discount_amount),
        total_amount = COALESCE($5, total_amount),
        status = COALESCE($6, status),
        due_date = COALESCE($7, due_date),
        updated_at = NOW()
    WHERE id = $8 AND organization_id = $9
    RETURNING *
  `,

  // Delete invoice (soft delete)
  deleteInvoice: `
    UPDATE invoices
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2
  `,

  // Get invoice statistics
  getInvoiceStatistics: `
    SELECT
      COUNT(*) as total_invoices,
      COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_invoices,
      COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent_invoices,
      COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_invoices,
      COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_invoices,
      COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_invoices,
      SUM(total_amount) as total_invoice_amount,
      AVG(total_amount) as avg_invoice_amount,
      SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END) as paid_amount,
      SUM(CASE WHEN status = 'overdue' THEN total_amount ELSE 0 END) as overdue_amount
    FROM invoices
    WHERE organization_id = $1 AND is_active = true
  `,

  // Search invoices
  searchInvoices: `
    SELECT i.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name
    FROM invoices i
    LEFT JOIN clients c ON i.client_id = c.id
    LEFT JOIN users u ON i.created_by = u.id
    WHERE i.organization_id = $1 AND i.is_active = true
    AND (
      LOWER(i.title) LIKE LOWER($2) OR
      LOWER(i.invoice_number) LIKE LOWER($2) OR
      LOWER(c.name) LIKE LOWER($2)
    )
    ORDER BY i.created_at DESC
  `,

  // Get invoices by status
  getInvoicesByStatus: `
    SELECT i.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name
    FROM invoices i
    LEFT JOIN clients c ON i.client_id = c.id
    LEFT JOIN users u ON i.created_by = u.id
    WHERE i.organization_id = $1 AND i.status = $2 AND i.is_active = true
    ORDER BY i.created_at DESC
  `,

  // Get invoices by client
  getInvoicesByClient: `
    SELECT i.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name
    FROM invoices i
    LEFT JOIN clients c ON i.client_id = c.id
    LEFT JOIN users u ON i.created_by = u.id
    WHERE i.organization_id = $1 AND i.client_id = $2 AND i.is_active = true
    ORDER BY i.created_at DESC
  `,

  // Get invoice items
  getInvoiceItems: `
    SELECT ii.*, s.name as service_name, s.description as service_description
    FROM invoice_items ii
    LEFT JOIN services s ON ii.service_id = s.id
    WHERE ii.invoice_id = $1 AND ii.organization_id = $2 AND ii.is_active = true
    ORDER BY ii.created_at ASC
  `,

  // Create invoice item
  createInvoiceItem: `
    INSERT INTO invoice_items (id, organization_id, invoice_id, service_id, description,
                             quantity, unit_price, total_price)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `,

  // Update invoice item
  updateInvoiceItem: `
    UPDATE invoice_items
    SET service_id = COALESCE($1, service_id),
        description = COALESCE($2, description),
        quantity = COALESCE($3, quantity),
        unit_price = COALESCE($4, unit_price),
        total_price = COALESCE($5, total_price),
        updated_at = NOW()
    WHERE id = $6 AND organization_id = $7
    RETURNING *
  `,

  // Delete invoice item
  deleteInvoiceItem: `
    UPDATE invoice_items
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2
  `,

  // Get invoice payments
  getInvoicePayments: `
    SELECT * FROM invoice_payments
    WHERE invoice_id = $1 AND organization_id = $2 AND is_active = true
    ORDER BY created_at DESC
  `,

  // Create invoice payment
  createInvoicePayment: `
    INSERT INTO invoice_payments (id, organization_id, invoice_id, payment_method,
                                amount, transaction_id, payment_date, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `,

  // Update invoice payment
  updateInvoicePayment: `
    UPDATE invoice_payments
    SET payment_method = COALESCE($1, payment_method),
        amount = COALESCE($2, amount),
        transaction_id = COALESCE($3, transaction_id),
        payment_date = COALESCE($4, payment_date),
        status = COALESCE($5, status),
        updated_at = NOW()
    WHERE id = $6 AND organization_id = $7
    RETURNING *
  `,

  // Delete invoice payment
  deleteInvoicePayment: `
    UPDATE invoice_payments
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2
  `,

  // Get invoice templates
  getInvoiceTemplates: `
    SELECT * FROM invoice_templates
    WHERE organization_id = $1 AND is_active = true
    ORDER BY created_at DESC
  `,

  // Create invoice template
  createInvoiceTemplate: `
    INSERT INTO invoice_templates (id, organization_id, name, description, content,
                                 header_template, footer_template, terms_conditions)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `,

  // Update invoice template
  updateInvoiceTemplate: `
    UPDATE invoice_templates
    SET name = COALESCE($1, name),
        description = COALESCE($2, description),
        content = COALESCE($3, content),
        header_template = COALESCE($4, header_template),
        footer_template = COALESCE($5, footer_template),
        terms_conditions = COALESCE($6, terms_conditions),
        updated_at = NOW()
    WHERE id = $7 AND organization_id = $8
    RETURNING *
  `,

  // Delete invoice template
  deleteInvoiceTemplate: `
    UPDATE invoice_templates
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2
  `,

  // Get invoice history
  getInvoiceHistory: `
    SELECT ih.*, u.first_name || ' ' || u.last_name as performed_by_name
    FROM invoice_history ih
    LEFT JOIN users u ON ih.performed_by = u.id
    WHERE ih.invoice_id = $1 AND ih.organization_id = $2 AND ih.is_active = true
    ORDER BY ih.created_at DESC
  `,

  // Create invoice history
  createInvoiceHistory: `
    INSERT INTO invoice_history (id, organization_id, invoice_id, action, description,
                               performed_by, old_values, new_values)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `,

  // Get invoice dashboard data
  getInvoiceDashboardData: `
    SELECT
      i.id,
      i.invoice_number,
      i.title,
      i.status,
      i.total_amount,
      i.created_at,
      i.due_date,
      c.name as client_name,
      u.first_name || ' ' || u.last_name as created_by_name,
      COUNT(ii.id) as total_items,
      SUM(ii.total_price) as items_total
    FROM invoices i
    LEFT JOIN clients c ON i.client_id = c.id
    LEFT JOIN users u ON i.created_by = u.id
    LEFT JOIN invoice_items ii ON i.id = ii.invoice_id AND ii.is_active = true
    WHERE i.organization_id = $1 AND i.is_active = true
    GROUP BY i.id, i.invoice_number, i.title, i.status, i.total_amount, i.created_at,
             i.due_date, c.name, u.first_name, u.last_name
    ORDER BY i.created_at DESC
  `,

  // Get invoice timeline
  getInvoiceTimeline: `
    SELECT
      'item' as type,
      ii.id,
      ii.description as title,
      ii.created_at as date,
      'added' as status,
      NULL as performed_by_name
    FROM invoice_items ii
    WHERE ii.invoice_id = $1 AND ii.organization_id = $2 AND ii.is_active = true

    UNION ALL

    SELECT
      'payment' as type,
      ip.id,
      ip.payment_method as title,
      ip.payment_date as date,
      ip.status,
      NULL as performed_by_name
    FROM invoice_payments ip
    WHERE ip.invoice_id = $1 AND ip.organization_id = $2 AND ip.is_active = true

    UNION ALL

    SELECT
      'history' as type,
      ih.id,
      ih.action as title,
      ih.created_at as date,
      ih.description as status,
      u.first_name || ' ' || u.last_name as performed_by_name
    FROM invoice_history ih
    LEFT JOIN users u ON ih.performed_by = u.id
    WHERE ih.invoice_id = $1 AND ih.organization_id = $2 AND ih.is_active = true

    ORDER BY date DESC
  `,

  // Update invoice status
  updateInvoiceStatus: `
    UPDATE invoices
    SET status = $1, updated_at = NOW()
    WHERE id = $2 AND organization_id = $3
    RETURNING *
  `,

  // Get overdue invoices
  getOverdueInvoices: `
    SELECT i.*, c.name as client_name, c.email as client_email
    FROM invoices i
    LEFT JOIN clients c ON i.client_id = c.id
    WHERE i.organization_id = $1 AND i.due_date < NOW()
    AND i.status IN ('sent', 'draft') AND i.is_active = true
    ORDER BY i.due_date ASC
  `,

  // Get invoice revenue by period
  getInvoiceRevenueByPeriod: `
    SELECT
      DATE_TRUNC('month', created_at) as period,
      COUNT(*) as invoice_count,
      SUM(total_amount) as revenue,
      AVG(total_amount) as avg_invoice_value,
      SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END) as paid_revenue
    FROM invoices
    WHERE organization_id = $1 AND is_active = true
    AND created_at >= $2 AND created_at <= $3
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY period DESC
  `,

  // Get next invoice number
  getNextInvoiceNumber: `
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM '[0-9]+') AS INTEGER)), 0) + 1 as next_number
    FROM invoices
    WHERE organization_id = $1 AND is_active = true
  `,

  // Get invoice aging report
  getInvoiceAgingReport: `
    SELECT
      client_id,
      c.name as client_name,
      COUNT(*) as total_invoices,
      SUM(total_amount) as total_amount,
      SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END) as paid_amount,
      SUM(CASE WHEN status = 'sent' AND due_date < NOW() THEN total_amount ELSE 0 END) as overdue_amount,
      SUM(CASE WHEN status = 'sent' AND due_date >= NOW() THEN total_amount ELSE 0 END) as current_amount
    FROM invoices i
    LEFT JOIN clients c ON i.client_id = c.id
    WHERE i.organization_id = $1 AND i.is_active = true
    GROUP BY client_id, c.name
    ORDER BY overdue_amount DESC
  `,

  // Get invoice collection rate
  getInvoiceCollectionRate: `
    SELECT
      COUNT(*) as total_invoices,
      COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_invoices,
      ROUND(
        (COUNT(CASE WHEN status = 'paid' THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL) * 100, 2
      ) as collection_rate
    FROM invoices
    WHERE organization_id = $1 AND is_active = true
  `
};

module.exports = invoiceQueries;
