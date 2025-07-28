const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const csv = require('csv-parser');
const xlsx = require('xlsx');

class UserHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // Bind all methods to preserve 'this' context
    this.createUser = this.createUser.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.createRole = this.createRole.bind(this);
    this.getRoles = this.getRoles.bind(this);
    this.getRoleById = this.getRoleById.bind(this);
    this.updateRole = this.updateRole.bind(this);
    this.deleteRole = this.deleteRole.bind(this);
    this.assignRoleToUser = this.assignRoleToUser.bind(this);
    this.removeRoleFromUser = this.removeRoleFromUser.bind(this);
    this.getUserRoles = this.getUserRoles.bind(this);
    this.createPermission = this.createPermission.bind(this);
    this.getPermissions = this.getPermissions.bind(this);
    this.getPermissionById = this.getPermissionById.bind(this);
    this.updatePermission = this.updatePermission.bind(this);
    this.deletePermission = this.deletePermission.bind(this);
    this.getUserActivityLogs = this.getUserActivityLogs.bind(this);
    this.getActivityLogById = this.getActivityLogById.bind(this);
    this.initiatePasswordReset = this.initiatePasswordReset.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.verifyPasswordResetToken = this.verifyPasswordResetToken.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.uploadAvatar = this.uploadAvatar.bind(this);
    this.getUserSessions = this.getUserSessions.bind(this);
    this.revokeSession = this.revokeSession.bind(this);
    this.revokeAllSessions = this.revokeAllSessions.bind(this);
    this.getUserStatistics = this.getUserStatistics.bind(this);
    this.bulkUpdateUsers = this.bulkUpdateUsers.bind(this);
    this.bulkDeleteUsers = this.bulkDeleteUsers.bind(this);
    this.importUsers = this.importUsers.bind(this);
    this.exportUsers = this.exportUsers.bind(this);
    this.getUserNotifications = this.getUserNotifications.bind(this);
    this.markNotificationAsRead = this.markNotificationAsRead.bind(this);
    this.markAllNotificationsAsRead = this.markAllNotificationsAsRead.bind(this);
    this.getUserPreferences = this.getUserPreferences.bind(this);
    this.updateUserPreferences = this.updateUserPreferences.bind(this);
  }

  // === USER CRUD OPERATIONS ===

  async createUser(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const userData = { ...request.payload, organization_id: organizationId, created_by: userId };

      // Hash password
      userData.password = await bcrypt.hash(userData.password, 10);

      const user = await this._service.createUser(userData);

      // Log activity
      await this._service.createActivityLog({
        organization_id: organizationId,
        user_id: userId,
        action: 'create',
        resource: 'user',
        resource_id: user.id,
        details: { created_user_email: user.email }
      });

      return h.response({
        success: true,
        message: 'User created successfully',
        data: user
      }).code(201);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to create user');
    }
  }

  async getUsers(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { page, limit, search, role, department, is_active, sort_by, sort_order } = request.query;

      const filters = { search, role, department, is_active };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sort_by, sort_order };

      const [users, total] = await Promise.all([
        this._service.getUsers(organizationId, filters, pagination),
        this._service.countUsers(organizationId, filters)
      ]);

      return h.response({
        success: true,
        data: {
          users,
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
      throw Boom.internal('Failed to get users');
    }
  }

  async getUserById(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { id } = request.params;

      const user = await this._service.getUserById(id, organizationId);
      if (!user) {
        throw Boom.notFound('User not found');
      }

      return h.response({
        success: true,
        data: user
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get user');
    }
  }

  async updateUser(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const { id } = request.params;
      const updateData = request.payload;

      const user = await this._service.updateUser(id, organizationId, updateData);
      if (!user) {
        throw Boom.notFound('User not found');
      }

      // Log activity
      await this._service.createActivityLog({
        organization_id: organizationId,
        user_id: userId,
        action: 'update',
        resource: 'user',
        resource_id: id,
        details: { updated_fields: Object.keys(updateData) }
      });

      return h.response({
        success: true,
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update user');
    }
  }

  async deleteUser(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const { id } = request.params;

      const user = await this._service.deleteUser(id, organizationId);
      if (!user) {
        throw Boom.notFound('User not found');
      }

      // Log activity
      await this._service.createActivityLog({
        organization_id: organizationId,
        user_id: userId,
        action: 'delete',
        resource: 'user',
        resource_id: id,
        details: { deleted_user_email: user.email }
      });

      return h.response({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to delete user');
    }
  }

  // === ROLE AND PERMISSION MANAGEMENT ===

  async createRole(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const roleData = { ...request.payload, organization_id: organizationId, created_by: userId };

      const role = await this._service.createRole(roleData);

      // Log activity
      await this._service.createActivityLog({
        organization_id: organizationId,
        user_id: userId,
        action: 'create',
        resource: 'role',
        resource_id: role.id,
        details: { role_name: role.name }
      });

      return h.response({
        success: true,
        message: 'Role created successfully',
        data: role
      }).code(201);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to create role');
    }
  }

  async getRoles(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { page, limit, search, is_system, sort_by, sort_order } = request.query;

      const filters = { search, is_system };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sort_by, sort_order };

      const [roles, total] = await Promise.all([
        this._service.getRoles(organizationId, filters, pagination),
        this._service.countRoles(organizationId, filters)
      ]);

      return h.response({
        success: true,
        data: {
          roles,
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
      throw Boom.internal('Failed to get roles');
    }
  }

  async getRoleById(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { id } = request.params;

      const role = await this._service.getRoleById(id, organizationId);
      if (!role) {
        throw Boom.notFound('Role not found');
      }

      return h.response({
        success: true,
        data: role
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get role');
    }
  }

  async updateRole(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const { id } = request.params;
      const updateData = request.payload;

      const role = await this._service.updateRole(id, organizationId, updateData);
      if (!role) {
        throw Boom.notFound('Role not found');
      }

      // Log activity
      await this._service.createActivityLog({
        organization_id: organizationId,
        user_id: userId,
        action: 'update',
        resource: 'role',
        resource_id: id,
        details: { role_name: role.name }
      });

      return h.response({
        success: true,
        message: 'Role updated successfully',
        data: role
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update role');
    }
  }

  async deleteRole(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const { id } = request.params;

      const role = await this._service.deleteRole(id, organizationId);
      if (!role) {
        throw Boom.notFound('Role not found');
      }

      // Log activity
      await this._service.createActivityLog({
        organization_id: organizationId,
        user_id: userId,
        action: 'delete',
        resource: 'role',
        resource_id: id,
        details: { role_name: role.name }
      });

      return h.response({
        success: true,
        message: 'Role deleted successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to delete role');
    }
  }

  async assignRoleToUser(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const { user_id, role_id } = request.payload;

      const userRole = await this._service.assignRoleToUser(user_id, role_id, organizationId);

      // Log activity
      await this._service.createActivityLog({
        organization_id: organizationId,
        user_id: userId,
        action: 'assign_role',
        resource: 'user_role',
        resource_id: userRole.id,
        details: { assigned_user_id: user_id, role_id }
      });

      return h.response({
        success: true,
        message: 'Role assigned to user successfully',
        data: userRole
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to assign role to user');
    }
  }

  async removeRoleFromUser(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const { user_id, role_id } = request.payload;

      const userRole = await this._service.removeRoleFromUser(user_id, role_id, organizationId);
      if (!userRole) {
        throw Boom.notFound('User role not found');
      }

      // Log activity
      await this._service.createActivityLog({
        organization_id: organizationId,
        user_id: userId,
        action: 'remove_role',
        resource: 'user_role',
        resource_id: userRole.id,
        details: { removed_user_id: user_id, role_id }
      });

      return h.response({
        success: true,
        message: 'Role removed from user successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to remove role from user');
    }
  }

  async getUserRoles(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { user_id } = request.params;

      const roles = await this._service.getUserRoles(user_id, organizationId);

      return h.response({
        success: true,
        data: roles
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get user roles');
    }
  }

  // === PERMISSION MANAGEMENT ===

  async createPermission(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const permissionData = { ...request.payload, organization_id: organizationId, created_by: userId };

      const permission = await this._service.createPermission(permissionData);

      // Log activity
      await this._service.createActivityLog({
        organization_id: organizationId,
        user_id: userId,
        action: 'create',
        resource: 'permission',
        resource_id: permission.id,
        details: { permission_name: permission.name }
      });

      return h.response({
        success: true,
        message: 'Permission created successfully',
        data: permission
      }).code(201);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to create permission');
    }
  }

  async getPermissions(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { page, limit, search, resource, action, is_system, sort_by, sort_order } = request.query;

      const filters = { search, resource, action, is_system };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sort_by, sort_order };

      const [permissions, total] = await Promise.all([
        this._service.getPermissions(organizationId, filters, pagination),
        this._service.countPermissions(organizationId, filters)
      ]);

      return h.response({
        success: true,
        data: {
          permissions,
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
      throw Boom.internal('Failed to get permissions');
    }
  }

  async getPermissionById(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { id } = request.params;

      const permission = await this._service.getPermissionById(id, organizationId);
      if (!permission) {
        throw Boom.notFound('Permission not found');
      }

      return h.response({
        success: true,
        data: permission
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get permission');
    }
  }

  async updatePermission(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const { id } = request.params;
      const updateData = request.payload;

      const permission = await this._service.updatePermission(id, organizationId, updateData);
      if (!permission) {
        throw Boom.notFound('Permission not found');
      }

      // Log activity
      await this._service.createActivityLog({
        organization_id: organizationId,
        user_id: userId,
        action: 'update',
        resource: 'permission',
        resource_id: id,
        details: { permission_name: permission.name }
      });

      return h.response({
        success: true,
        message: 'Permission updated successfully',
        data: permission
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update permission');
    }
  }

  async deletePermission(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const { id } = request.params;

      const permission = await this._service.deletePermission(id, organizationId);
      if (!permission) {
        throw Boom.notFound('Permission not found');
      }

      // Log activity
      await this._service.createActivityLog({
        organization_id: organizationId,
        user_id: userId,
        action: 'delete',
        resource: 'permission',
        resource_id: id,
        details: { permission_name: permission.name }
      });

      return h.response({
        success: true,
        message: 'Permission deleted successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to delete permission');
    }
  }

  // === USER ACTIVITY LOGS ===

  async getUserActivityLogs(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { page, limit, user_id, action, resource, start_date, end_date, sort_by, sort_order } = request.query;

      const filters = { user_id, action, resource, start_date, end_date };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sort_by, sort_order };

      const [logs, total] = await Promise.all([
        this._service.getUserActivityLogs(organizationId, filters, pagination),
        this._service.countUserActivityLogs(organizationId, filters)
      ]);

      return h.response({
        success: true,
        data: {
          logs,
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
      throw Boom.internal('Failed to get user activity logs');
    }
  }

  async getActivityLogById(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { id } = request.params;

      const log = await this._service.getActivityLogById(id, organizationId);
      if (!log) {
        throw Boom.notFound('Activity log not found');
      }

      return h.response({
        success: true,
        data: log
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get activity log');
    }
  }

  // === PASSWORD RESET AND ACCOUNT RECOVERY ===

  async initiatePasswordReset(request, h) {
    try {
      const { email } = request.payload;
      const organizationId = request.auth.credentials.organizationId;

      const user = await this._service.getUserByEmail(email, organizationId);
      if (!user) {
        // Don't reveal if user exists or not for security
        return h.response({
          success: true,
          message: 'If the email exists, a password reset link has been sent'
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await this._service.updateUser(user.id, organizationId, {
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry
      });

      // TODO: Send email with reset link
      // await this.emailService.sendPasswordResetEmail(user.email, resetToken);

      // Log activity
      await this._service.createActivityLog({
        organization_id: organizationId,
        user_id: user.id,
        action: 'password_reset_initiated',
        resource: 'user',
        resource_id: user.id,
        details: { email }
      });

      return h.response({
        success: true,
        message: 'If the email exists, a password reset link has been sent'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to initiate password reset');
    }
  }

  async resetPassword(request, h) {
    try {
      const { token, new_password } = request.payload;

      const user = await this._service.getUserByResetToken(token);
      if (!user) {
        throw Boom.badRequest('Invalid or expired reset token');
      }

      if (user.reset_token_expiry < new Date()) {
        throw Boom.badRequest('Reset token has expired');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(new_password, 10);

      await this._service.updateUser(user.id, user.organization_id, {
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null
      });

      // Log activity
      await this._service.createActivityLog({
        organization_id: user.organization_id,
        user_id: user.id,
        action: 'password_reset_completed',
        resource: 'user',
        resource_id: user.id,
        details: { email: user.email }
      });

      return h.response({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to reset password');
    }
  }

  async changePassword(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const { current_password, new_password } = request.payload;

      const user = await this._service.getUserById(userId, organizationId);
      if (!user) {
        throw Boom.notFound('User not found');
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(current_password, user.password);
      if (!isValidPassword) {
        throw Boom.badRequest('Current password is incorrect');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(new_password, 10);

      await this._service.updateUser(userId, organizationId, {
        password: hashedPassword
      });

      // Log activity
      await this._service.createActivityLog({
        organization_id: organizationId,
        user_id: userId,
        action: 'password_changed',
        resource: 'user',
        resource_id: userId,
        details: { email: user.email }
      });

      return h.response({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to change password');
    }
  }

  async verifyPasswordResetToken(request, h) {
    try {
      const { token } = request.payload;

      const user = await this._service.getUserByResetToken(token);
      if (!user) {
        throw Boom.badRequest('Invalid reset token');
      }

      if (user.reset_token_expiry < new Date()) {
        throw Boom.badRequest('Reset token has expired');
      }

      return h.response({
        success: true,
        message: 'Reset token is valid',
        data: { email: user.email }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to verify reset token');
    }
  }

  // === USER PROFILE MANAGEMENT ===

  async updateProfile(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const updateData = request.payload;

      const user = await this._service.updateUser(userId, organizationId, updateData);
      if (!user) {
        throw Boom.notFound('User not found');
      }

      // Log activity
      await this._service.createActivityLog({
        organization_id: organizationId,
        user_id: userId,
        action: 'profile_updated',
        resource: 'user',
        resource_id: userId,
        details: { updated_fields: Object.keys(updateData) }
      });

      return h.response({
        success: true,
        message: 'Profile updated successfully',
        data: user
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update profile');
    }
  }

  async uploadAvatar(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const { avatar } = request.payload;

      // Save file
      const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
      await fs.mkdir(uploadDir, { recursive: true });

      const fileName = `avatar-${userId}-${Date.now()}.${avatar.hapi.filename.split('.').pop()}`;
      const filePath = path.join(uploadDir, fileName);

      await fs.writeFile(filePath, avatar._data);

      // Update user avatar
      const avatarUrl = `/uploads/avatars/${fileName}`;
      await this._service.updateUser(userId, organizationId, { avatar: avatarUrl });

      return h.response({
        success: true,
        message: 'Avatar uploaded successfully',
        data: { avatar: avatarUrl }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to upload avatar');
    }
  }

  // === USER SESSIONS ===

  async getUserSessions(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { page, limit, user_id, is_active, sort_by, sort_order } = request.query;

      const filters = { user_id, is_active };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sort_by, sort_order };

      const [sessions, total] = await Promise.all([
        this._service.getUserSessions(organizationId, filters, pagination),
        this._service.countUserSessions(organizationId, filters)
      ]);

      return h.response({
        success: true,
        data: {
          sessions,
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
      throw Boom.internal('Failed to get user sessions');
    }
  }

  async revokeSession(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const { session_id } = request.params;

      const session = await this._service.revokeSession(session_id, organizationId);
      if (!session) {
        throw Boom.notFound('Session not found');
      }

      // Log activity
      await this._service.createActivityLog({
        organization_id: organizationId,
        user_id: userId,
        action: 'session_revoked',
        resource: 'user_session',
        resource_id: session_id,
        details: { session_user_id: session.user_id }
      });

      return h.response({
        success: true,
        message: 'Session revoked successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to revoke session');
    }
  }

  async revokeAllSessions(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const { user_id } = request.params;

      const sessions = await this._service.revokeAllSessions(user_id, organizationId);

      // Log activity
      await this._service.createActivityLog({
        organization_id: organizationId,
        user_id: userId,
        action: 'all_sessions_revoked',
        resource: 'user_session',
        resource_id: user_id,
        details: { revoked_count: sessions.length }
      });

      return h.response({
        success: true,
        message: `Revoked ${sessions.length} sessions successfully`
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to revoke all sessions');
    }
  }

  // === USER STATISTICS ===

  async getUserStatistics(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { user_id, start_date, end_date, group_by } = request.query;

      const stats = await this._service.getUserStatistics(organizationId, {
        user_id,
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
      throw Boom.internal('Failed to get user statistics');
    }
  }

  // === BULK OPERATIONS ===

  async bulkUpdateUsers(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const { user_ids, updates } = request.payload;

      const results = await this._service.bulkUpdateUsers(user_ids, organizationId, updates);

      // Log activity
      await this._service.createActivityLog({
        organization_id: organizationId,
        user_id: userId,
        action: 'bulk_update',
        resource: 'user',
        resource_id: null,
        details: {
          updated_count: results.length,
          updated_fields: Object.keys(updates)
        }
      });

      return h.response({
        success: true,
        message: `Updated ${results.length} users successfully`,
        data: { updated_count: results.length }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to bulk update users');
    }
  }

  async bulkDeleteUsers(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const { user_ids, force } = request.payload;

      const results = await this._service.bulkDeleteUsers(user_ids, organizationId, force);

      // Log activity
      await this._service.createActivityLog({
        organization_id: organizationId,
        user_id: userId,
        action: 'bulk_delete',
        resource: 'user',
        resource_id: null,
        details: {
          deleted_count: results.length,
          force_delete: force
        }
      });

      return h.response({
        success: true,
        message: `Deleted ${results.length} users successfully`,
        data: { deleted_count: results.length }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to bulk delete users');
    }
  }

  // === USER IMPORT/EXPORT ===

  async importUsers(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const { file, options } = request.payload;

      const results = await this.processUserImport(file, organizationId, options);

      // Log activity
      await this._service.createActivityLog({
        organization_id: organizationId,
        user_id: userId,
        action: 'import_users',
        resource: 'user',
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
      throw Boom.internal('Failed to import users');
    }
  }

  async exportUsers(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { format, filters } = request.query;

      const users = await this._service.getUsersForExport(organizationId, filters);
      const exportData = await this.formatUserExport(users, format);

      return h.response(exportData.content)
        .header('Content-Type', exportData.contentType)
        .header('Content-Disposition', `attachment; filename="users-export.${format}"`);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to export users');
    }
  }

  // === USER NOTIFICATIONS ===

  async getUserNotifications(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const { page, limit, is_read, type, sort_by, sort_order } = request.query;

      const filters = { is_read, type };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sort_by, sort_order };

      const [notifications, total] = await Promise.all([
        this._service.getUserNotifications(userId, organizationId, filters, pagination),
        this._service.countUserNotifications(userId, organizationId, filters)
      ]);

      return h.response({
        success: true,
        data: {
          notifications,
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
      throw Boom.internal('Failed to get user notifications');
    }
  }

  async markNotificationAsRead(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const { notification_id } = request.params;

      const notification = await this._service.markNotificationAsRead(notification_id, userId, organizationId);
      if (!notification) {
        throw Boom.notFound('Notification not found');
      }

      return h.response({
        success: true,
        message: 'Notification marked as read'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to mark notification as read');
    }
  }

  async markAllNotificationsAsRead(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;

      const count = await this._service.markAllNotificationsAsRead(userId, organizationId);

      return h.response({
        success: true,
        message: `Marked ${count} notifications as read`
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to mark all notifications as read');
    }
  }

  // === USER PREFERENCES ===

  async getUserPreferences(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;

      const preferences = await this._service.getUserPreferences(userId, organizationId);

      return h.response({
        success: true,
        data: preferences
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get user preferences');
    }
  }

  async updateUserPreferences(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const updateData = request.payload;

      const preferences = await this._service.updateUserPreferences(userId, organizationId, updateData);

      return h.response({
        success: true,
        message: 'User preferences updated successfully',
        data: preferences
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update user preferences');
    }
  }

  // === HELPER METHODS ===

  async processUserImport(file, organizationId, options) {
    const results = { imported: 0, errors: 0, errors: [] };
    const fileExtension = file.hapi.filename.split('.').pop().toLowerCase();

    try {
      let users = [];

      if (fileExtension === 'csv') {
        users = await this.parseCSVFile(file._data);
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        users = await this.parseExcelFile(file._data);
      } else {
        throw new Error('Unsupported file format');
      }

      for (const userData of users) {
        try {
          // Validate required fields
          if (!userData.email || !userData.name) {
            results.errors.push({ row: userData.row, error: 'Missing required fields' });
            results.errors++;
            continue;
          }

          // Check if user exists
          const existingUser = await this._service.getUserByEmail(userData.email, organizationId);

          if (existingUser && !options.update_existing) {
            results.errors.push({ row: userData.row, error: 'User already exists' });
            results.errors++;
            continue;
          }

          // Prepare user data
          const userToCreate = {
            name: userData.name,
            email: userData.email,
            password: userData.password || crypto.randomBytes(8).toString('hex'),
            role: userData.role || options.default_role,
            phone: userData.phone,
            department: userData.department,
            position: userData.position,
            organization_id: organizationId
          };

          if (existingUser && options.update_existing) {
            await this._service.updateUser(existingUser.id, organizationId, userToCreate);
          } else {
            await this._service.createUser(userToCreate);
          }

          results.imported++;
        } catch (error) {
          results.errors.push({ row: userData.row, error: error.message });
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
      const users = [];
      let rowNumber = 1;

      const stream = require('stream');
      const readable = new stream.Readable();
      readable.push(buffer);
      readable.push(null);

      readable
        .pipe(csv())
        .on('data', (row) => {
          users.push({ ...row, row: rowNumber++ });
        })
        .on('end', () => {
          resolve(users);
        })
        .on('error', reject);
    });
  }

  async parseExcelFile(buffer) {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const users = xlsx.utils.sheet_to_json(worksheet);

    return users.map((user, index) => ({ ...user, row: index + 1 }));
  }

  async formatUserExport(users, format) {
    switch (format) {
      case 'csv':
        return this.formatAsCSV(users);
      case 'excel':
        return this.formatAsExcel(users);
      case 'json':
        return this.formatAsJSON(users);
      default:
        throw new Error('Unsupported export format');
    }
  }

  formatAsCSV(users) {
    const headers = ['id', 'name', 'email', 'role', 'department', 'position', 'is_active', 'created_at'];
    const csvContent = [
      headers.join(','),
      ...users.map(user => headers.map(header => user[header]).join(','))
    ].join('\n');

    return {
      content: csvContent,
      contentType: 'text/csv'
    };
  }

  formatAsExcel(users) {
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(users);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Users');

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return {
      content: buffer,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
  }

  formatAsJSON(users) {
    return {
      content: JSON.stringify(users, null, 2),
      contentType: 'application/json'
    };
  }
}

module.exports = UserHandler;
