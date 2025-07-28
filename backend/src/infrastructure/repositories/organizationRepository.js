const { queries } = require('../database/queries');

class OrganizationRepository {
  constructor(db) {
    this.db = db;
  }

  // === ORGANIZATION CRUD OPERATIONS ===

  async createOrganization(organizationData) {
    try {
      const { rows } = await this.db.query(queries.organization.createOrganization, [
        organizationData.name,
        organizationData.slug,
        organizationData.description,
        organizationData.domain,
        organizationData.logo,
        organizationData.website,
        organizationData.contact_email,
        organizationData.contact_phone,
        organizationData.address,
        organizationData.industry,
        organizationData.company_size,
        organizationData.timezone,
        organizationData.locale,
        organizationData.is_active,
        organizationData.metadata,
        organizationData.created_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to create organization');
    }
  }

  async getOrganizations(filters = {}, pagination = {}) {
    try {
      const { search, industry, company_size, is_active } = filters;
      const { page, limit, sort_by, sort_order } = pagination;
      const offset = (page - 1) * limit;

      let query = queries.organization.getOrganizations;
      let params = [limit, offset];

      // Add filters
      let whereConditions = [];
      let paramIndex = 3;

      if (search) {
        whereConditions.push(`(o.name ILIKE $${paramIndex} OR o.slug ILIKE $${paramIndex} OR o.description ILIKE $${paramIndex})`);
        params.push(`%${search}%`);
        paramIndex++;
      }

      if (industry) {
        whereConditions.push(`o.industry = $${paramIndex}`);
        params.push(industry);
        paramIndex++;
      }

      if (company_size) {
        whereConditions.push(`o.company_size = $${paramIndex}`);
        params.push(company_size);
        paramIndex++;
      }

      if (is_active !== undefined) {
        whereConditions.push(`o.is_active = $${paramIndex}`);
        params.push(is_active);
        paramIndex++;
      }

      if (whereConditions.length > 0) {
        query = query.replace('ORDER BY', 'WHERE ' + whereConditions.join(' AND ') + ' ORDER BY');
      }

      // Add sorting
      query = query.replace('ORDER BY o.created_at DESC', `ORDER BY o.${sort_by} ${sort_order.toUpperCase()}`);

      const { rows } = await this.db.query(query, params);
      return rows;
    } catch (error) {
      throw new Error('Failed to get organizations');
    }
  }

  async countOrganizations(filters = {}) {
    try {
      const { search, industry, company_size, is_active } = filters;

      let query = queries.organization.countOrganizations;
      let params = [];
      let paramIndex = 1;

      let whereConditions = [];

      if (search) {
        whereConditions.push(`(o.name ILIKE $${paramIndex} OR o.slug ILIKE $${paramIndex} OR o.description ILIKE $${paramIndex})`);
        params.push(`%${search}%`);
        paramIndex++;
      }

      if (industry) {
        whereConditions.push(`o.industry = $${paramIndex}`);
        params.push(industry);
        paramIndex++;
      }

      if (company_size) {
        whereConditions.push(`o.company_size = $${paramIndex}`);
        params.push(company_size);
        paramIndex++;
      }

      if (is_active !== undefined) {
        whereConditions.push(`o.is_active = $${paramIndex}`);
        params.push(is_active);
        paramIndex++;
      }

      if (whereConditions.length > 0) {
        query = query.replace('FROM organizations o', 'FROM organizations o WHERE ' + whereConditions.join(' AND '));
      }

      const { rows } = await this.db.query(query, params);
      return parseInt(rows[0].count, 10);
    } catch (error) {
      throw new Error('Failed to count organizations');
    }
  }

  async getOrganizationById(id) {
    try {
      const { rows } = await this.db.query(queries.organization.getOrganizationById, [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to get organization by ID');
    }
  }

  async getOrganizationBySlug(slug) {
    try {
      const { rows } = await this.db.query(queries.organization.getOrganizationBySlug, [slug]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to get organization by slug');
    }
  }

  async updateOrganization(id, updateData) {
    try {
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          setClause.push(`${key} = $${paramIndex}`);
          values.push(updateData[key]);
          paramIndex++;
        }
      });

      if (setClause.length === 0) {
        throw new Error('No fields to update');
      }

      setClause.push('updated_at = NOW()');
      values.push(id);

      const query = `
        UPDATE organizations
        SET ${setClause.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const { rows } = await this.db.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to update organization');
    }
  }

  async deleteOrganization(id) {
    try {
      const { rows } = await this.db.query(queries.organization.deleteOrganization, [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to delete organization');
    }
  }

  // === SUBSCRIPTION PLAN MANAGEMENT ===

  async createSubscriptionPlan(planData) {
    try {
      const { rows } = await this.db.query(queries.organization.createSubscriptionPlan, [
        planData.name,
        planData.description,
        planData.price,
        planData.currency,
        planData.billing_cycle,
        planData.features,
        planData.limits,
        planData.is_active,
        planData.is_popular,
        planData.metadata,
        planData.created_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to create subscription plan');
    }
  }

  async getSubscriptionPlans(filters = {}, pagination = {}) {
    try {
      const { search, billing_cycle, is_active } = filters;
      const { page, limit, sort_by, sort_order } = pagination;
      const offset = (page - 1) * limit;

      let query = queries.organization.getSubscriptionPlans;
      let params = [limit, offset];

      // Add filters
      let whereConditions = [];
      let paramIndex = 3;

      if (search) {
        whereConditions.push(`(sp.name ILIKE $${paramIndex} OR sp.description ILIKE $${paramIndex})`);
        params.push(`%${search}%`);
        paramIndex++;
      }

      if (billing_cycle) {
        whereConditions.push(`sp.billing_cycle = $${paramIndex}`);
        params.push(billing_cycle);
        paramIndex++;
      }

      if (is_active !== undefined) {
        whereConditions.push(`sp.is_active = $${paramIndex}`);
        params.push(is_active);
        paramIndex++;
      }

      if (whereConditions.length > 0) {
        query = query.replace('ORDER BY', 'WHERE ' + whereConditions.join(' AND ') + ' ORDER BY');
      }

      // Add sorting
      query = query.replace('ORDER BY sp.created_at DESC', `ORDER BY sp.${sort_by} ${sort_order.toUpperCase()}`);

      const { rows } = await this.db.query(query, params);
      return rows;
    } catch (error) {
      throw new Error('Failed to get subscription plans');
    }
  }

  async countSubscriptionPlans(filters = {}) {
    try {
      const { search, billing_cycle, is_active } = filters;

      let query = queries.organization.countSubscriptionPlans;
      let params = [];
      let paramIndex = 1;

      let whereConditions = [];

      if (search) {
        whereConditions.push(`(sp.name ILIKE $${paramIndex} OR sp.description ILIKE $${paramIndex})`);
        params.push(`%${search}%`);
        paramIndex++;
      }

      if (billing_cycle) {
        whereConditions.push(`sp.billing_cycle = $${paramIndex}`);
        params.push(billing_cycle);
        paramIndex++;
      }

      if (is_active !== undefined) {
        whereConditions.push(`sp.is_active = $${paramIndex}`);
        params.push(is_active);
        paramIndex++;
      }

      if (whereConditions.length > 0) {
        query = query.replace('FROM subscription_plans sp', 'FROM subscription_plans sp WHERE ' + whereConditions.join(' AND '));
      }

      const { rows } = await this.db.query(query, params);
      return parseInt(rows[0].count, 10);
    } catch (error) {
      throw new Error('Failed to count subscription plans');
    }
  }

  async getSubscriptionPlanById(id) {
    try {
      const { rows } = await this.db.query(queries.organization.getSubscriptionPlanById, [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to get subscription plan by ID');
    }
  }

  async updateSubscriptionPlan(id, updateData) {
    try {
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          setClause.push(`${key} = $${paramIndex}`);
          values.push(updateData[key]);
          paramIndex++;
        }
      });

      if (setClause.length === 0) {
        throw new Error('No fields to update');
      }

      setClause.push('updated_at = NOW()');
      values.push(id);

      const query = `
        UPDATE subscription_plans
        SET ${setClause.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const { rows } = await this.db.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to update subscription plan');
    }
  }

  async deleteSubscriptionPlan(id) {
    try {
      const { rows } = await this.db.query(queries.organization.deleteSubscriptionPlan, [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to delete subscription plan');
    }
  }

  // === ORGANIZATION SUBSCRIPTION MANAGEMENT ===

  async assignSubscriptionToOrganization(subscriptionData) {
    try {
      const { rows } = await this.db.query(queries.organization.assignSubscriptionToOrganization, [
        subscriptionData.organization_id,
        subscriptionData.subscription_plan_id,
        subscriptionData.start_date,
        subscriptionData.end_date,
        subscriptionData.auto_renew,
        subscriptionData.payment_method,
        subscriptionData.billing_address,
        subscriptionData.metadata,
        subscriptionData.assigned_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to assign subscription to organization');
    }
  }

  async updateOrganizationSubscription(organizationId, updateData) {
    try {
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          setClause.push(`${key} = $${paramIndex}`);
          values.push(updateData[key]);
          paramIndex++;
        }
      });

      if (setClause.length === 0) {
        throw new Error('No fields to update');
      }

      setClause.push('updated_at = NOW()');
      values.push(organizationId);

      const query = `
        UPDATE organization_subscriptions
        SET ${setClause.join(', ')}
        WHERE organization_id = $${paramIndex}
        RETURNING *
      `;

      const { rows } = await this.db.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to update organization subscription');
    }
  }

  async getOrganizationSubscription(organizationId) {
    try {
      const { rows } = await this.db.query(queries.organization.getOrganizationSubscription, [organizationId]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to get organization subscription');
    }
  }

  async cancelOrganizationSubscription(organizationId, cancelData) {
    try {
      const { rows } = await this.db.query(queries.organization.cancelOrganizationSubscription, [
        organizationId,
        cancelData.reason,
        cancelData.effective_date,
        cancelData.cancelled_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to cancel organization subscription');
    }
  }

  // === TENANT SETTINGS ===

  async getTenantSettings(organizationId) {
    try {
      const { rows } = await this.db.query(queries.organization.getTenantSettings, [organizationId]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to get tenant settings');
    }
  }

  async updateTenantSettings(organizationId, updateData) {
    try {
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          setClause.push(`${key} = $${paramIndex}`);
          values.push(updateData[key]);
          paramIndex++;
        }
      });

      if (setClause.length === 0) {
        throw new Error('No fields to update');
      }

      setClause.push('updated_at = NOW()');
      values.push(organizationId);

      const query = `
        UPDATE tenant_settings
        SET ${setClause.join(', ')}
        WHERE organization_id = $${paramIndex}
        RETURNING *
      `;

      const { rows } = await this.db.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to update tenant settings');
    }
  }

  // === TENANT ONBOARDING/OFFBOARDING ===

  async initiateOnboarding(onboardingData) {
    try {
      const { rows } = await this.db.query(queries.organization.initiateOnboarding, [
        onboardingData.organization_id,
        onboardingData.onboarding_type,
        onboardingData.steps,
        onboardingData.assigned_admin,
        onboardingData.estimated_completion_days,
        onboardingData.metadata,
        onboardingData.initiated_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to initiate onboarding');
    }
  }

  async updateOnboardingProgress(progressData) {
    try {
      const { rows } = await this.db.query(queries.organization.updateOnboardingProgress, [
        progressData.organization_id,
        progressData.step,
        progressData.status,
        progressData.completed_at,
        progressData.notes,
        progressData.metadata,
        progressData.updated_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to update onboarding progress');
    }
  }

  async getOnboardingStatus(organizationId) {
    try {
      const { rows } = await this.db.query(queries.organization.getOnboardingStatus, [organizationId]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to get onboarding status');
    }
  }

  async initiateOffboarding(offboardingData) {
    try {
      const { rows } = await this.db.query(queries.organization.initiateOffboarding, [
        offboardingData.organization_id,
        offboardingData.reason,
        offboardingData.effective_date,
        offboardingData.data_retention_days,
        offboardingData.export_data,
        offboardingData.notify_users,
        offboardingData.metadata,
        offboardingData.initiated_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to initiate offboarding');
    }
  }

  async updateOffboardingProgress(progressData) {
    try {
      const { rows } = await this.db.query(queries.organization.updateOffboardingProgress, [
        progressData.organization_id,
        progressData.step,
        progressData.status,
        progressData.completed_at,
        progressData.notes,
        progressData.metadata,
        progressData.updated_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to update offboarding progress');
    }
  }

  async getOffboardingStatus(organizationId) {
    try {
      const { rows } = await this.db.query(queries.organization.getOffboardingStatus, [organizationId]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to get offboarding status');
    }
  }

  // === ORGANIZATION STATISTICS ===

  async getOrganizationStatistics(filters = {}) {
    try {
      const { organization_id, start_date, end_date, group_by } = filters;

      let query = queries.organization.getOrganizationStatistics;
      let params = [];

      if (organization_id) {
        query = query.replace('WHERE 1=1', 'WHERE o.id = $1');
        params.push(organization_id);
      }

      if (start_date) {
        const condition = organization_id ? 'AND o.created_at >= $2' : 'WHERE o.created_at >= $1';
        query = query.replace('WHERE 1=1', condition);
        params.push(start_date);
      }

      if (end_date) {
        const condition = params.length > 0 ? 'AND o.created_at <= $' + (params.length + 1) : 'WHERE o.created_at <= $1';
        query = query.replace('WHERE 1=1', condition);
        params.push(end_date);
      }

      // Add group by clause
      query = query.replace('GROUP BY', `GROUP BY DATE_TRUNC('${group_by}', o.created_at)`);

      const { rows } = await this.db.query(query, params);
      return rows;
    } catch (error) {
      throw new Error('Failed to get organization statistics');
    }
  }

  // === BULK OPERATIONS ===

  async bulkUpdateOrganizations(organizationIds, updates) {
    try {
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined) {
          setClause.push(`${key} = $${paramIndex}`);
          values.push(updates[key]);
          paramIndex++;
        }
      });

      if (setClause.length === 0) {
        throw new Error('No fields to update');
      }

      setClause.push('updated_at = NOW()');

      const placeholders = organizationIds.map((_, index) => `$${paramIndex + index}`).join(',');
      values.push(...organizationIds);

      const query = `
        UPDATE organizations
        SET ${setClause.join(', ')}
        WHERE id IN (${placeholders})
        RETURNING *
      `;

      const { rows } = await this.db.query(query, values);
      return rows;
    } catch (error) {
      throw new Error('Failed to bulk update organizations');
    }
  }

  async bulkDeleteOrganizations(organizationIds, force, exportData) {
    try {
      if (force) {
        const placeholders = organizationIds.map((_, index) => `$${index + 1}`).join(',');
        const query = `
          DELETE FROM organizations
          WHERE id IN (${placeholders})
          RETURNING *
        `;
        const { rows } = await this.db.query(query, organizationIds);
        return rows;
      } else {
        const placeholders = organizationIds.map((_, index) => `$${index + 1}`).join(',');
        const query = `
          UPDATE organizations
          SET deleted_at = NOW(), is_active = false
          WHERE id IN (${placeholders})
          RETURNING *
        `;
        const { rows } = await this.db.query(query, organizationIds);
        return rows;
      }
    } catch (error) {
      throw new Error('Failed to bulk delete organizations');
    }
  }

  // === ORGANIZATION IMPORT/EXPORT ===

  async getOrganizationsForExport(filters = {}) {
    try {
      const { industry, company_size, is_active } = filters;

      let query = queries.organization.getOrganizationsForExport;
      let params = [];
      let paramIndex = 1;

      let whereConditions = [];

      if (industry) {
        whereConditions.push(`o.industry = $${paramIndex}`);
        params.push(industry);
        paramIndex++;
      }

      if (company_size) {
        whereConditions.push(`o.company_size = $${paramIndex}`);
        params.push(company_size);
        paramIndex++;
      }

      if (is_active !== undefined) {
        whereConditions.push(`o.is_active = $${paramIndex}`);
        params.push(is_active);
        paramIndex++;
      }

      if (whereConditions.length > 0) {
        query = query.replace('ORDER BY o.created_at DESC', 'WHERE ' + whereConditions.join(' AND ') + ' ORDER BY o.created_at DESC');
      }

      const { rows } = await this.db.query(query, params);
      return rows;
    } catch (error) {
      throw new Error('Failed to get organizations for export');
    }
  }

  // === ACTIVITY LOGS ===

  async createActivityLog(activityData) {
    try {
      const { rows } = await this.db.query(queries.organization.createActivityLog, [
        activityData.organization_id,
        activityData.user_id,
        activityData.action,
        activityData.resource,
        activityData.resource_id,
        activityData.details,
        activityData.ip_address,
        activityData.user_agent
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to create activity log');
    }
  }
}

module.exports = OrganizationRepository;
