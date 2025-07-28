// User Repository using Clean Architecture
const { queries } = require('../database/queries');

class UserRepository {
  constructor(db) {
    this.db = db;
  }

  // Find user by email
  async findByEmail(email) {
    try {
      console.log('findByEmail', email);
      const result = await this.db.query(queries.auth.findUserByEmail, [email]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to find user by email');
    }
  }

  // Find user by ID
  async findById(id) {
    try {
      const result = await this.db.query(queries.auth.findUserById, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to find user by ID');
    }
  }

  // Find organization by ID
  async findOrganizationById(organizationId) {
    try {
      const result = await this.db.query(queries.auth.findOrganizationById, [organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to find organization by ID');
    }
  }

  // Create organization
  async createOrganization(organizationData) {
    try {
      const result = await this.db.query(queries.auth.createOrganization, [
        organizationData.name,
        organizationData.slug,
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error('Failed to create organization');
    }
  }

  // Create user
  async createUser(userData) {
    try {
      const result = await this.db.query(queries.auth.createUser, [
        userData.email,
        userData.password_hash || userData.password, // Support both password and password_hash
        userData.first_name,
        userData.last_name,
        userData.organization_id,
        userData.role,
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('Create user error:', error);
      throw new Error('Failed to create user');
    }
  }

  // Update user
  async updateUser(userId, updateData) {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      // Build dynamic update query
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] !== undefined) {
          fields.push(`${key} = $${paramCount}`);
          values.push(updateData[key]);
          paramCount++;
        }
      });

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      // Add updated_at and user ID
      fields.push('updated_at = NOW()');
      values.push(userId);

      const query = `
        UPDATE users
        SET ${fields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await this.db.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to update user');
    }
  }

  // Find users by organization
  async findByOrganization(organizationId, options = {}) {
    const {
      page = 1, limit = 10, role, isActive = true,
    } = options;
    const offset = (page - 1) * limit;

    try {
      const result = await this.db.query(queries.user.findUsersByOrganization, [
        organizationId,
        role,
        isActive,
        limit,
        offset,
      ]);

      const countResult = await this.db.query(queries.user.countUsersByOrganization, [
        organizationId,
        role,
        isActive,
      ]);
      const total = parseInt(countResult.rows[0].count, 10);

      return {
        users: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error('Failed to find users by organization');
    }
  }

  // Search users
  async search(organizationId, searchTerm, options = {}) {
    const { page = 1, limit = 10, role } = options;
    const offset = (page - 1) * limit;

    try {
      const result = await this.db.query(queries.user.searchUsers, [
        organizationId,
        searchTerm,
        role,
        limit,
        offset,
      ]);

      const countResult = await this.db.query(queries.user.countSearchUsers, [
        organizationId,
        searchTerm,
        role,
      ]);
      const total = parseInt(countResult.rows[0].count, 10);

      return {
        users: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error('Failed to search users');
    }
  }

  // Delete user (soft delete)
  async delete(userId, organizationId) {
    try {
      const result = await this.db.query(queries.user.deleteUser, [userId, organizationId]);
      return result.rowCount > 0;
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  }

  // Get user statistics
  async getStatistics(organizationId) {
    try {
      const result = await this.db.query(queries.user.getUserStatistics, [organizationId]);
      return result.rows[0] || {};
    } catch (error) {
      throw new Error('Failed to get user statistics');
    }
  }

  // === ROLE AND PERMISSION MANAGEMENT ===

  async createRole(roleData) {
    try {
      const { rows } = await this.db.query(queries.user.createRole, [
        roleData.organization_id,
        roleData.name,
        roleData.description,
        roleData.permissions,
        roleData.is_system,
        roleData.metadata,
        roleData.created_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to create role');
    }
  }

  async getRoles(organizationId, filters = {}, pagination = {}) {
    try {
      const { search, is_system } = filters;
      const { page, limit, sort_by, sort_order } = pagination;
      const offset = (page - 1) * limit;

      let query = queries.user.getRoles;
      let params = [organizationId, limit, offset];

      // Add search filter
      if (search) {
        query = query.replace('WHERE r.organization_id = $1', 'WHERE r.organization_id = $1 AND (r.name ILIKE $4 OR r.description ILIKE $4)');
        params.push(`%${search}%`);
      }

      // Add is_system filter
      if (is_system !== undefined) {
        const systemCondition = 'AND r.is_system = $' + (params.length + 1);
        query = query.replace('WHERE r.organization_id = $1', 'WHERE r.organization_id = $1 ' + systemCondition);
        params.push(is_system);
      }

      // Add sorting
      query = query.replace('ORDER BY r.created_at DESC', `ORDER BY r.${sort_by} ${sort_order.toUpperCase()}`);

      const { rows } = await this.db.query(query, params);
      return rows;
    } catch (error) {
      throw new Error('Failed to get roles');
    }
  }

  async countRoles(organizationId, filters = {}) {
    try {
      const { search, is_system } = filters;

      let query = queries.user.countRoles;
      let params = [organizationId];

      // Add search filter
      if (search) {
        query = query.replace('WHERE r.organization_id = $1', 'WHERE r.organization_id = $1 AND (r.name ILIKE $2 OR r.description ILIKE $2)');
        params.push(`%${search}%`);
      }

      // Add is_system filter
      if (is_system !== undefined) {
        const systemCondition = 'AND r.is_system = $' + (params.length + 1);
        query = query.replace('WHERE r.organization_id = $1', 'WHERE r.organization_id = $1 ' + systemCondition);
        params.push(is_system);
      }

      const { rows } = await this.db.query(query, params);
      return parseInt(rows[0].count, 10);
    } catch (error) {
      throw new Error('Failed to count roles');
    }
  }

  async getRoleById(id, organizationId) {
    try {
      const { rows } = await this.db.query(queries.user.findRoleById, [id, organizationId]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to get role by ID');
    }
  }

  async updateRole(id, organizationId, updateData) {
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
        return null;
      }

      values.push(id, organizationId);
      const query = queries.user.updateRole.replace('SET column = $1', `SET ${setClause.join(', ')}`);

      const { rows } = await this.db.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to update role');
    }
  }

  async deleteRole(id, organizationId) {
    try {
      const { rows } = await this.db.query(queries.user.deleteRole, [id, organizationId]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to delete role');
    }
  }

  async assignRoleToUser(userId, roleId, organizationId) {
    try {
      const { rows } = await this.db.query(queries.user.assignRoleToUser, [userId, roleId, organizationId]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to assign role to user');
    }
  }

  async removeRoleFromUser(userId, roleId, organizationId) {
    try {
      const { rows } = await this.db.query(queries.user.removeRoleFromUser, [userId, roleId, organizationId]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to remove role from user');
    }
  }

  async getUserRoles(userId, organizationId) {
    try {
      const { rows } = await this.db.query(queries.user.getUserRoles, [userId, organizationId]);
      return rows;
    } catch (error) {
      throw new Error('Failed to get user roles');
    }
  }

  // === PERMISSION MANAGEMENT ===

  async createPermission(permissionData) {
    try {
      const { rows } = await this.db.query(queries.user.createPermission, [
        permissionData.organization_id,
        permissionData.name,
        permissionData.description,
        permissionData.resource,
        permissionData.action,
        permissionData.is_system,
        permissionData.metadata,
        permissionData.created_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to create permission');
    }
  }

  async getPermissions(organizationId, filters = {}, pagination = {}) {
    try {
      const { search, resource, action, is_system } = filters;
      const { page, limit, sort_by, sort_order } = pagination;
      const offset = (page - 1) * limit;

      let query = queries.user.getPermissions;
      let params = [organizationId, limit, offset];

      // Add search filter
      if (search) {
        query = query.replace('WHERE p.organization_id = $1', 'WHERE p.organization_id = $1 AND (p.name ILIKE $4 OR p.description ILIKE $4)');
        params.push(`%${search}%`);
      }

      // Add resource filter
      if (resource) {
        const resourceCondition = 'AND p.resource = $' + (params.length + 1);
        query = query.replace('WHERE p.organization_id = $1', 'WHERE p.organization_id = $1 ' + resourceCondition);
        params.push(resource);
      }

      // Add action filter
      if (action) {
        const actionCondition = 'AND p.action = $' + (params.length + 1);
        query = query.replace('WHERE p.organization_id = $1', 'WHERE p.organization_id = $1 ' + actionCondition);
        params.push(action);
      }

      // Add is_system filter
      if (is_system !== undefined) {
        const systemCondition = 'AND p.is_system = $' + (params.length + 1);
        query = query.replace('WHERE p.organization_id = $1', 'WHERE p.organization_id = $1 ' + systemCondition);
        params.push(is_system);
      }

      // Add sorting
      query = query.replace('ORDER BY p.created_at DESC', `ORDER BY p.${sort_by} ${sort_order.toUpperCase()}`);

      const { rows } = await this.db.query(query, params);
      return rows;
    } catch (error) {
      throw new Error('Failed to get permissions');
    }
  }

  async countPermissions(organizationId, filters = {}) {
    try {
      const { search, resource, action, is_system } = filters;

      let query = queries.user.countPermissions;
      let params = [organizationId];

      // Add search filter
      if (search) {
        query = query.replace('WHERE p.organization_id = $1', 'WHERE p.organization_id = $1 AND (p.name ILIKE $2 OR p.description ILIKE $2)');
        params.push(`%${search}%`);
      }

      // Add resource filter
      if (resource) {
        const resourceCondition = 'AND p.resource = $' + (params.length + 1);
        query = query.replace('WHERE p.organization_id = $1', 'WHERE p.organization_id = $1 ' + resourceCondition);
        params.push(resource);
      }

      // Add action filter
      if (action) {
        const actionCondition = 'AND p.action = $' + (params.length + 1);
        query = query.replace('WHERE p.organization_id = $1', 'WHERE p.organization_id = $1 ' + actionCondition);
        params.push(action);
      }

      // Add is_system filter
      if (is_system !== undefined) {
        const systemCondition = 'AND p.is_system = $' + (params.length + 1);
        query = query.replace('WHERE p.organization_id = $1', 'WHERE p.organization_id = $1 ' + systemCondition);
        params.push(is_system);
      }

      const { rows } = await this.db.query(query, params);
      return parseInt(rows[0].count, 10);
    } catch (error) {
      throw new Error('Failed to count permissions');
    }
  }

  async getPermissionById(id, organizationId) {
    try {
      const { rows } = await this.db.query(queries.user.findPermissionById, [id, organizationId]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to get permission by ID');
    }
  }

  async updatePermission(id, organizationId, updateData) {
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
        return null;
      }

      values.push(id, organizationId);
      const query = queries.user.updatePermission.replace('SET column = $1', `SET ${setClause.join(', ')}`);

      const { rows } = await this.db.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to update permission');
    }
  }

  async deletePermission(id, organizationId) {
    try {
      const { rows } = await this.db.query(queries.user.deletePermission, [id, organizationId]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to delete permission');
    }
  }

  // === USER ACTIVITY LOGS ===

  async createActivityLog(logData) {
    try {
      const { rows } = await this.db.query(queries.user.createActivityLog, [
        logData.organization_id,
        logData.user_id,
        logData.action,
        logData.resource,
        logData.resource_id,
        logData.details,
        logData.ip_address,
        logData.user_agent
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to create activity log');
    }
  }

  async getUserActivityLogs(organizationId, filters = {}, pagination = {}) {
    try {
      const { user_id, action, resource, start_date, end_date } = filters;
      const { page, limit, sort_by, sort_order } = pagination;
      const offset = (page - 1) * limit;

      let query = queries.user.getUserActivityLogs;
      let params = [organizationId, limit, offset];

      // Add user_id filter
      if (user_id) {
        query = query.replace('WHERE al.organization_id = $1', 'WHERE al.organization_id = $1 AND al.user_id = $4');
        params.push(user_id);
      }

      // Add action filter
      if (action) {
        const actionCondition = 'AND al.action = $' + (params.length + 1);
        query = query.replace('WHERE al.organization_id = $1', 'WHERE al.organization_id = $1 ' + actionCondition);
        params.push(action);
      }

      // Add resource filter
      if (resource) {
        const resourceCondition = 'AND al.resource = $' + (params.length + 1);
        query = query.replace('WHERE al.organization_id = $1', 'WHERE al.organization_id = $1 ' + resourceCondition);
        params.push(resource);
      }

      // Add date filters
      if (start_date) {
        const startDateCondition = 'AND al.created_at >= $' + (params.length + 1);
        query = query.replace('WHERE al.organization_id = $1', 'WHERE al.organization_id = $1 ' + startDateCondition);
        params.push(start_date);
      }

      if (end_date) {
        const endDateCondition = 'AND al.created_at <= $' + (params.length + 1);
        query = query.replace('WHERE al.organization_id = $1', 'WHERE al.organization_id = $1 ' + endDateCondition);
        params.push(end_date);
      }

      // Add sorting
      query = query.replace('ORDER BY al.created_at DESC', `ORDER BY al.${sort_by} ${sort_order.toUpperCase()}`);

      const { rows } = await this.db.query(query, params);
      return rows;
    } catch (error) {
      throw new Error('Failed to get user activity logs');
    }
  }

  async countUserActivityLogs(organizationId, filters = {}) {
    try {
      const { user_id, action, resource, start_date, end_date } = filters;

      let query = queries.user.countUserActivityLogs;
      let params = [organizationId];

      // Add user_id filter
      if (user_id) {
        query = query.replace('WHERE al.organization_id = $1', 'WHERE al.organization_id = $1 AND al.user_id = $2');
        params.push(user_id);
      }

      // Add action filter
      if (action) {
        const actionCondition = 'AND al.action = $' + (params.length + 1);
        query = query.replace('WHERE al.organization_id = $1', 'WHERE al.organization_id = $1 ' + actionCondition);
        params.push(action);
      }

      // Add resource filter
      if (resource) {
        const resourceCondition = 'AND al.resource = $' + (params.length + 1);
        query = query.replace('WHERE al.organization_id = $1', 'WHERE al.organization_id = $1 ' + resourceCondition);
        params.push(resource);
      }

      // Add date filters
      if (start_date) {
        const startDateCondition = 'AND al.created_at >= $' + (params.length + 1);
        query = query.replace('WHERE al.organization_id = $1', 'WHERE al.organization_id = $1 ' + startDateCondition);
        params.push(start_date);
      }

      if (end_date) {
        const endDateCondition = 'AND al.created_at <= $' + (params.length + 1);
        query = query.replace('WHERE al.organization_id = $1', 'WHERE al.organization_id = $1 ' + endDateCondition);
        params.push(end_date);
      }

      const { rows } = await this.db.query(query, params);
      return parseInt(rows[0].count, 10);
    } catch (error) {
      throw new Error('Failed to count user activity logs');
    }
  }

  async getActivityLogById(id, organizationId) {
    try {
      const { rows } = await this.db.query(queries.user.findActivityLogById, [id, organizationId]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to get activity log by ID');
    }
  }

  // === PASSWORD RESET ===

  async getUserByEmail(email, organizationId) {
    try {
      const { rows } = await this.db.query(queries.user.findUserByEmail, [email, organizationId]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to get user by email');
    }
  }

  async getUserByResetToken(token) {
    try {
      const { rows } = await this.db.query(queries.user.findUserByResetToken, [token]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to get user by reset token');
    }
  }

  // === USER SESSIONS ===

  async getUserSessions(organizationId, filters = {}, pagination = {}) {
    try {
      const { user_id, is_active } = filters;
      const { page, limit, sort_by, sort_order } = pagination;
      const offset = (page - 1) * limit;

      let query = queries.user.getUserSessions;
      let params = [organizationId, limit, offset];

      // Add user_id filter
      if (user_id) {
        query = query.replace('WHERE us.organization_id = $1', 'WHERE us.organization_id = $1 AND us.user_id = $4');
        params.push(user_id);
      }

      // Add is_active filter
      if (is_active !== undefined) {
        const activeCondition = 'AND us.is_active = $' + (params.length + 1);
        query = query.replace('WHERE us.organization_id = $1', 'WHERE us.organization_id = $1 ' + activeCondition);
        params.push(is_active);
      }

      // Add sorting
      query = query.replace('ORDER BY us.created_at DESC', `ORDER BY us.${sort_by} ${sort_order.toUpperCase()}`);

      const { rows } = await this.db.query(query, params);
      return rows;
    } catch (error) {
      throw new Error('Failed to get user sessions');
    }
  }

  async countUserSessions(organizationId, filters = {}) {
    try {
      const { user_id, is_active } = filters;

      let query = queries.user.countUserSessions;
      let params = [organizationId];

      // Add user_id filter
      if (user_id) {
        query = query.replace('WHERE us.organization_id = $1', 'WHERE us.organization_id = $1 AND us.user_id = $2');
        params.push(user_id);
      }

      // Add is_active filter
      if (is_active !== undefined) {
        const activeCondition = 'AND us.is_active = $' + (params.length + 1);
        query = query.replace('WHERE us.organization_id = $1', 'WHERE us.organization_id = $1 ' + activeCondition);
        params.push(is_active);
      }

      const { rows } = await this.db.query(query, params);
      return parseInt(rows[0].count, 10);
    } catch (error) {
      throw new Error('Failed to count user sessions');
    }
  }

  async revokeSession(sessionId, organizationId) {
    try {
      const { rows } = await this.db.query(queries.user.revokeSession, [sessionId, organizationId]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to revoke session');
    }
  }

  async revokeAllSessions(userId, organizationId) {
    try {
      const { rows } = await this.db.query(queries.user.revokeAllSessions, [userId, organizationId]);
      return rows;
    } catch (error) {
      throw new Error('Failed to revoke all sessions');
    }
  }

  // === USER STATISTICS ===

  async getUserStatistics(organizationId, filters = {}) {
    try {
      const { user_id, start_date, end_date, group_by } = filters;

      let query = queries.user.getUserStatistics;
      let params = [organizationId];

      if (user_id) {
        query = query.replace('WHERE us.organization_id = $1', 'WHERE us.organization_id = $1 AND us.user_id = $2');
        params.push(user_id);
      }

      if (start_date) {
        const startDateCondition = 'AND us.date >= $' + (params.length + 1);
        query = query.replace('WHERE us.organization_id = $1', 'WHERE us.organization_id = $1 ' + startDateCondition);
        params.push(start_date);
      }

      if (end_date) {
        const endDateCondition = 'AND us.date <= $' + (params.length + 1);
        query = query.replace('WHERE us.organization_id = $1', 'WHERE us.organization_id = $1 ' + endDateCondition);
        params.push(end_date);
      }

      // Add group by
      if (group_by) {
        query = query.replace('GROUP BY us.date', `GROUP BY us.${group_by}`);
      }

      const { rows } = await this.db.query(query, params);
      return rows;
    } catch (error) {
      throw new Error('Failed to get user statistics');
    }
  }

  // === BULK OPERATIONS ===

  async bulkUpdateUsers(userIds, organizationId, updates) {
    try {
      const results = [];
      for (const userId of userIds) {
        const result = await this.updateUser(userId, organizationId, updates);
        if (result) {
          results.push(result);
        }
      }
      return results;
    } catch (error) {
      throw new Error('Failed to bulk update users');
    }
  }

  async bulkDeleteUsers(userIds, organizationId, force = false) {
    try {
      const results = [];
      for (const userId of userIds) {
        const result = await this.delete(userId, organizationId);
        if (result) {
          results.push(result);
        }
      }
      return results;
    } catch (error) {
      throw new Error('Failed to bulk delete users');
    }
  }

  // === USER IMPORT/EXPORT ===

  async getUsersForExport(organizationId, filters = {}) {
    try {
      const { role, department, is_active } = filters;

      let query = queries.user.getUsersForExport;
      let params = [organizationId];

      // Add role filter
      if (role) {
        query = query.replace('WHERE u.organization_id = $1', 'WHERE u.organization_id = $1 AND u.role = $2');
        params.push(role);
      }

      // Add department filter
      if (department) {
        const deptCondition = 'AND u.department = $' + (params.length + 1);
        query = query.replace('WHERE u.organization_id = $1', 'WHERE u.organization_id = $1 ' + deptCondition);
        params.push(department);
      }

      // Add is_active filter
      if (is_active !== undefined) {
        const activeCondition = 'AND u.is_active = $' + (params.length + 1);
        query = query.replace('WHERE u.organization_id = $1', 'WHERE u.organization_id = $1 ' + activeCondition);
        params.push(is_active);
      }

      const { rows } = await this.db.query(query, params);
      return rows;
    } catch (error) {
      throw new Error('Failed to get users for export');
    }
  }

  // === USER NOTIFICATIONS ===

  async getUserNotifications(userId, organizationId, filters = {}, pagination = {}) {
    try {
      const { is_read, type } = filters;
      const { page, limit, sort_by, sort_order } = pagination;
      const offset = (page - 1) * limit;

      let query = queries.user.getUserNotifications;
      let params = [userId, organizationId, limit, offset];

      // Add is_read filter
      if (is_read !== undefined) {
        query = query.replace('WHERE un.user_id = $1 AND un.organization_id = $2', 'WHERE un.user_id = $1 AND un.organization_id = $2 AND un.is_read = $5');
        params.push(is_read);
      }

      // Add type filter
      if (type) {
        const typeCondition = 'AND un.type = $' + (params.length + 1);
        query = query.replace('WHERE un.user_id = $1 AND un.organization_id = $2', 'WHERE un.user_id = $1 AND un.organization_id = $2 ' + typeCondition);
        params.push(type);
      }

      // Add sorting
      query = query.replace('ORDER BY un.created_at DESC', `ORDER BY un.${sort_by} ${sort_order.toUpperCase()}`);

      const { rows } = await this.db.query(query, params);
      return rows;
    } catch (error) {
      throw new Error('Failed to get user notifications');
    }
  }

  async countUserNotifications(userId, organizationId, filters = {}) {
    try {
      const { is_read, type } = filters;

      let query = queries.user.countUserNotifications;
      let params = [userId, organizationId];

      // Add is_read filter
      if (is_read !== undefined) {
        query = query.replace('WHERE un.user_id = $1 AND un.organization_id = $2', 'WHERE un.user_id = $1 AND un.organization_id = $2 AND un.is_read = $3');
        params.push(is_read);
      }

      // Add type filter
      if (type) {
        const typeCondition = 'AND un.type = $' + (params.length + 1);
        query = query.replace('WHERE un.user_id = $1 AND un.organization_id = $2', 'WHERE un.user_id = $1 AND un.organization_id = $2 ' + typeCondition);
        params.push(type);
      }

      const { rows } = await this.db.query(query, params);
      return parseInt(rows[0].count, 10);
    } catch (error) {
      throw new Error('Failed to count user notifications');
    }
  }

  async markNotificationAsRead(notificationId, userId, organizationId) {
    try {
      const { rows } = await this.db.query(queries.user.markNotificationAsRead, [notificationId, userId, organizationId]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to mark notification as read');
    }
  }

  async markAllNotificationsAsRead(userId, organizationId) {
    try {
      const { rows } = await this.db.query(queries.user.markAllNotificationsAsRead, [userId, organizationId]);
      return parseInt(rows[0].count, 10);
    } catch (error) {
      throw new Error('Failed to mark all notifications as read');
    }
  }

  // === USER PREFERENCES ===

  async getUserPreferences(userId, organizationId) {
    try {
      const { rows } = await this.db.query(queries.user.findUserPreferences, [userId, organizationId]);
      return rows[0] || this.getDefaultUserPreferences();
    } catch (error) {
      throw new Error('Failed to get user preferences');
    }
  }

  async updateUserPreferences(userId, organizationId, updateData) {
    try {
      const { rows } = await this.db.query(queries.user.upsertUserPreferences, [
        userId,
        organizationId,
        updateData.theme,
        updateData.language,
        updateData.timezone,
        updateData.notifications,
        updateData.dashboard
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to update user preferences');
    }
  }

  getDefaultUserPreferences() {
    return {
      theme: 'light',
      language: 'en',
      timezone: 'UTC',
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      dashboard: {
        layout: 'default',
        widgets: []
      }
    };
  }
}

module.exports = UserRepository;
