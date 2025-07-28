// Quotation module database queries
const quotationQueries = {
  // Find quotation by ID
  findQuotationById: `
    SELECT q.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name
    FROM quotations q
    LEFT JOIN clients c ON q.client_id = c.id
    LEFT JOIN users u ON q.created_by = u.id
    WHERE q.id = $1 AND q.organization_id = $2 AND q.is_active = true
  `,

  // Find quotations by organization
  findQuotationsByOrganization: `
    SELECT q.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name
    FROM quotations q
    LEFT JOIN clients c ON q.client_id = c.id
    LEFT JOIN users u ON q.created_by = u.id
    WHERE q.organization_id = $1 AND q.is_active = true
    ORDER BY q.created_at DESC
  `,

  // Create quotation
  createQuotation: `
    INSERT INTO quotations (id, organization_id, client_id, title, description,
                          subtotal, tax_amount, discount_amount, total_amount,
                          status, valid_until, created_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *
  `,

  // Update quotation
  updateQuotation: `
    UPDATE quotations
    SET title = COALESCE($1, title),
        description = COALESCE($2, description),
        subtotal = COALESCE($3, subtotal),
        tax_amount = COALESCE($4, tax_amount),
        discount_amount = COALESCE($5, discount_amount),
        total_amount = COALESCE($6, total_amount),
        status = COALESCE($7, status),
        valid_until = COALESCE($8, valid_until),
        updated_at = NOW()
    WHERE id = $9 AND organization_id = $10
    RETURNING *
  `,

  // Delete quotation (soft delete)
  deleteQuotation: `
    UPDATE quotations
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2
  `,

  // Get quotation statistics
  getQuotationStatistics: `
    SELECT
      COUNT(*) as total_quotations,
      COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_quotations,
      COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent_quotations,
      COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted_quotations,
      COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_quotations,
      COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired_quotations,
      SUM(total_amount) as total_quotation_amount,
      AVG(total_amount) as avg_quotation_amount,
      SUM(CASE WHEN status = 'accepted' THEN total_amount ELSE 0 END) as accepted_amount
    FROM quotations
    WHERE organization_id = $1 AND is_active = true
  `,

  // Search quotations
  searchQuotations: `
    SELECT q.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name
    FROM quotations q
    LEFT JOIN clients c ON q.client_id = c.id
    LEFT JOIN users u ON q.created_by = u.id
    WHERE q.organization_id = $1 AND q.is_active = true
    AND (
      LOWER(q.title) LIKE LOWER($2) OR
      LOWER(q.description) LIKE LOWER($2) OR
      LOWER(c.name) LIKE LOWER($2)
    )
    ORDER BY q.created_at DESC
  `,

  // Get quotations by status
  getQuotationsByStatus: `
    SELECT q.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name
    FROM quotations q
    LEFT JOIN clients c ON q.client_id = c.id
    LEFT JOIN users u ON q.created_by = u.id
    WHERE q.organization_id = $1 AND q.status = $2 AND q.is_active = true
    ORDER BY q.created_at DESC
  `,

  // Get quotations by client
  getQuotationsByClient: `
    SELECT q.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name
    FROM quotations q
    LEFT JOIN clients c ON q.client_id = c.id
    LEFT JOIN users u ON q.created_by = u.id
    WHERE q.organization_id = $1 AND q.client_id = $2 AND q.is_active = true
    ORDER BY q.created_at DESC
  `,

  // Get quotation items
  getQuotationItems: `
    SELECT qi.*, s.name as service_name, s.description as service_description
    FROM quotation_items qi
    LEFT JOIN services s ON qi.service_id = s.id
    WHERE qi.quotation_id = $1 AND qi.organization_id = $2 AND qi.is_active = true
    ORDER BY qi.created_at ASC
  `,

  // Create quotation item
  createQuotationItem: `
    INSERT INTO quotation_items (id, organization_id, quotation_id, service_id, description,
                               quantity, unit_price, total_price)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `,

  // Update quotation item
  updateQuotationItem: `
    UPDATE quotation_items
    SET service_id = COALESCE($1, service_id),
        description = COALESCE($2, description),
        quantity = COALESCE($3, quantity),
        unit_price = COALESCE($4, unit_price),
        total_price = COALESCE($5, total_price),
        updated_at = NOW()
    WHERE id = $6 AND organization_id = $7
    RETURNING *
  `,

  // Delete quotation item
  deleteQuotationItem: `
    UPDATE quotation_items
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2
  `,

  // Get quotation templates
  getQuotationTemplates: `
    SELECT * FROM quotation_templates
    WHERE organization_id = $1 AND is_active = true
    ORDER BY created_at DESC
  `,

  // Create quotation template
  createQuotationTemplate: `
    INSERT INTO quotation_templates (id, organization_id, name, description, content,
                                   header_template, footer_template, terms_conditions)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `,

  // Update quotation template
  updateQuotationTemplate: `
    UPDATE quotation_templates
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

  // Delete quotation template
  deleteQuotationTemplate: `
    UPDATE quotation_templates
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2
  `,

  // Get quotation history
  getQuotationHistory: `
    SELECT * FROM quotation_history
    WHERE quotation_id = $1 AND organization_id = $2 AND is_active = true
    ORDER BY created_at DESC
  `,

  // Create quotation history
  createQuotationHistory: `
    INSERT INTO quotation_history (id, organization_id, quotation_id, action, description,
                                 performed_by, old_values, new_values)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `,

  // Get quotation dashboard data
  getQuotationDashboardData: `
    SELECT
      q.id,
      q.title,
      q.status,
      q.total_amount,
      q.created_at,
      q.valid_until,
      c.name as client_name,
      u.first_name || ' ' || u.last_name as created_by_name,
      COUNT(qi.id) as total_items,
      SUM(qi.total_price) as items_total
    FROM quotations q
    LEFT JOIN clients c ON q.client_id = c.id
    LEFT JOIN users u ON q.created_by = u.id
    LEFT JOIN quotation_items qi ON q.id = qi.quotation_id AND qi.is_active = true
    WHERE q.organization_id = $1 AND q.is_active = true
    GROUP BY q.id, q.title, q.status, q.total_amount, q.created_at, q.valid_until,
             c.name, u.first_name, u.last_name
    ORDER BY q.created_at DESC
  `,

  // Get quotation timeline
  getQuotationTimeline: `
    SELECT
      'item' as type,
      qi.id,
      qi.description as title,
      qi.created_at as date,
      'added' as status,
      NULL as performed_by_name
    FROM quotation_items qi
    WHERE qi.quotation_id = $1 AND qi.organization_id = $2 AND qi.is_active = true

    UNION ALL

    SELECT
      'history' as type,
      qh.id,
      qh.action as title,
      qh.created_at as date,
      qh.description as status,
      u.first_name || ' ' || u.last_name as performed_by_name
    FROM quotation_history qh
    LEFT JOIN users u ON qh.performed_by = u.id
    WHERE qh.quotation_id = $1 AND qh.organization_id = $2 AND qh.is_active = true

    ORDER BY date DESC
  `,

  // Update quotation status
  updateQuotationStatus: `
    UPDATE quotations
    SET status = $1, updated_at = NOW()
    WHERE id = $2 AND organization_id = $3
    RETURNING *
  `,

  // Get expired quotations
  getExpiredQuotations: `
    SELECT q.*, c.name as client_name, c.email as client_email
    FROM quotations q
    LEFT JOIN clients c ON q.client_id = c.id
    WHERE q.organization_id = $1 AND q.valid_until < NOW()
    AND q.status IN ('draft', 'sent') AND q.is_active = true
    ORDER BY q.valid_until ASC
  `,

  // Get quotation conversion rate
  getQuotationConversionRate: `
    SELECT
      COUNT(*) as total_sent,
      COUNT(CASE WHEN status = 'accepted' THEN 1 END) as total_accepted,
      ROUND(
        (COUNT(CASE WHEN status = 'accepted' THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL) * 100, 2
      ) as conversion_rate
    FROM quotations
    WHERE organization_id = $1 AND status IN ('sent', 'accepted', 'rejected')
    AND is_active = true
  `
};

module.exports = quotationQueries;
