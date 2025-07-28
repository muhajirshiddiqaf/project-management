// === INVOICE CRUD QUERIES ===

const findAll = `
  SELECT i.*,
         c.name as client_name,
         c.email as client_email,
         p.title as project_title,
         u.first_name || ' ' || u.last_name as created_by_name
  FROM invoices i
  LEFT JOIN clients c ON i.client_id = c.id
  LEFT JOIN projects p ON i.project_id = p.id
  LEFT JOIN users u ON i.created_by = u.id
  WHERE i.organization_id = $1 AND i.is_active = true
    AND ($2::text IS NULL OR i.status = $2)
    AND ($3::uuid IS NULL OR i.client_id = $3)
    AND ($4::uuid IS NULL OR i.project_id = $4)
    AND ($5::text IS NULL OR i.payment_method = $5)
    AND ($6::uuid IS NULL OR i.created_by = $6)
  ORDER BY i.${sortBy} ${sortOrder}
  LIMIT $7 OFFSET $8
`;

const countInvoices = `
  SELECT COUNT(*) FROM invoices
  WHERE organization_id = $1 AND is_active = true
    AND ($2::text IS NULL OR status = $2)
    AND ($3::uuid IS NULL OR client_id = $3)
    AND ($4::uuid IS NULL OR project_id = $4)
    AND ($5::text IS NULL OR payment_method = $5)
    AND ($6::uuid IS NULL OR created_by = $6)
`;

const findInvoiceById = `
  SELECT i.*,
         c.name as client_name,
         c.email as client_email,
         p.title as project_title,
         u.first_name || ' ' || u.last_name as created_by_name
  FROM invoices i
  LEFT JOIN clients c ON i.client_id = c.id
  LEFT JOIN projects p ON i.project_id = p.id
  LEFT JOIN users u ON i.created_by = u.id
  WHERE i.id = $1 AND i.organization_id = $2 AND i.is_active = true
`;

const createInvoice = `
  INSERT INTO invoices (
    project_id, client_id, invoice_number, title, description,
    status, due_date, issue_date, payment_terms, subtotal,
    tax_rate, tax_amount, discount_percentage, discount_amount,
    total_amount, currency, notes, payment_method, payment_reference,
    organization_id, created_by
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
  RETURNING *
`;

const deleteInvoice = `
  UPDATE invoices
  SET is_active = false, updated_at = NOW()
  WHERE id = $1 AND organization_id = $2 AND is_active = true
  RETURNING *
`;

const searchInvoices = `
  SELECT i.*,
         c.name as client_name,
         c.email as client_email,
         p.title as project_title,
         u.first_name || ' ' || u.last_name as created_by_name
  FROM invoices i
  LEFT JOIN clients c ON i.client_id = c.id
  LEFT JOIN projects p ON i.project_id = p.id
  LEFT JOIN users u ON i.created_by = u.id
  WHERE i.organization_id = $1 AND i.is_active = true
    AND (
      i.title ILIKE $2 OR
      i.description ILIKE $2 OR
      i.invoice_number ILIKE $2 OR
      c.name ILIKE $2 OR
      c.email ILIKE $2
    )
  ORDER BY i.${sortBy} ${sortOrder}
  LIMIT $3 OFFSET $4
`;

const countSearchInvoices = `
  SELECT COUNT(*) FROM invoices i
  LEFT JOIN clients c ON i.client_id = c.id
  WHERE i.organization_id = $1 AND i.is_active = true
    AND (
      i.title ILIKE $2 OR
      i.description ILIKE $2 OR
      i.invoice_number ILIKE $2 OR
      c.name ILIKE $2 OR
      c.email ILIKE $2
    )
`;

const updateInvoiceStatus = `
  UPDATE invoices
  SET status = $3, payment_date = $4, payment_method = $5,
      payment_reference = $6, notes = $7, updated_at = NOW()
  WHERE id = $1 AND organization_id = $2 AND is_active = true
  RETURNING *
`;

// === INVOICE ITEMS QUERIES ===

const getInvoiceItems = `
  SELECT * FROM invoice_items
  WHERE invoice_id = $1 AND organization_id = $2 AND is_active = true
  ORDER BY created_at ASC
  LIMIT $3 OFFSET $4
`;

const countInvoiceItems = `
  SELECT COUNT(*) FROM invoice_items
  WHERE invoice_id = $1 AND organization_id = $2 AND is_active = true
`;

const findInvoiceItemById = `
  SELECT * FROM invoice_items
  WHERE id = $1 AND organization_id = $2 AND is_active = true
`;

const createInvoiceItem = `
  INSERT INTO invoice_items (
    invoice_id, name, description, quantity, unit_price,
    unit_type, tax_rate, discount_percentage, total, organization_id
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  RETURNING *
`;

const deleteInvoiceItem = `
  UPDATE invoice_items
  SET is_active = false, updated_at = NOW()
  WHERE id = $1 AND organization_id = $2 AND is_active = true
  RETURNING *
`;

// === PAYMENT INTEGRATION QUERIES ===

const createPayment = `
  INSERT INTO payments (
    invoice_id, payment_method, amount, currency, payment_reference,
    transaction_id, payment_date, notes, organization_id
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  RETURNING *
`;

const verifyPayment = `
  SELECT * FROM payments
  WHERE invoice_id = $1 AND organization_id = $2
    AND transaction_id = $3 AND payment_method = $4
  ORDER BY created_at DESC
  LIMIT 1
`;

// === INVOICE STATISTICS QUERIES ===

const getInvoiceStatistics = `
  SELECT
    COUNT(*) as total_invoices,
    COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_invoices,
    COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent_invoices,
    COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_invoices,
    COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_invoices,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_invoices,
    SUM(total_amount) as total_amount,
    AVG(total_amount) as avg_amount,
    SUM(CASE WHEN status = 'paid' THEN total_amount END) as total_paid_amount,
    SUM(CASE WHEN status = 'overdue' THEN total_amount END) as total_overdue_amount,
    AVG(CASE WHEN status = 'paid' THEN EXTRACT(EPOCH FROM (payment_date - issue_date))/86400 END) as avg_payment_days
  FROM invoices
  WHERE organization_id = $1 AND is_active = true
`;

const getPaymentStatistics = `
  SELECT
    COUNT(*) as total_payments,
    COUNT(CASE WHEN payment_method = 'bank_transfer' THEN 1 END) as bank_transfer_payments,
    COUNT(CASE WHEN payment_method = 'credit_card' THEN 1 END) as credit_card_payments,
    COUNT(CASE WHEN payment_method = 'cash' THEN 1 END) as cash_payments,
    COUNT(CASE WHEN payment_method = 'check' THEN 1 END) as check_payments,
    COUNT(CASE WHEN payment_method = 'paypal' THEN 1 END) as paypal_payments,
    COUNT(CASE WHEN payment_method = 'stripe' THEN 1 END) as stripe_payments,
    SUM(amount) as total_payment_amount,
    AVG(amount) as avg_payment_amount,
    SUM(CASE WHEN payment_method = 'bank_transfer' THEN amount END) as bank_transfer_amount,
    SUM(CASE WHEN payment_method = 'credit_card' THEN amount END) as credit_card_amount,
    SUM(CASE WHEN payment_method = 'cash' THEN amount END) as cash_amount,
    SUM(CASE WHEN payment_method = 'check' THEN amount END) as check_amount,
    SUM(CASE WHEN payment_method = 'paypal' THEN amount END) as paypal_amount,
    SUM(CASE WHEN payment_method = 'stripe' THEN amount END) as stripe_amount
  FROM payments
  WHERE organization_id = $1 AND is_active = true
`;

module.exports = {
  // Invoice CRUD
  findAll,
  countInvoices,
  findInvoiceById,
  createInvoice,
  deleteInvoice,
  searchInvoices,
  countSearchInvoices,
  updateInvoiceStatus,

  // Invoice Items
  getInvoiceItems,
  countInvoiceItems,
  findInvoiceItemById,
  createInvoiceItem,
  deleteInvoiceItem,

  // Payment Integration
  createPayment,
  verifyPayment,

  // Invoice Statistics
  getInvoiceStatistics,
  getPaymentStatistics
};
