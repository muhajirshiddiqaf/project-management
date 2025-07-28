const Boom = require('@hapi/boom');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const csv = require('csv-parser');
const xlsx = require('xlsx');

class OrganizationHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // Bind all methods to preserve 'this' context
    this.createOrganization = this.createOrganization.bind(this);
    this.getOrganizations = this.getOrganizations.bind(this);
    this.getOrganizationById = this.getOrganizationById.bind(this);
    this.updateOrganization = this.updateOrganization.bind(this);
    this.deleteOrganization = this.deleteOrganization.bind(this);
    this.createSubscriptionPlan = this.createSubscriptionPlan.bind(this);
    this.getSubscriptionPlans = this.getSubscriptionPlans.bind(this);
    this.getSubscriptionPlanById = this.getSubscriptionPlanById.bind(this);
    this.updateSubscriptionPlan = this.updateSubscriptionPlan.bind(this);
    this.deleteSubscriptionPlan = this.deleteSubscriptionPlan.bind(this);
    this.assignSubscriptionToOrganization = this.assignSubscriptionToOrganization.bind(this);
    this.updateOrganizationSubscription = this.updateOrganizationSubscription.bind(this);
    this.getOrganizationSubscription = this.getOrganizationSubscription.bind(this);
    this.cancelOrganizationSubscription = this.cancelOrganizationSubscription.bind(this);
    this.getTenantSettings = this.getTenantSettings.bind(this);
    this.updateTenantSettings = this.updateTenantSettings.bind(this);
    this.initiateOnboarding = this.initiateOnboarding.bind(this);
    this.updateOnboardingProgress = this.updateOnboardingProgress.bind(this);
    this.getOnboardingStatus = this.getOnboardingStatus.bind(this);
    this.initiateOffboarding = this.initiateOffboarding.bind(this);
    this.updateOffboardingProgress = this.updateOffboardingProgress.bind(this);
    this.getOffboardingStatus = this.getOffboardingStatus.bind(this);
    this.getOrganizationStatistics = this.getOrganizationStatistics.bind(this);
    this.bulkUpdateOrganizations = this.bulkUpdateOrganizations.bind(this);
    this.bulkDeleteOrganizations = this.bulkDeleteOrganizations.bind(this);
    this.importOrganizations = this.importOrganizations.bind(this);
    this.exportOrganizations = this.exportOrganizations.bind(this);
  }

  // === ORGANIZATION CRUD OPERATIONS ===

  async createOrganization(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const organizationData = { ...request.payload, created_by: userId };

      // Generate unique slug if not provided
      if (!organizationData.slug) {
        organizationData.slug = this.generateSlug(organizationData.name);
      }

      // Check if slug is unique
      const existingOrg = await this._service.getOrganizationBySlug(organizationData.slug);
      if (existingOrg) {
        throw Boom.conflict('Organization slug already exists');
      }

      const organization = await this._service.createOrganization(organizationData);

      // Log activity
      await this._service.createActivityLog({
        organization_id: organization.id,
        user_id: userId,
        action: 'create',
        resource: 'organization',
        resource_id: organization.id,
        details: { organization_name: organization.name }
      });

      return h.response({
        success: true,
        message: 'Organization created successfully',
        data: organization
      }).code(201);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to create organization');
    }
  }

  async getOrganizations(request, h) {
    try {
      const { page, limit, search, industry, company_size, is_active, sort_by, sort_order } = request.query;

      const filters = { search, industry, company_size, is_active };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sort_by, sort_order };

      const [organizations, total] = await Promise.all([
        this._service.getOrganizations(filters, pagination),
        this._service.countOrganizations(filters)
      ]);

      return h.response({
        success: true,
        data: {
          organizations,
          pagination: {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            total,
            total_pages: Math.ceil(total / parseInt(limit, 10))
          }
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get organizations');
    }
  }

  async getOrganizationById(request, h) {
    try {
      const { id } = request.params;

      const organization = await this._service.getOrganizationById(id);
      if (!organization) {
        throw Boom.notFound('Organization not found');
      }

      return h.response({
        success: true,
        data: organization
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get organization');
    }
  }

  async updateOrganization(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { id } = request.params;
      const updateData = request.payload;

      // Check if slug is being updated and ensure uniqueness
      if (updateData.slug) {
        const existingOrg = await this._service.getOrganizationBySlug(updateData.slug);
        if (existingOrg && existingOrg.id !== id) {
          throw Boom.conflict('Organization slug already exists');
        }
      }

      const organization = await this._service.updateOrganization(id, updateData);
      if (!organization) {
        throw Boom.notFound('Organization not found');
      }

      // Log activity
      await this._service.createActivityLog({
        organization_id: id,
        user_id: userId,
        action: 'update',
        resource: 'organization',
        resource_id: id,
        details: { updated_fields: Object.keys(updateData) }
      });

      return h.response({
        success: true,
        message: 'Organization updated successfully',
        data: organization
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update organization');
    }
  }

  async deleteOrganization(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { id } = request.params;

      const organization = await this._service.deleteOrganization(id);
      if (!organization) {
        throw Boom.notFound('Organization not found');
      }

      // Log activity
      await this._service.createActivityLog({
        organization_id: id,
        user_id: userId,
        action: 'delete',
        resource: 'organization',
        resource_id: id,
        details: { organization_name: organization.name }
      });

      return h.response({
        success: true,
        message: 'Organization deleted successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to delete organization');
    }
  }

  // === SUBSCRIPTION PLAN MANAGEMENT ===

  async createSubscriptionPlan(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const planData = { ...request.payload, created_by: userId };

      const subscriptionPlan = await this._service.createSubscriptionPlan(planData);

      // Log activity
      await this._service.createActivityLog({
        organization_id: null,
        user_id: userId,
        action: 'create',
        resource: 'subscription_plan',
        resource_id: subscriptionPlan.id,
        details: { plan_name: subscriptionPlan.name }
      });

      return h.response({
        success: true,
        message: 'Subscription plan created successfully',
        data: subscriptionPlan
      }).code(201);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to create subscription plan');
    }
  }

  async getSubscriptionPlans(request, h) {
    try {
      const { page, limit, search, billing_cycle, is_active, sort_by, sort_order } = request.query;

      const filters = { search, billing_cycle, is_active };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sort_by, sort_order };

      const [plans, total] = await Promise.all([
        this._service.getSubscriptionPlans(filters, pagination),
        this._service.countSubscriptionPlans(filters)
      ]);

      return h.response({
        success: true,
        data: {
          plans,
          pagination: {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            total,
            total_pages: Math.ceil(total / parseInt(limit, 10))
          }
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get subscription plans');
    }
  }

  async getSubscriptionPlanById(request, h) {
    try {
      const { id } = request.params;

      const plan = await this._service.getSubscriptionPlanById(id);
      if (!plan) {
        throw Boom.notFound('Subscription plan not found');
      }

      return h.response({
        success: true,
        data: plan
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get subscription plan');
    }
  }

  async updateSubscriptionPlan(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { id } = request.params;
      const updateData = request.payload;

      const plan = await this._service.updateSubscriptionPlan(id, updateData);
      if (!plan) {
        throw Boom.notFound('Subscription plan not found');
      }

      // Log activity
      await this._service.createActivityLog({
        organization_id: null,
        user_id: userId,
        action: 'update',
        resource: 'subscription_plan',
        resource_id: id,
        details: { plan_name: plan.name }
      });

      return h.response({
        success: true,
        message: 'Subscription plan updated successfully',
        data: plan
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update subscription plan');
    }
  }

  async deleteSubscriptionPlan(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { id } = request.params;

      const plan = await this._service.deleteSubscriptionPlan(id);
      if (!plan) {
        throw Boom.notFound('Subscription plan not found');
      }

      // Log activity
      await this._service.createActivityLog({
        organization_id: null,
        user_id: userId,
        action: 'delete',
        resource: 'subscription_plan',
        resource_id: id,
        details: { plan_name: plan.name }
      });

      return h.response({
        success: true,
        message: 'Subscription plan deleted successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to delete subscription plan');
    }
  }

  // === ORGANIZATION SUBSCRIPTION MANAGEMENT ===

  async assignSubscriptionToOrganization(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const subscriptionData = { ...request.payload, assigned_by: userId };

      const subscription = await this._service.assignSubscriptionToOrganization(subscriptionData);

      // Log activity
      await this._service.createActivityLog({
        organization_id: subscriptionData.organization_id,
        user_id: userId,
        action: 'assign_subscription',
        resource: 'organization_subscription',
        resource_id: subscription.id,
        details: { subscription_plan_id: subscriptionData.subscription_plan_id }
      });

      return h.response({
        success: true,
        message: 'Subscription assigned to organization successfully',
        data: subscription
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to assign subscription to organization');
    }
  }

  async updateOrganizationSubscription(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { organization_id } = request.params;
      const updateData = request.payload;

      const subscription = await this._service.updateOrganizationSubscription(organization_id, updateData);
      if (!subscription) {
        throw Boom.notFound('Organization subscription not found');
      }

      // Log activity
      await this._service.createActivityLog({
        organization_id,
        user_id: userId,
        action: 'update_subscription',
        resource: 'organization_subscription',
        resource_id: subscription.id,
        details: { updated_fields: Object.keys(updateData) }
      });

      return h.response({
        success: true,
        message: 'Organization subscription updated successfully',
        data: subscription
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update organization subscription');
    }
  }

  async getOrganizationSubscription(request, h) {
    try {
      const { organization_id } = request.params;

      const subscription = await this._service.getOrganizationSubscription(organization_id);
      if (!subscription) {
        throw Boom.notFound('Organization subscription not found');
      }

      return h.response({
        success: true,
        data: subscription
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get organization subscription');
    }
  }

  async cancelOrganizationSubscription(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { organization_id } = request.params;
      const { reason, effective_date } = request.payload;

      const subscription = await this._service.cancelOrganizationSubscription(organization_id, {
        reason,
        effective_date: effective_date || new Date(),
        cancelled_by: userId
      });

      // Log activity
      await this._service.createActivityLog({
        organization_id,
        user_id: userId,
        action: 'cancel_subscription',
        resource: 'organization_subscription',
        resource_id: subscription.id,
        details: { reason, effective_date }
      });

      return h.response({
        success: true,
        message: 'Organization subscription cancelled successfully',
        data: subscription
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to cancel organization subscription');
    }
  }

  // === TENANT SETTINGS ===

  async getTenantSettings(request, h) {
    try {
      const { organization_id } = request.params;

      const settings = await this._service.getTenantSettings(organization_id);
      if (!settings) {
        throw Boom.notFound('Tenant settings not found');
      }

      return h.response({
        success: true,
        data: settings
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get tenant settings');
    }
  }

  async updateTenantSettings(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { organization_id } = request.params;
      const updateData = request.payload;

      const settings = await this._service.updateTenantSettings(organization_id, updateData);

      // Log activity
      await this._service.createActivityLog({
        organization_id,
        user_id: userId,
        action: 'update_settings',
        resource: 'tenant_settings',
        resource_id: organization_id,
        details: { updated_sections: Object.keys(updateData) }
      });

      return h.response({
        success: true,
        message: 'Tenant settings updated successfully',
        data: settings
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update tenant settings');
    }
  }

  // === TENANT ONBOARDING/OFFBOARDING ===

  async initiateOnboarding(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const onboardingData = { ...request.payload, initiated_by: userId };

      const onboarding = await this._service.initiateOnboarding(onboardingData);

      // Log activity
      await this._service.createActivityLog({
        organization_id: onboardingData.organization_id,
        user_id: userId,
        action: 'initiate_onboarding',
        resource: 'onboarding',
        resource_id: onboarding.id,
        details: { onboarding_type: onboardingData.onboarding_type }
      });

      return h.response({
        success: true,
        message: 'Onboarding initiated successfully',
        data: onboarding
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to initiate onboarding');
    }
  }

  async updateOnboardingProgress(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const progressData = { ...request.payload, updated_by: userId };

      const progress = await this._service.updateOnboardingProgress(progressData);

      // Log activity
      await this._service.createActivityLog({
        organization_id: progressData.organization_id,
        user_id: userId,
        action: 'update_onboarding',
        resource: 'onboarding',
        resource_id: progress.id,
        details: { step: progressData.step, status: progressData.status }
      });

      return h.response({
        success: true,
        message: 'Onboarding progress updated successfully',
        data: progress
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update onboarding progress');
    }
  }

  async getOnboardingStatus(request, h) {
    try {
      const { organization_id } = request.params;

      const status = await this._service.getOnboardingStatus(organization_id);
      if (!status) {
        throw Boom.notFound('Onboarding status not found');
      }

      return h.response({
        success: true,
        data: status
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get onboarding status');
    }
  }

  async initiateOffboarding(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const offboardingData = { ...request.payload, initiated_by: userId };

      const offboarding = await this._service.initiateOffboarding(offboardingData);

      // Log activity
      await this._service.createActivityLog({
        organization_id: offboardingData.organization_id,
        user_id: userId,
        action: 'initiate_offboarding',
        resource: 'offboarding',
        resource_id: offboarding.id,
        details: { reason: offboardingData.reason }
      });

      return h.response({
        success: true,
        message: 'Offboarding initiated successfully',
        data: offboarding
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to initiate offboarding');
    }
  }

  async updateOffboardingProgress(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const progressData = { ...request.payload, updated_by: userId };

      const progress = await this._service.updateOffboardingProgress(progressData);

      // Log activity
      await this._service.createActivityLog({
        organization_id: progressData.organization_id,
        user_id: userId,
        action: 'update_offboarding',
        resource: 'offboarding',
        resource_id: progress.id,
        details: { step: progressData.step, status: progressData.status }
      });

      return h.response({
        success: true,
        message: 'Offboarding progress updated successfully',
        data: progress
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update offboarding progress');
    }
  }

  async getOffboardingStatus(request, h) {
    try {
      const { organization_id } = request.params;

      const status = await this._service.getOffboardingStatus(organization_id);
      if (!status) {
        throw Boom.notFound('Offboarding status not found');
      }

      return h.response({
        success: true,
        data: status
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get offboarding status');
    }
  }

  // === ORGANIZATION STATISTICS ===

  async getOrganizationStatistics(request, h) {
    try {
      const { organization_id, start_date, end_date, group_by } = request.query;

      const stats = await this._service.getOrganizationStatistics({
        organization_id,
        start_date,
        end_date,
        group_by
      });

      return h.response({
        success: true,
        data: stats
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get organization statistics');
    }
  }

  // === BULK OPERATIONS ===

  async bulkUpdateOrganizations(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { organization_ids, updates } = request.payload;

      const results = await this._service.bulkUpdateOrganizations(organization_ids, updates);

      // Log activity
      await this._service.createActivityLog({
        organization_id: null,
        user_id: userId,
        action: 'bulk_update',
        resource: 'organization',
        resource_id: null,
        details: {
          updated_count: results.length,
          updated_fields: Object.keys(updates)
        }
      });

      return h.response({
        success: true,
        message: `Updated ${results.length} organizations successfully`,
        data: { updated_count: results.length }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to bulk update organizations');
    }
  }

  async bulkDeleteOrganizations(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { organization_ids, force, export_data } = request.payload;

      const results = await this._service.bulkDeleteOrganizations(organization_ids, force, export_data);

      // Log activity
      await this._service.createActivityLog({
        organization_id: null,
        user_id: userId,
        action: 'bulk_delete',
        resource: 'organization',
        resource_id: null,
        details: {
          deleted_count: results.length,
          force_delete: force,
          export_data
        }
      });

      return h.response({
        success: true,
        message: `Deleted ${results.length} organizations successfully`,
        data: { deleted_count: results.length }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to bulk delete organizations');
    }
  }

  // === ORGANIZATION IMPORT/EXPORT ===

  async importOrganizations(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { file, options } = request.payload;

      const results = await this.processOrganizationImport(file, options);

      // Log activity
      await this._service.createActivityLog({
        organization_id: null,
        user_id: userId,
        action: 'import_organizations',
        resource: 'organization',
        resource_id: null,
        details: {
          imported_count: results.imported,
          errors_count: results.errors,
          filename: file.hapi.filename
        }
      });

      return h.response({
        success: true,
        message: `Import completed: ${results.imported} imported, ${results.errors} errors`,
        data: results
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to import organizations');
    }
  }

  async exportOrganizations(request, h) {
    try {
      const { format, filters } = request.query;

      const organizations = await this._service.getOrganizationsForExport(filters);
      const exportData = await this.formatOrganizationExport(organizations, format);

      return h.response(exportData.content)
        .header('Content-Type', exportData.contentType)
        .header('Content-Disposition', `attachment; filename="organizations-export.${format}"`);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to export organizations');
    }
  }

  // === HELPER METHODS ===

  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      + '-' + crypto.randomBytes(4).toString('hex');
  }

  async processOrganizationImport(file, options) {
    const results = { imported: 0, errors: 0, errors: [] };
    const fileExtension = file.hapi.filename.split('.').pop().toLowerCase();

    try {
      let organizations = [];

      if (fileExtension === 'csv') {
        organizations = await this.parseCSVFile(file._data);
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        organizations = await this.parseExcelFile(file._data);
      } else {
        throw new Error('Unsupported file format');
      }

      for (const orgData of organizations) {
        try {
          // Validate required fields
          if (!orgData.name) {
            results.errors.push({ row: orgData.row, error: 'Missing required fields' });
            results.errors++;
            continue;
          }

          // Generate slug if not provided
          if (!orgData.slug) {
            orgData.slug = this.generateSlug(orgData.name);
          }

          // Check if organization exists
          const existingOrg = await this._service.getOrganizationBySlug(orgData.slug);

          if (existingOrg && !options.update_existing) {
            results.errors.push({ row: orgData.row, error: 'Organization already exists' });
            results.errors++;
            continue;
          }

          // Prepare organization data
          const orgToCreate = {
            name: orgData.name,
            slug: orgData.slug,
            description: orgData.description,
            domain: orgData.domain,
            contact_email: orgData.contact_email,
            industry: orgData.industry,
            company_size: orgData.company_size,
            timezone: orgData.timezone || 'UTC',
            locale: orgData.locale || 'en'
          };

          if (existingOrg && options.update_existing) {
            await this._service.updateOrganization(existingOrg.id, orgToCreate);
          } else {
            await this._service.createOrganization(orgToCreate);
          }

          results.imported++;
        } catch (error) {
          results.errors.push({ row: orgData.row, error: error.message });
          results.errors++;
        }
      }
    } catch (error) {
      throw new Error(`Failed to process file: ${error.message}`);
    }

    return results;
  }

  async parseCSVFile(buffer) {
    return new Promise((resolve, reject) => {
      const organizations = [];
      let rowNumber = 1;

      const stream = require('stream');
      const readable = new stream.Readable();
      readable.push(buffer);
      readable.push(null);

      readable
        .pipe(csv())
        .on('data', (row) => {
          organizations.push({ ...row, row: rowNumber++ });
        })
        .on('end', () => {
          resolve(organizations);
        })
        .on('error', reject);
    });
  }

  async parseExcelFile(buffer) {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const organizations = xlsx.utils.sheet_to_json(worksheet);

    return organizations.map((org, index) => ({ ...org, row: index + 1 }));
  }

  async formatOrganizationExport(organizations, format) {
    switch (format) {
      case 'csv':
        return this.formatAsCSV(organizations);
      case 'excel':
        return this.formatAsExcel(organizations);
      case 'json':
        return this.formatAsJSON(organizations);
      default:
        throw new Error('Unsupported export format');
    }
  }

  formatAsCSV(organizations) {
    const headers = ['id', 'name', 'slug', 'description', 'domain', 'contact_email', 'industry', 'company_size', 'timezone', 'locale', 'is_active', 'created_at'];
    const csvContent = [
      headers.join(','),
      ...organizations.map(org => headers.map(header => org[header]).join(','))
    ].join('\n');

    return {
      content: csvContent,
      contentType: 'text/csv'
    };
  }

  formatAsExcel(organizations) {
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(organizations);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Organizations');

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return {
      content: buffer,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
  }

  formatAsJSON(organizations) {
    return {
      content: JSON.stringify(organizations, null, 2),
      contentType: 'application/json'
    };
  }
}

module.exports = OrganizationHandler;
