// User Repository using Clean Architecture
const { queries } = require('../database/queries');

class UserRepository {
  constructor(db) {
    this.db = db;
  }

  // Find user by email
  async findByEmail(email) {
    try {
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
        organizationData.slug
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
        userData.password,
        userData.first_name,
        userData.last_name,
        userData.organization_id,
        userData.role
      ]);
      return result.rows[0];
    } catch (error) {
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
      Object.keys(updateData).forEach(key => {
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
    const { page = 1, limit = 10, role, isActive = true } = options;
    const offset = (page - 1) * limit;

    try {
      const result = await this.db.query(queries.user.findUsersByOrganization, [
        organizationId,
        role,
        isActive,
        limit,
        offset
      ]);

      const countResult = await this.db.query(queries.user.countUsersByOrganization, [
        organizationId,
        role,
        isActive
      ]);
      const total = parseInt(countResult.rows[0].count);

      return {
        users: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
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
        offset
      ]);

      const countResult = await this.db.query(queries.user.countSearchUsers, [
        organizationId,
        searchTerm,
        role
      ]);
      const total = parseInt(countResult.rows[0].count);

      return {
        users: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
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
}

module.exports = UserRepository;
