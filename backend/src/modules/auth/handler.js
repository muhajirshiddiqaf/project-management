const Boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// Import use cases
const {
  RegisterUserUseCase,
  LoginUserUseCase,
  RefreshTokenUseCase,
  GetProfileUseCase,
  UpdateProfileUseCase,
  ChangePasswordUseCase
} = require('../../application/use-cases/auth');

// Import repositories
const { UserRepository } = require('../../infrastructure/repositories');

class AuthHandler {
  constructor() {
    // Repository will be injected via dependency injection
    this.userRepository = null;
  }

  // Set repository (dependency injection)
  setUserRepository(userRepository) {
    this.userRepository = userRepository;
  }

  // Register user
  async register(request, h) {
    try {
      const { email, password, firstName, lastName, organizationName, organizationSlug } = request.payload;

      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw Boom.conflict('User already exists');
      }

      // Create organization
      const organization = await this.userRepository.createOrganization({
        name: organizationName,
        slug: organizationSlug
      });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await this.userRepository.createUser({
        email,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        organization_id: organization.id,
        role: 'admin'
      });

      // Generate tokens
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role, organizationId: organization.id },
        process.env.JWT_SECRET || 'your_jwt_secret_here',
        { expiresIn: '24h' }
      );

      const refreshToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_here',
        { expiresIn: '7d' }
      );

      return h.response({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            organizationId: organization.id
          },
          tokens: {
            accessToken,
            refreshToken,
            expiresIn: '24h'
          }
        }
      }).code(201);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Registration failed');
    }
  }

  // Login user
  async login(request, h) {
    try {
      const { email, password } = request.payload;

      // Find user
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw Boom.unauthorized('Invalid credentials');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw Boom.unauthorized('Invalid credentials');
      }

      // Check if 2FA is enabled
      if (user.two_factor_enabled) {
        return h.response({
          success: true,
          message: '2FA verification required',
          data: {
            requires2FA: true,
            userId: user.id
          }
        });
      }

      // Generate tokens
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role, organizationId: user.organization_id },
        process.env.JWT_SECRET || 'your_jwt_secret_here',
        { expiresIn: '24h' }
      );

      const refreshToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_here',
        { expiresIn: '7d' }
      );

      return h.response({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            organizationId: user.organization_id
          },
          tokens: {
            accessToken,
            refreshToken,
            expiresIn: '24h'
          }
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Login failed');
    }
  }

  // Verify 2FA
  async verify2FA(request, h) {
    try {
      const { userId, token } = request.payload;

      // Find user
      const user = await this.userRepository.findById(userId);
      if (!user || !user.two_factor_enabled) {
        throw Boom.badRequest('Invalid 2FA request');
      }

      // Verify token
      const isValid = speakeasy.totp.verify({
        secret: user.two_factor_secret,
        encoding: 'base32',
        token: token,
        window: 2 // Allow 2 time steps tolerance
      });

      if (!isValid) {
        throw Boom.unauthorized('Invalid 2FA token');
      }

      // Generate tokens
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role, organizationId: user.organization_id },
        process.env.JWT_SECRET || 'your_jwt_secret_here',
        { expiresIn: '24h' }
      );

      const refreshToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_here',
        { expiresIn: '7d' }
      );

      return h.response({
        success: true,
        message: '2FA verification successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            organizationId: user.organization_id
          },
          tokens: {
            accessToken,
            refreshToken,
            expiresIn: '24h'
          }
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('2FA verification failed');
    }
  }

  // Setup 2FA
  async setup2FA(request, h) {
    try {
      const { userId } = request.auth.credentials;

      // Find user
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw Boom.notFound('User not found');
      }

      // Generate secret
      const secret = speakeasy.generateSecret({
        name: `${user.email} (${process.env.APP_NAME || 'Project Management'})`
      });

      // Generate QR code
      const qrCode = await QRCode.toDataURL(secret.otpauth_url);

      // Save secret temporarily (not enabled yet)
      await this.userRepository.updateUser(userId, {
        two_factor_secret: secret.base32,
        two_factor_enabled: false
      });

      return h.response({
        success: true,
        message: '2FA setup initiated',
        data: {
          qrCode,
          secret: secret.base32
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('2FA setup failed');
    }
  }

  // Enable 2FA
  async enable2FA(request, h) {
    try {
      const { userId } = request.auth.credentials;
      const { token } = request.payload;

      // Find user
      const user = await this.userRepository.findById(userId);
      if (!user || !user.two_factor_secret) {
        throw Boom.badRequest('2FA not set up');
      }

      // Verify token
      const isValid = speakeasy.totp.verify({
        secret: user.two_factor_secret,
        encoding: 'base32',
        token: token,
        window: 2
      });

      if (!isValid) {
        throw Boom.unauthorized('Invalid 2FA token');
      }

      // Enable 2FA
      await this.userRepository.updateUser(userId, {
        two_factor_enabled: true
      });

      return h.response({
        success: true,
        message: '2FA enabled successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to enable 2FA');
    }
  }

  // Disable 2FA
  async disable2FA(request, h) {
    try {
      const { userId } = request.auth.credentials;
      const { token } = request.payload;

      // Find user
      const user = await this.userRepository.findById(userId);
      if (!user || !user.two_factor_enabled) {
        throw Boom.badRequest('2FA not enabled');
      }

      // Verify token
      const isValid = speakeasy.totp.verify({
        secret: user.two_factor_secret,
        encoding: 'base32',
        token: token,
        window: 2
      });

      if (!isValid) {
        throw Boom.unauthorized('Invalid 2FA token');
      }

      // Disable 2FA
      await this.userRepository.updateUser(userId, {
        two_factor_enabled: false,
        two_factor_secret: null
      });

      return h.response({
        success: true,
        message: '2FA disabled successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to disable 2FA');
    }
  }

  // Refresh token
  async refreshToken(request, h) {
    try {
      const { refreshToken } = request.payload;

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_here');

      // Find user
      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        throw Boom.unauthorized('Invalid refresh token');
      }

      // Generate new tokens
      const newAccessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role, organizationId: user.organization_id },
        process.env.JWT_SECRET || 'your_jwt_secret_here',
        { expiresIn: '24h' }
      );

      const newRefreshToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_here',
        { expiresIn: '7d' }
      );

      return h.response({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          expiresIn: '24h'
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.unauthorized('Invalid refresh token');
    }
  }

  // Get profile
  async getProfile(request, h) {
    try {
      const { userId } = request.auth.credentials;

      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw Boom.notFound('User not found');
      }

      return h.response({
        success: true,
        message: 'Profile retrieved successfully',
        data: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          organizationId: user.organization_id,
          twoFactorEnabled: user.two_factor_enabled
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to retrieve profile');
    }
  }

  // Update profile
  async updateProfile(request, h) {
    try {
      const { userId } = request.auth.credentials;
      const { firstName, lastName } = request.payload;

      const user = await this.userRepository.updateUser(userId, {
        first_name: firstName,
        last_name: lastName
      });

      return h.response({
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update profile');
    }
  }

  // Change password
  async changePassword(request, h) {
    try {
      const { userId } = request.auth.credentials;
      const { currentPassword, newPassword } = request.payload;

      // Get user
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw Boom.notFound('User not found');
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        throw Boom.unauthorized('Current password is incorrect');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await this.userRepository.updateUser(userId, {
        password: hashedPassword
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

  // Forgot password
  async forgotPassword(request, h) {
    try {
      const { email } = request.payload;

      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        // Don't reveal if user exists
        return h.response({
          success: true,
          message: 'Password reset email sent'
        });
      }

      // Generate reset token
      const resetToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_RESET_SECRET || 'your_reset_secret_here',
        { expiresIn: '1h' }
      );

      // Save reset token
      await this.userRepository.updateUser(user.id, {
        reset_token: resetToken,
        reset_token_expires: new Date(Date.now() + 3600000) // 1 hour
      });

      // TODO: Send email with reset link
      // For now, just return success
      return h.response({
        success: true,
        message: 'Password reset email sent'
      });
    } catch (error) {
      throw Boom.internal('Failed to process forgot password');
    }
  }

  // Reset password
  async resetPassword(request, h) {
    try {
      const { token, newPassword } = request.payload;

      // Verify reset token
      const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET || 'your_reset_secret_here');

      // Find user
      const user = await this.userRepository.findById(decoded.userId);
      if (!user || user.reset_token !== token || new Date() > user.reset_token_expires) {
        throw Boom.unauthorized('Invalid or expired reset token');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password and clear reset token
      await this.userRepository.updateUser(user.id, {
        password: hashedPassword,
        reset_token: null,
        reset_token_expires: null
      });

      return h.response({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.unauthorized('Invalid reset token');
    }
  }

  // Logout
  async logout(request, h) {
    try {
      // In a real application, you might want to blacklist the token
      // For now, just return success
      return h.response({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      throw Boom.internal('Logout failed');
    }
  }
}

module.exports = new AuthHandler();
