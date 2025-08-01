const companyConfigurationQueries = require('../database/queries/companyConfiguration');

class CompanyConfigurationRepository {
  constructor(db) {
    this.db = db;
  }

  async getByOrganizationId(organizationId) {
    try {
      const result = await this.db.query(companyConfigurationQueries.getCompanyConfiguration, [organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error getting company configuration: ${error.message}`);
    }
  }

  async create(configurationData) {
    try {
      const {
        organization_id, company_name, address, city, state, postal_code, country,
        email, phone, website, tax_number, logo_url
      } = configurationData;

      const values = [
        organization_id, company_name, address, city, state, postal_code, country,
        email, phone, website, tax_number, logo_url
      ];

      const result = await this.db.query(companyConfigurationQueries.createCompanyConfiguration, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating company configuration: ${error.message}`);
    }
  }

  async update(id, configurationData) {
    try {
      const {
        company_name, address, city, state, postal_code, country,
        email, phone, website, tax_number, logo_url
      } = configurationData;

      const values = [
        id, company_name, address, city, state, postal_code, country,
        email, phone, website, tax_number, logo_url
      ];

      const result = await this.db.query(companyConfigurationQueries.updateCompanyConfiguration, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating company configuration: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const result = await this.db.query(companyConfigurationQueries.deleteCompanyConfiguration, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting company configuration: ${error.message}`);
    }
  }
}

module.exports = CompanyConfigurationRepository;
