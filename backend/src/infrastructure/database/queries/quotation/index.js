// Quotation CRUD queries
const findAll = `
  SELECT
    q.*,
    p.title as project_title,
    c.name as client_name,
    u.name as created_by_name,
    COALESCE(COUNT(qi.id), 0) as item_count,
    COALESCE(SUM(qi.total), 0) as calculated_total
  FROM quotations q
  LEFT JOIN projects p ON q.project_id = p.id
  LEFT JOIN clients c ON q.client_id = c.id
  LEFT JOIN users u ON q.created_by = u.id
  LEFT JOIN quotation_items qi ON q.id = qi.quotation_id
  WHERE q.organization_id = $1
  GROUP BY q.id, p.title, c.name, u.name
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
    p.title as project_title,
    c.name as client_name,
    u.name as created_by_name,
    approver.name as approved_by_name
  FROM quotations q
  LEFT JOIN projects p ON q.project_id = p.id
  LEFT JOIN clients c ON q.client_id = c.id
  LEFT JOIN users u ON q.created_by = u.id
  LEFT JOIN users approver ON q.approved_by = approver.id
  WHERE q.id = $1 AND q.organization_id = $2
`;

const createQuotation = `
  INSERT INTO quotations (
    organization_id, project_id, client_id, quotation_number, title,
    description, status, valid_until, issue_date, subtotal, tax_rate,
    tax_amount, discount_percentage, discount_amount, total_amount,
    currency, notes, terms_conditions, approved_by, approved_at, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
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
    p.title as project_title,
    c.name as client_name,
    u.name as created_by_name,
    COALESCE(COUNT(qi.id), 0) as item_count,
    COALESCE(SUM(qi.total), 0) as calculated_total
  FROM quotations q
  LEFT JOIN projects p ON q.project_id = p.id
  LEFT JOIN clients c ON q.client_id = c.id
  LEFT JOIN users u ON q.created_by = u.id
  LEFT JOIN quotation_items qi ON q.id = qi.quotation_id
  WHERE q.organization_id = $1
    AND (q.quotation_number ILIKE $2 OR q.title ILIKE $2 OR c.name ILIKE $2)
  GROUP BY q.id, p.title, c.name, u.name
  ORDER BY q.created_at DESC
  LIMIT $3 OFFSET $4
`;

const countSearchQuotations = `
  SELECT COUNT(DISTINCT q.id) as count
  FROM quotations q
  LEFT JOIN clients c ON q.client_id = c.id
  WHERE q.organization_id = $1
    AND (q.quotation_number ILIKE $2 OR q.title ILIKE $2 OR c.name ILIKE $2)
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
    quotation_id, name, description, quantity, unit_price,
    unit_type, tax_rate, discount_percentage, total
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9
  ) RETURNING *
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
    COALESCE(SUM(qi.total), 0) as subtotal,
    COALESCE(SUM(qi.total * qi.tax_rate / 100), 0) as tax_amount,
    COALESCE(SUM(qi.total * qi.discount_percentage / 100), 0) as discount_amount,
    COALESCE(SUM(qi.total * (1 + qi.tax_rate / 100 - qi.discount_percentage / 100)), 0) as total_amount
  FROM quotation_items qi
  JOIN quotations q ON qi.quotation_id = q.id
  WHERE qi.quotation_id = $1 AND q.organization_id = $2
`;

const generateQuotationNumber = `
  SELECT
    'QT-' || TO_CHAR(NOW(), 'YYYYMM') || '-' ||
    LPAD(COALESCE(MAX(SUBSTRING(quotation_number FROM 'QT-\\d{6}-(\\d+)')::integer), 4) + 1, 4, '0') as quotation_number
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
    COALESCE(SUM(total), 0) as total_value,
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
    q.title as quotation_title,
    requester.name as requester_name,
    approver.name as approver_name
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
