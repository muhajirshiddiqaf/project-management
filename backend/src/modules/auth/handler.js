const Boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

class AuthHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // Bind all methods to preserve 'this' context
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.verify2FA = this.verify2FA.bind(this);
    this.setup2FA = this.setup2FA.bind(this);
    this.enable2FA = this.enable2FA.bind(this);
    this.disable2FA = this.disable2FA.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.logout = this.logout.bind(this);
    this.generateQRCode = this.generateQRCode.bind(this);
    this.resend2FAToken = this.resend2FAToken.bind(this);
    this.get2FAStatus = this.get2FAStatus.bind(this);
    this.backupCodes = this.backupCodes.bind(this);
    this.verifyBackupCode = this.verifyBackupCode.bind(this);
    this.initiate2FARecovery = this.initiate2FARecovery.bind(this);
    this.complete2FARecovery = this.complete2FARecovery.bind(this);
    this.get2FASettings = this.get2FASettings.bind(this);
    this.update2FASettings = this.update2FASettings.bind(this);
    this.get2FADevices = this.get2FADevices.bind(this);
    this.revoke2FADevice = this.revoke2FADevice.bind(this);
    this.get2FALogs = this.get2FALogs.bind(this);
    this.verify2FAToken = this.verify2FAToken.bind(this);
  }

  // Register user
  async register(request, h) {
    try {
      const { email, password, firstName, lastName, companyName, organizationSlug } = request.payload;

      if (!this._service) {
        throw Boom.internal('User repository not initialized');
      }

      // Check if user already exists
      const existingUser = await this._service.findByEmail(email);
      if (existingUser) {
        throw Boom.conflict('User already exists');
      }

      // Create organization slug from company name
      const slug = organizationSlug || companyName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

      // Create organization
      const organization = await this._service.createOrganization({
        name: companyName,
        slug: slug
      });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await this._service.createUser({
        email,
        password_hash: hashedPassword,
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
      console.error('Register error:', error);
      if (error.isBoom) throw error;
      throw Boom.internal('Registration failed');
    }
  }

  // Login user
  async login(request, h) {
    try {
      const { email, password } = request.payload;

      // Find user
      const user = await this._service.findByEmail(email);
      if (!user) {
        throw Boom.unauthorized('Invalid credentials');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
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
      console.error('Login error:', error);
      if (error.isBoom) throw error;
      throw Boom.internal('Login failed');
    }
  }

  // Verify 2FA
  async verify2FA(request, h) {
    try {
      const { userId, token } = request.payload;

      // Find user
      const user = await this._service.findById(userId);
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
      const user = await this._service.findById(userId);
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
      await this._service.updateUser(userId, {
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
      const user = await this._service.findById(userId);
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
      await this._service.updateUser(userId, {
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
      const user = await this._service.findById(userId);
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
      await this._service.updateUser(userId, {
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
      const user = await this._service.findById(decoded.userId);
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

      const user = await this._service.findById(userId);
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

      const user = await this._service.updateUser(userId, {
        first_name: firstName,
        last_name: lastName
      });

      return h.response({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            organizationId: user.organization_id
          }
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
      const user = await this._service.findById(userId);
      if (!user) {
        throw Boom.notFound('User not found');
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isValidPassword) {
        throw Boom.unauthorized('Current password is incorrect');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await this._service.updateUser(userId, {
        password_hash: hashedPassword
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

      const user = await this._service.findByEmail(email);
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
      await this._service.updateUser(user.id, {
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
      const user = await this._service.findById(decoded.userId);
      if (!user || user.reset_token !== token || new Date() > user.reset_token_expires) {
        throw Boom.unauthorized('Invalid or expired reset token');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password and clear reset token
      await this._service.updateUser(user.id, {
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

  // === 2FA ADDITIONAL METHODS ===

  // Generate QR Code for 2FA setup
  async generateQRCode(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const user = await this._service.findById(userId);

      if (!user) {
        throw Boom.notFound('User not found');
      }

      if (user.two_factor_enabled) {
        throw Boom.badRequest('2FA is already enabled');
      }

      // Generate new secret if not exists
      if (!user.two_factor_secret) {
        const secret = speakeasy.generateSecret({
          name: `${user.email} (${process.env.APP_NAME || 'Project Management'})`,
          issuer: process.env.APP_NAME || 'Project Management'
        });

        await this._service.updateUser(userId, {
          two_factor_secret: secret.base32
        });

        user.two_factor_secret = secret.base32;
      }

      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(user.two_factor_secret);

      return h.response({
        success: true,
        message: 'QR code generated successfully',
        data: {
          qr_code: qrCodeUrl,
          secret: user.two_factor_secret,
          backup_codes: user.backup_codes || []
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('QR code generation failed');
    }
  }

  // Resend 2FA token
  async resend2FAToken(request, h) {
    try {
      const { email } = request.payload;
      const user = await this._service.findByEmail(email);

      if (!user) {
        throw Boom.notFound('User not found');
      }

      if (!user.two_factor_enabled) {
        throw Boom.badRequest('2FA is not enabled for this user');
      }

      // Generate new token
      const token = speakeasy.totp({
        secret: user.two_factor_secret,
        encoding: 'base32'
      });

      // Send token via email (implement email service integration)
      // await emailService.send2FAToken(user.email, token);

      return h.response({
        success: true,
        message: '2FA token resent successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to resend 2FA token');
    }
  }

  // Get 2FA status
  async get2FAStatus(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const user = await this._service.findById(userId);

      if (!user) {
        throw Boom.notFound('User not found');
      }

      return h.response({
        success: true,
        data: {
          two_factor_enabled: user.two_factor_enabled || false,
          two_factor_setup: !!user.two_factor_secret,
          backup_codes_count: user.backup_codes ? user.backup_codes.length : 0,
          last_2fa_used: user.last_2fa_used
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get 2FA status');
    }
  }

  // Generate backup codes
  async backupCodes(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const user = await this._service.findById(userId);

      if (!user) {
        throw Boom.notFound('User not found');
      }

      if (!user.two_factor_enabled) {
        throw Boom.badRequest('2FA must be enabled to generate backup codes');
      }

      // Generate 10 backup codes
      const backupCodes = Array.from({ length: 10 }, () =>
        Math.random().toString(36).substring(2, 12).toUpperCase()
      );

      // Hash backup codes before storing
      const hashedBackupCodes = await Promise.all(
        backupCodes.map(code => bcrypt.hash(code, 10))
      );

      await this._service.updateUser(userId, {
        backup_codes: hashedBackupCodes
      });

      return h.response({
        success: true,
        message: 'Backup codes generated successfully',
        data: {
          backup_codes: backupCodes
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to generate backup codes');
    }
  }

  // Verify backup code
  async verifyBackupCode(request, h) {
    try {
      const { backup_code, email } = request.payload;
      const user = await this._service.findByEmail(email);

      if (!user) {
        throw Boom.notFound('User not found');
      }

      if (!user.backup_codes || user.backup_codes.length === 0) {
        throw Boom.badRequest('No backup codes available');
      }

      // Check if backup code matches
      const isValidCode = await Promise.any(
        user.backup_codes.map(async (hashedCode, index) => {
          const isValid = await bcrypt.compare(backup_code, hashedCode);
          if (isValid) {
            // Remove used backup code
            const updatedBackupCodes = user.backup_codes.filter((_, i) => i !== index);
            await this._service.updateUser(user.id, {
              backup_codes: updatedBackupCodes
            });
          }
          return isValid;
        })
      );

      if (!isValidCode) {
        throw Boom.unauthorized('Invalid backup code');
      }

      // Generate temporary access token
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role, organizationId: user.organization_id },
        process.env.JWT_SECRET || 'your_jwt_secret_here',
        { expiresIn: '1h' }
      );

      return h.response({
        success: true,
        message: 'Backup code verified successfully',
        data: {
          access_token: accessToken,
          expires_in: '1h'
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to verify backup code');
    }
  }

  // Initiate 2FA recovery
  async initiate2FARecovery(request, h) {
    try {
      const { email } = request.payload;
      const user = await this._service.findByEmail(email);

      if (!user) {
        throw Boom.notFound('User not found');
      }

      if (!user.two_factor_enabled) {
        throw Boom.badRequest('2FA is not enabled for this user');
      }

      // Generate recovery token
      const recoveryToken = jwt.sign(
        { userId: user.id, email: user.email, type: '2fa_recovery' },
        process.env.JWT_SECRET || 'your_jwt_secret_here',
        { expiresIn: '1h' }
      );

      // Send recovery email (implement email service integration)
      // await emailService.send2FARecoveryEmail(user.email, recoveryToken);

      return h.response({
        success: true,
        message: '2FA recovery initiated. Check your email for instructions.'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to initiate 2FA recovery');
    }
  }

  // Complete 2FA recovery
  async complete2FARecovery(request, h) {
    try {
      const { recovery_token, new_password } = request.payload;

      // Verify recovery token
      const decoded = jwt.verify(recovery_token, process.env.JWT_SECRET || 'your_jwt_secret_here');

      if (decoded.type !== '2fa_recovery') {
        throw Boom.unauthorized('Invalid recovery token');
      }

      const user = await this._service.findById(decoded.userId);
      if (!user) {
        throw Boom.notFound('User not found');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(new_password, 10);

      // Disable 2FA and update password
      await this._service.updateUser(user.id, {
        password: hashedPassword,
        two_factor_enabled: false,
        two_factor_secret: null,
        backup_codes: null
      });

      return h.response({
        success: true,
        message: '2FA recovery completed successfully. You can now login with your new password.'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to complete 2FA recovery');
    }
  }

  // Get 2FA settings
  async get2FASettings(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const user = await this._service.findById(userId);

      if (!user) {
        throw Boom.notFound('User not found');
      }

      return h.response({
        success: true,
        data: {
          require_2fa_for_login: user.require_2fa_for_login || false,
          require_2fa_for_admin: user.require_2fa_for_admin || false,
          backup_codes_enabled: user.backup_codes_enabled || false,
          sms_fallback_enabled: user.sms_fallback_enabled || false
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get 2FA settings');
    }
  }

  // Update 2FA settings
  async update2FASettings(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const updateData = request.payload;

      const user = await this._service.findById(userId);
      if (!user) {
        throw Boom.notFound('User not found');
      }

      await this._service.updateUser(userId, updateData);

      return h.response({
        success: true,
        message: '2FA settings updated successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update 2FA settings');
    }
  }

  // Get 2FA devices
  async get2FADevices(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const devices = await this._service.get2FADevices(userId);

      return h.response({
        success: true,
        data: {
          devices: devices || []
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get 2FA devices');
    }
  }

  // Revoke 2FA device
  async revoke2FADevice(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { device_id } = request.params;

      const result = await this._service.revoke2FADevice(userId, device_id);

      if (!result) {
        throw Boom.notFound('Device not found');
      }

      return h.response({
        success: true,
        message: '2FA device revoked successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to revoke 2FA device');
    }
  }

  // Get 2FA logs
  async get2FALogs(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { page = 1, limit = 10, start_date, end_date, action } = request.query;

      const logs = await this._service.get2FALogs(userId, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        start_date,
        end_date,
        action
      });

      return h.response({
        success: true,
        data: {
          logs: logs || [],
          pagination: {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10)
          }
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get 2FA logs');
    }
  }

  // Verify 2FA Token (for POST /2fa/verify-token)
  async verify2FAToken(request, h) {
    try {
      const { userId, token } = request.payload;
      // Find user
      const user = await this._service.findById(userId);
      if (!user || !user.two_factor_enabled) {
        throw Boom.badRequest('Invalid 2FA request');
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
      // Generate tokens
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role, organizationId: user.organization_id },
        process.env.JWT_SECRET || 'your_jwt_secret_here',
        { expiresIn: '24h' }
      );
      return h.response({
        success: true,
        message: '2FA token verified successfully',
        data: {
          accessToken,
          expiresIn: '24h'
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to verify 2FA token');
    }
  }
}

module.exports = AuthHandler;
