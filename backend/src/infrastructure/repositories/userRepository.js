// User Repository using Clean Architecture
const { queries } = require('../database/queries');

class UserRepository {
  constructor(db) {
    this.db = db;
  }

  // Find user by email
  async findByEmail(email) {
    const result = await this.db.query(queries.auth.findUserByEmail, [email]);
    return result.rows[0] || null;
  }

  // Find user by ID
  async findById(userId) {
    const result = await this.db.query(queries.auth.findUserById, [userId]);
    return result.rows[0] || null;
  }

  // Check if email exists
  async emailExists(email) {
    const result = await this.db.query(queries.auth.checkEmailExists, [email]);
    return result.rows.length > 0;
  }

  // Create user
  async create(userData) {
    const {
      id,
      organizationId,
      email,
      passwordHash,
      firstName,
      lastName,
      role = 'member'
    } = userData;

    const result = await this.db.query(queries.auth.createUser, [
      id,
      organizationId,
      email,
      passwordHash,
      firstName,
      lastName,
      role
    ]);

    return result.rows[0];
  }

  // Update user last login
  async updateLastLogin(userId) {
    await this.db.query(queries.auth.updateLastLogin, [userId]);
  }

  // Update user profile
  async updateProfile(userId, profileData) {
    const { firstName, lastName, avatarUrl } = profileData;

    const result = await this.db.query(queries.auth.updateUserProfile, [
      firstName,
      lastName,
      avatarUrl,
      userId
    ]);

    return result.rows[0];
  }

  // Update user password
  async updatePassword(userId, passwordHash) {
    await this.db.query(queries.auth.updateUserPassword, [passwordHash, userId]);
  }

  // Get user password hash
  async getPasswordHash(userId) {
    const result = await this.db.query(queries.auth.getUserPasswordHash, [userId]);
    return result.rows[0]?.password_hash || null;
  }

  // Get user profile
  async getProfile(userId) {
    const result = await this.db.query(queries.auth.getUserProfile, [userId]);
    return result.rows[0] || null;
  }

  // Find organization by slug
  async findOrganizationBySlug(slug) {
    const result = await this.db.query(queries.auth.findOrganizationBySlug, [slug]);
    return result.rows[0] || null;
  }

  // Find organization by ID
  async findOrganizationById(organizationId) {
    const result = await this.db.query(queries.auth.findOrganizationById, [organizationId]);
    return result.rows[0] || null;
  }

  // Create organization
  async createOrganization(organizationData) {
    const {
      id,
      name,
      slug,
      domain,
      subscriptionPlan = 'starter',
      maxUsers = 5,
      maxProjects = 10
    } = organizationData;

    const result = await this.db.query(queries.auth.createOrganization, [
      id,
      name,
      slug,
      domain,
      subscriptionPlan,
      maxUsers,
      maxProjects
    ]);

    return result.rows[0];
  }

  // Update organization
  async updateOrganization(organizationId, organizationData) {
    const {
      name,
      slug,
      domain,
      logoUrl,
      primaryColor,
      secondaryColor
    } = organizationData;

    const result = await this.db.query(queries.auth.updateOrganization, [
      name,
      slug,
      domain,
      logoUrl,
      primaryColor,
      secondaryColor,
      organizationId
    ]);

    return result.rows[0];
  }

  // Get organization users count
  async getOrganizationUsersCount(organizationId) {
    const result = await this.db.query(queries.auth.getOrganizationUsersCount, [organizationId]);
    return result.rows[0]?.user_count || 0;
  }

  // Get organization projects count
  async getOrganizationProjectsCount(organizationId) {
    const result = await this.db.query(queries.auth.getOrganizationProjectsCount, [organizationId]);
    return result.rows[0]?.project_count || 0;
  }

  // Find users by organization
  async findByOrganization(organizationId) {
    const result = await this.db.query(queries.user.findUsersByOrganization, [organizationId]);
    return result.rows;
  }

  // Find user by ID with organization check
  async findByIdWithOrganization(userId, organizationId) {
    const result = await this.db.query(queries.user.findUserById, [userId, organizationId]);
    return result.rows[0] || null;
  }

  // Update user
  async update(userId, organizationId, userData) {
    const {
      firstName,
      lastName,
      email,
      role,
      permissions,
      avatarUrl,
      twoFactorEnabled
    } = userData;

    const result = await this.db.query(queries.user.updateUser, [
      firstName,
      lastName,
      email,
      role,
      permissions,
      avatarUrl,
      twoFactorEnabled,
      userId,
      organizationId
    ]);

    return result.rows[0];
  }

  // Delete user (soft delete)
  async delete(userId, organizationId) {
    await this.db.query(queries.user.deleteUser, [userId, organizationId]);
  }

  // Get user statistics
  async getStatistics(organizationId) {
    const result = await this.db.query(queries.user.getUserStatistics, [organizationId]);
    return result.rows[0];
  }

  // Search users
  async search(organizationId, searchTerm) {
    const result = await this.db.query(queries.user.searchUsers, [organizationId, `%${searchTerm}%`]);
    return result.rows;
  }

  // Find users by role
  async findByRole(organizationId, role) {
    const result = await this.db.query(queries.user.findUsersByRole, [organizationId, role]);
    return result.rows;
  }

  // Get user activity
  async getActivity(organizationId) {
    const result = await this.db.query(queries.user.getUserActivity, [organizationId]);
    return result.rows;
  }

  // Update user permissions
  async updatePermissions(userId, organizationId, permissions) {
    const result = await this.db.query(queries.user.updateUserPermissions, [
      permissions,
      userId,
      organizationId
    ]);

    return result.rows[0];
  }

  // Update 2FA status
  async update2FAStatus(userId, organizationId, enabled) {
    const result = await this.db.query(queries.user.update2FAStatus, [
      enabled,
      userId,
      organizationId
    ]);

    return result.rows[0];
  }

  // Get user dashboard data
  async getDashboardData(userId, organizationId) {
    const result = await this.db.query(queries.user.getUserDashboardData, [userId, organizationId]);
    return result.rows[0];
  }
}

module.exports = UserRepository;
