// Quotation CRUD queries
const findAll = `
  SELECT
    q.*,
    p.name as project_title,
    c.name as client_name,
    CONCAT(u.first_name, ' ', u.last_name) as created_by_name,
    COALESCE(COUNT(qi.id), 0) as item_count,
    COALESCE(SUM(qi.total_price), 0) as calculated_total
  FROM quotations q
  LEFT JOIN projects p ON q.project_id = p.id
  LEFT JOIN clients c ON q.client_id = c.id
  LEFT JOIN users u ON q.created_by = u.id
  LEFT JOIN quotation_items qi ON q.id = qi.quotation_id
  WHERE q.organization_id = $1
  GROUP BY q.id, p.name, c.name, u.first_name, u.last_name
  ORDER BY q.created_at DESC
  LIMIT $2 OFFSET $3
`;

const countQuotations = `
  SELECT COUNT(*) as count
  FROM quotations
  WHERE organization_id = $1
`;

const findQuotationById = `
  SELECT
    q.*,
    p.name as project_title,
    c.name as client_name,
    CONCAT(u.first_name, ' ', u.last_name) as created_by_name,
    CONCAT(approver.first_name, ' ', approver.last_name) as approved_by_name
  FROM quotations q
  LEFT JOIN projects p ON q.project_id = p.id
  LEFT JOIN clients c ON q.client_id = c.id
  LEFT JOIN users u ON q.created_by = u.id
  LEFT JOIN users approver ON q.approved_by = approver.id
  WHERE q.id = $1 AND q.organization_id = $2
`;

const createQuotation = `
  INSERT INTO quotations (
    organization_id, project_id, client_id, quotation_number, subject,
    description, status, valid_until, due_date, reference, subtotal, tax_rate,
    tax_amount, discount_rate, discount_amount, total_amount,
    currency, notes, terms_conditions, approved_by, approved_at, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
  ) RETURNING *
`;

const deleteQuotation = `
  DELETE FROM quotations
  WHERE id = $1 AND organization_id = $2
  RETURNING *
`;

const searchQuotations = `
  SELECT
    q.*,
    p.name as project_title,
    c.name as client_name,
    CONCAT(u.first_name, ' ', u.last_name) as created_by_name,
    COALESCE(COUNT(qi.id), 0) as item_count,
    COALESCE(SUM(qi.total_price), 0) as calculated_total
  FROM quotations q
  LEFT JOIN projects p ON q.project_id = p.id
  LEFT JOIN clients c ON q.client_id = c.id
  LEFT JOIN users u ON q.created_by = u.id
  LEFT JOIN quotation_items qi ON q.id = qi.quotation_id
  WHERE q.organization_id = $1
    AND (q.quotation_number ILIKE $2 OR q.subject ILIKE $2 OR c.name ILIKE $2)
  GROUP BY q.id, p.name, c.name, u.first_name, u.last_name
  ORDER BY q.created_at DESC
  LIMIT $3 OFFSET $4
`;

const countSearchQuotations = `
  SELECT COUNT(DISTINCT q.id) as count
  FROM quotations q
  LEFT JOIN clients c ON q.client_id = c.id
  WHERE q.organization_id = $1
    AND (q.quotation_number ILIKE $2 OR q.subject ILIKE $2 OR c.name ILIKE $2)
`;

const updateQuotationStatus = `
  UPDATE quotations
  SET status = $1, approved_by = $2, approved_at = CASE WHEN $2 IS NOT NULL THEN NOW() ELSE NULL END, updated_at = NOW()
  WHERE id = $3 AND organization_id = $4
  RETURNING *
`;

const approveQuotation = `
  UPDATE quotations
  SET status = 'approved', approved_by = $1, approved_at = NOW(), updated_at = NOW()
  WHERE id = $2 AND organization_id = $3
  RETURNING *
`;

// Quotation items queries
const getQuotationItems = `
  SELECT qi.*
  FROM quotation_items qi
  JOIN quotations q ON qi.quotation_id = q.id
  WHERE qi.quotation_id = $1 AND q.organization_id = $2
  ORDER BY qi.created_at ASC
`;

const countQuotationItems = `
  SELECT COUNT(*) as count
  FROM quotation_items qi
  JOIN quotations q ON qi.quotation_id = q.id
  WHERE qi.quotation_id = $1 AND q.organization_id = $2
`;

const findQuotationItemById = `
  SELECT qi.*
  FROM quotation_items qi
  JOIN quotations q ON qi.quotation_id = q.id
  WHERE qi.id = $1 AND qi.quotation_id = $2 AND q.organization_id = $3
`;

const createQuotationItem = `
  INSERT INTO quotation_items (
    quotation_id, item_name, description, quantity, unit_price,
    unit_type, total_price, sort_order
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8
  ) RETURNING *
`;

const updateQuotationItem = `
  UPDATE quotation_items qi
  SET
    item_name = COALESCE($4, qi.item_name),
    description = COALESCE($5, qi.description),
    quantity = COALESCE($6, qi.quantity),
    unit_price = COALESCE($7, qi.unit_price),
    unit_type = COALESCE($8, qi.unit_type),
    total_price = COALESCE($9, qi.total_price),
    sort_order = COALESCE($10, qi.sort_order),
    updated_at = NOW()
  FROM quotations q
  WHERE qi.quotation_id = q.id
    AND qi.id = $1
    AND qi.quotation_id = $2
    AND q.organization_id = $3
  RETURNING qi.*
`;

const deleteQuotationItem = `
  DELETE FROM quotation_items qi
  USING quotations q
  WHERE qi.quotation_id = q.id
    AND qi.id = $1
    AND qi.quotation_id = $2
    AND q.organization_id = $3
  RETURNING qi.*
`;

// Quotation calculation queries
const calculateQuotationTotals = `
  SELECT
    COALESCE(SUM(qi.total_price), 0) as subtotal,
    COALESCE(SUM(qi.total_price * q.tax_rate / 100), 0) as tax_amount,
    COALESCE(SUM(qi.total_price * q.discount_rate / 100), 0) as discount_amount,
    COALESCE(SUM(qi.total_price * (1 + q.tax_rate / 100 - q.discount_rate / 100)), 0) as total_amount
  FROM quotation_items qi
  JOIN quotations q ON qi.quotation_id = q.id
  WHERE qi.quotation_id = $1 AND q.organization_id = $2
`;

const generateQuotationNumber = `
  SELECT
    'QT-' || TO_CHAR(NOW(), 'YYYYMM') || '-' ||
    TO_CHAR(COALESCE(MAX(SUBSTRING(quotation_number FROM 'QT-\\d{6}-(\\d+)')::integer), 0) + 1, 'FM0000') as quotation_number
  FROM quotations
  WHERE organization_id = $1
    AND quotation_number LIKE 'QT-' || TO_CHAR(NOW(), 'YYYYMM') || '-%'
`;

// Quotation statistics queries
const getQuotationStatistics = `
  SELECT
    COUNT(*) as total_quotations,
    COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_quotations,
    COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent_quotations,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_quotations,
    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_quotations,
    COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired_quotations,
    COALESCE(SUM(total_amount), 0) as total_value,
    COALESCE(AVG(total_amount), 0) as average_value,
    COUNT(CASE WHEN valid_until < NOW() AND status IN ('draft', 'sent') THEN 1 END) as expired_count
  FROM quotations
  WHERE organization_id = $1
`;

const getQuotationItemsStatistics = `
  SELECT
    COUNT(*) as total_items,
    COALESCE(SUM(quantity), 0) as total_quantity,
    COALESCE(SUM(total_price), 0) as total_value,
    COALESCE(AVG(unit_price), 0) as average_unit_price,
    COUNT(DISTINCT unit_type) as unique_unit_types
  FROM quotation_items qi
  JOIN quotations q ON qi.quotation_id = q.id
  WHERE q.organization_id = $1
`;

// Quotation templates queries
const getQuotationTemplates = `
  SELECT * FROM quotation_templates
  WHERE organization_id = $1
  ORDER BY created_at DESC
  LIMIT $2 OFFSET $3
`;

const countQuotationTemplates = `
  SELECT COUNT(*) as count
  FROM quotation_templates
  WHERE organization_id = $1
`;

const findQuotationTemplateById = `
  SELECT * FROM quotation_templates
  WHERE id = $1 AND organization_id = $2
`;

const createQuotationTemplate = `
  INSERT INTO quotation_templates (
    organization_id, name, description, content, header_template,
    footer_template, terms_conditions, is_default, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9
  ) RETURNING *
`;

const deleteQuotationTemplate = `
  DELETE FROM quotation_templates
  WHERE id = $1 AND organization_id = $2
  RETURNING *
`;

// Quotation approval workflow queries
const createApprovalRequest = `
  INSERT INTO quotation_approval_requests (
    quotation_id, requester_id, approver_id, comments, organization_id
  ) VALUES (
    $1, $2, $3, $4, $5
  ) RETURNING *
`;

const getApprovalRequests = `
  SELECT
    ar.*,
    q.quotation_number,
    q.subject as quotation_title,
    CONCAT(requester.first_name, ' ', requester.last_name) as requester_name,
    CONCAT(approver.first_name, ' ', approver.last_name) as approver_name
  FROM quotation_approval_requests ar
  LEFT JOIN quotations q ON ar.quotation_id = q.id
  LEFT JOIN users requester ON ar.requester_id = requester.id
  LEFT JOIN users approver ON ar.approver_id = approver.id
  WHERE ar.organization_id = $1
  ORDER BY ar.created_at DESC
  LIMIT $2 OFFSET $3
`;

const countApprovalRequests = `
  SELECT COUNT(*) as count
  FROM quotation_approval_requests
  WHERE organization_id = $1
`;

const processApprovalRequest = `
  UPDATE quotation_approval_requests
  SET status = $1, comments = $2, processed_by = $3, processed_at = NOW(), updated_at = NOW()
  WHERE id = $4 AND organization_id = $5
  RETURNING *
`;

module.exports = {
  findAll,
  countQuotations,
  findQuotationById,
  createQuotation,
  deleteQuotation,
  searchQuotations,
  countSearchQuotations,
  updateQuotationStatus,
  approveQuotation,
  getQuotationItems,
  countQuotationItems,
  findQuotationItemById,
  createQuotationItem,
  updateQuotationItem,
  deleteQuotationItem,
  calculateQuotationTotals,
  generateQuotationNumber,
  getQuotationStatistics,
  getQuotationItemsStatistics,
  getQuotationTemplates,
  countQuotationTemplates,
  findQuotationTemplateById,
  createQuotationTemplate,
  deleteQuotationTemplate,
  createApprovalRequest,
  getApprovalRequests,
  countApprovalRequests,
  processApprovalRequest
};
