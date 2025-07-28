const AuthMiddleware = require('../middleware/auth');
const database = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class AuthController {
  // Register new user
  static async register(req, res) {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        organizationName,
        organizationSlug,
      } = req.body;

      // Validate required fields
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          message: 'Email, password, first name, and last name are required',
          code: 'MISSING_REQUIRED_FIELDS'
        });
      }

      // Check if email already exists
      const existingUserQuery = 'SELECT id FROM users WHERE email = $1';
      const existingUser = await database.query(existingUserQuery, [email]);

      if (existingUser.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Email already registered',
          code: 'EMAIL_EXISTS'
        });
      }

      // Hash password
      const hashedPassword = await AuthMiddleware.hashPassword(password);

      // Create organization if provided
      let organizationId;
      if (organizationName && organizationSlug) {
        const orgQuery = `
          INSERT INTO organizations (id, name, slug, domain, subscription_plan, max_users, max_projects)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id
        `;

        const orgResult = await database.query(orgQuery, [
          uuidv4(),
          organizationName,
          organizationSlug,
          `${organizationSlug}.localhost`,
          'starter',
          5,
          10
        ]);

        organizationId = orgResult.rows[0].id;
      } else {
        // Use default organization
        const defaultOrgQuery = 'SELECT id FROM organizations WHERE slug = $1';
        const defaultOrg = await database.query(defaultOrgQuery, ['default']);
        organizationId = defaultOrg.rows[0].id;
      }

      // Create user
      const userId = uuidv4();
      const userQuery = `
        INSERT INTO users (id, organization_id, email, password_hash, first_name, last_name, role)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, email, first_name, last_name, role, organization_id
      `;

      const userResult = await database.query(userQuery, [
        userId,
        organizationId,
        email,
        hashedPassword,
        firstName,
        lastName,
        'admin' // First user in organization is admin
      ]);

      const user = userResult.rows[0];

      // Generate tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organization_id,
      };

      const accessToken = AuthMiddleware.generateToken(tokenPayload);
      const refreshToken = AuthMiddleware.generateRefreshToken(tokenPayload);

      // Store refresh token in database
      const refreshTokenQuery = `
        UPDATE users
        SET last_login_at = NOW()
        WHERE id = $1
      `;
      await database.query(refreshTokenQuery, [user.id]);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            organizationId: user.organization_id,
          },
          tokens: {
            accessToken,
            refreshToken,
            expiresIn: '24h'
          }
        }
      });

    } catch (error) {
      console.error('Registration error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        code: 'REGISTRATION_ERROR'
      });
    }
  }

  // Login user
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
          code: 'MISSING_CREDENTIALS'
        });
      }

      // Find user with organization info
      const userQuery = `
        SELECT u.*, o.name as organization_name, o.slug as organization_slug
        FROM users u
        JOIN organizations o ON u.organization_id = o.id
        WHERE u.email = $1 AND u.is_active = true AND o.is_active = true
      `;

      const userResult = await database.query(userQuery, [email]);

      if (userResult.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        });
      }

      const user = userResult.rows[0];

      // Verify password
      const isPasswordValid = await AuthMiddleware.comparePassword(password, user.password_hash);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Generate tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organization_id,
      };

      const accessToken = AuthMiddleware.generateToken(tokenPayload);
      const refreshToken = AuthMiddleware.generateRefreshToken(tokenPayload);

      // Update last login
      const updateLoginQuery = `
        UPDATE users
        SET last_login_at = NOW()
        WHERE id = $1
      `;
      await database.query(updateLoginQuery, [user.id]);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            organizationId: user.organization_id,
            organizationName: user.organization_name,
            organizationSlug: user.organization_slug,
          },
          tokens: {
            accessToken,
            refreshToken,
            expiresIn: '24h'
          }
        }
      });

    } catch (error) {
      console.error('Login error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        code: 'LOGIN_ERROR'
      });
    }
  }

  // Refresh token
  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required',
          code: 'REFRESH_TOKEN_REQUIRED'
        });
      }

      // Verify refresh token
      const decoded = AuthMiddleware.verifyToken(refreshToken);

      // Check if user exists and is active
      const userQuery = `
        SELECT u.*, o.name as organization_name, o.slug as organization_slug
        FROM users u
        JOIN organizations o ON u.organization_id = o.id
        WHERE u.id = $1 AND u.is_active = true AND o.is_active = true
      `;

      const userResult = await database.query(userQuery, [decoded.userId]);

      if (userResult.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'User not found or inactive',
          code: 'USER_NOT_FOUND'
        });
      }

      const user = userResult.rows[0];

      // Generate new tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organization_id,
      };

      const newAccessToken = AuthMiddleware.generateToken(tokenPayload);
      const newRefreshToken = AuthMiddleware.generateRefreshToken(tokenPayload);

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          tokens: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            expiresIn: '24h'
          }
        }
      });

    } catch (error) {
      console.error('Token refresh error:', error.message);
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }
  }

  // Logout user
  static async logout(req, res) {
    try {
      // In a real application, you might want to blacklist the token
      // For now, we'll just return success
      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Logout failed',
        code: 'LOGOUT_ERROR'
      });
    }
  }

  // Get current user profile
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;

      const userQuery = `
        SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.permissions,
               u.avatar_url, u.two_factor_enabled, u.last_login_at,
               o.name as organization_name, o.slug as organization_slug
        FROM users u
        JOIN organizations o ON u.organization_id = o.id
        WHERE u.id = $1 AND u.is_active = true
      `;

      const userResult = await database.query(userQuery, [userId]);

      if (userResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      const user = userResult.rows[0];

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            permissions: user.permissions || {},
            avatarUrl: user.avatar_url,
            twoFactorEnabled: user.two_factor_enabled,
            lastLoginAt: user.last_login_at,
            organizationId: req.user.organizationId,
            organizationName: user.organization_name,
            organizationSlug: user.organization_slug,
          }
        }
      });

    } catch (error) {
      console.error('Get profile error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to get profile',
        code: 'PROFILE_ERROR'
      });
    }
  }

  // Update user profile
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { firstName, lastName, avatarUrl } = req.body;

      const updateQuery = `
        UPDATE users
        SET first_name = COALESCE($1, first_name),
            last_name = COALESCE($2, last_name),
            avatar_url = COALESCE($3, avatar_url),
            updated_at = NOW()
        WHERE id = $4
        RETURNING id, email, first_name, last_name, role, avatar_url
      `;

      const result = await database.query(updateQuery, [
        firstName,
        lastName,
        avatarUrl,
        userId
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      const user = result.rows[0];

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            avatarUrl: user.avatar_url,
          }
        }
      });

    } catch (error) {
      console.error('Update profile error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        code: 'UPDATE_PROFILE_ERROR'
      });
    }
  }

  // Change password
  static async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required',
          code: 'MISSING_PASSWORDS'
        });
      }

      // Get current password hash
      const userQuery = 'SELECT password_hash FROM users WHERE id = $1';
      const userResult = await database.query(userQuery, [userId]);

      if (userResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      const currentHash = userResult.rows[0].password_hash;

      // Verify current password
      const isCurrentPasswordValid = await AuthMiddleware.comparePassword(currentPassword, currentHash);

      if (!isCurrentPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect',
          code: 'INVALID_CURRENT_PASSWORD'
        });
      }

      // Hash new password
      const newHash = await AuthMiddleware.hashPassword(newPassword);

      // Update password
      const updateQuery = `
        UPDATE users
        SET password_hash = $1, updated_at = NOW()
        WHERE id = $2
      `;

      await database.query(updateQuery, [newHash, userId]);

      res.json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      console.error('Change password error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to change password',
        code: 'CHANGE_PASSWORD_ERROR'
      });
    }
  }
}

module.exports = AuthController;
