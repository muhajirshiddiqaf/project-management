// PDF records queries
const createPDFRecord = `
  INSERT INTO pdf_records (
    organization_id, template_id, quotation_id, invoice_id,
    content, options, file_size, generated_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8
  ) RETURNING *
`;

// PDF templates queries
const getPDFTemplates = `
  SELECT
    pt.*,
    u.name as created_by_name,
    COALESCE(COUNT(pr.id), 0) as usage_count
  FROM pdf_templates pt
  LEFT JOIN users u ON pt.created_by = u.id
  LEFT JOIN pdf_records pr ON pt.id = pr.template_id
  WHERE pt.organization_id = $1
  GROUP BY pt.id, u.name
  ORDER BY pt.created_at DESC
  LIMIT $2 OFFSET $3
`;

const countPDFTemplates = `
  SELECT COUNT(*) as count
  FROM pdf_templates
  WHERE organization_id = $1
`;

const findPDFTemplateById = `
  SELECT
    pt.*,
    u.name as created_by_name
  FROM pdf_templates pt
  LEFT JOIN users u ON pt.created_by = u.id
  WHERE pt.id = $1 AND pt.organization_id = $2
`;

const findPDFTemplateByName = `
  SELECT
    pt.*,
    u.name as created_by_name
  FROM pdf_templates pt
  LEFT JOIN users u ON pt.created_by = u.id
  WHERE pt.name = $1 AND pt.organization_id = $2
`;

const findDefaultPDFTemplate = `
  SELECT
    pt.*,
    u.name as created_by_name
  FROM pdf_templates pt
  LEFT JOIN users u ON pt.created_by = u.id
  WHERE pt.category = $1 AND pt.organization_id = $2 AND pt.is_active = true
  ORDER BY pt.created_at DESC
  LIMIT 1
`;

const createPDFTemplate = `
  INSERT INTO pdf_templates (
    organization_id, name, description, category, html_content,
    css_content, variables, default_options, is_active, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
  ) RETURNING *
`;

const deletePDFTemplate = `
  DELETE FROM pdf_templates
  WHERE id = $1 AND organization_id = $2
  RETURNING *
`;

// Quotation and Invoice queries for PDF generation
const findQuotationById = `
  SELECT
    q.*,
    c.name as client_name,
    c.email as client_email,
    o.name as organization_name,
    o.logo as company_logo,
    o.address as company_address,
    o.phone as company_phone,
    o.email as company_email
  FROM quotations q
  LEFT JOIN clients c ON q.client_id = c.id
  LEFT JOIN organizations o ON q.organization_id = o.id
  WHERE q.id = $1 AND q.organization_id = $2
`;

const findInvoiceById = `
  SELECT
    i.*,
    c.name as client_name,
    c.email as client_email,
    o.name as organization_name,
    o.logo as company_logo,
    o.address as company_address,
    o.phone as company_phone,
    o.email as company_email
  FROM invoices i
  LEFT JOIN clients c ON i.client_id = c.id
  LEFT JOIN organizations o ON i.organization_id = o.id
  WHERE i.id = $1 AND i.organization_id = $2
`;

// PDF statistics queries
const getPDFStatistics = `
  SELECT
    COUNT(*) as total_pdfs,
    COUNT(CASE WHEN template_id IS NOT NULL THEN 1 END) as templated_pdfs,
    COUNT(CASE WHEN quotation_id IS NOT NULL THEN 1 END) as quotation_pdfs,
    COUNT(CASE WHEN invoice_id IS NOT NULL THEN 1 END) as invoice_pdfs,
    COALESCE(AVG(file_size), 0) as average_file_size,
    COALESCE(MIN(file_size), 0) as min_file_size,
    COALESCE(MAX(file_size), 0) as max_file_size,
    COUNT(DISTINCT template_id) as unique_templates_used,
    COUNT(DISTINCT generated_by) as unique_generators,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '1 day' THEN 1 END) as generated_today,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '1 week' THEN 1 END) as generated_this_week,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '1 month' THEN 1 END) as generated_this_month
  FROM pdf_records
  WHERE organization_id = $1
`;

const getPDFTemplateStatistics = `
  SELECT
    pt.name as template_name,
    pt.category,
    COUNT(pr.id) as total_usage,
    COUNT(CASE WHEN pr.created_at >= NOW() - INTERVAL '1 day' THEN 1 END) as used_today,
    COUNT(CASE WHEN pr.created_at >= NOW() - INTERVAL '1 week' THEN 1 END) as used_this_week,
    COUNT(CASE WHEN pr.created_at >= NOW() - INTERVAL '1 month' THEN 1 END) as used_this_month,
    COALESCE(AVG(pr.file_size), 0) as average_file_size,
    COUNT(CASE WHEN pr.quotation_id IS NOT NULL THEN 1 END) as quotation_usage,
    COUNT(CASE WHEN pr.invoice_id IS NOT NULL THEN 1 END) as invoice_usage
  FROM pdf_templates pt
  LEFT JOIN pdf_records pr ON pt.id = pr.template_id
  WHERE pt.organization_id = $1
  GROUP BY pt.id, pt.name, pt.category
  ORDER BY total_usage DESC
`;

module.exports = {
  createPDFRecord,
  getPDFTemplates,
  countPDFTemplates,
  findPDFTemplateById,
  findPDFTemplateByName,
  findDefaultPDFTemplate,
  createPDFTemplate,
  deletePDFTemplate,
  findQuotationById,
  findInvoiceById,
  getPDFStatistics,
  getPDFTemplateStatistics
};
