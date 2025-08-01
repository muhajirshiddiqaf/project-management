const getCompanyConfiguration = `
  SELECT
    id, organization_id, company_name, address, city, state, postal_code, country,
    email, phone, website, tax_number, logo_url, created_at, updated_at
  FROM company_configuration
  WHERE organization_id = $1
  ORDER BY created_at DESC
  LIMIT 1
`;

const createCompanyConfiguration = `
  INSERT INTO company_configuration (
    organization_id, company_name, address, city, state, postal_code, country,
    email, phone, website, tax_number, logo_url
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
  RETURNING *
`;

const updateCompanyConfiguration = `
  UPDATE company_configuration
  SET
    company_name = $2, address = $3, city = $4, state = $5, postal_code = $6,
    country = $7, email = $8, phone = $9, website = $10, tax_number = $11,
    logo_url = $12, updated_at = current_timestamp
  WHERE id = $1
  RETURNING *
`;

const deleteCompanyConfiguration = `
  DELETE FROM company_configuration
  WHERE id = $1
  RETURNING *
`;

module.exports = {
  getCompanyConfiguration,
  createCompanyConfiguration,
  updateCompanyConfiguration,
  deleteCompanyConfiguration
};
