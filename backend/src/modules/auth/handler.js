const Boom = require('@hapi/boom');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

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
    this.userRepository = new UserRepository();
  }

  // Register new user
  async register(request, h) {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        organizationName,
        organizationSlug,
      } = request.payload;

      const useCase = new RegisterUserUseCase(this.userRepository);
      const result = await useCase.execute({
        email,
        password,
        firstName,
        lastName,
        organizationName,
        organizationSlug,
      });

      return h.response({
        success: true,
        message: 'User registered successfully',
        data: result
      }).code(201);

    } catch (error) {
      if (error.code === 'EMAIL_EXISTS') {
        throw Boom.conflict('Email already registered');
      }

      console.error('Registration error:', error);
      throw Boom.internal('Registration failed');
    }
  }

  // Login user
  async login(request, h) {
    try {
      const { email, password } = request.payload;

      const useCase = new LoginUserUseCase(this.userRepository);
      const result = await useCase.execute({ email, password });

      return h.response({
        success: true,
        message: 'Login successful',
        data: result
      });

    } catch (error) {
      if (error.code === 'INVALID_CREDENTIALS') {
        throw Boom.unauthorized('Invalid credentials');
      }

      console.error('Login error:', error);
      throw Boom.internal('Login failed');
    }
  }

  // Refresh token
  async refreshToken(request, h) {
    try {
      const { refreshToken } = request.payload;

      const useCase = new RefreshTokenUseCase(this.userRepository);
      const result = await useCase.execute({ refreshToken });

      return h.response({
        success: true,
        message: 'Token refreshed successfully',
        data: result
      });

    } catch (error) {
      if (error.code === 'INVALID_REFRESH_TOKEN') {
        throw Boom.unauthorized('Invalid refresh token');
      }

      console.error('Token refresh error:', error);
      throw Boom.internal('Token refresh failed');
    }
  }

  // Logout user
  async logout(request, h) {
    try {
      // In a real application, you might want to blacklist the token
      // For now, we'll just return success
      return h.response({
        success: true,
        message: 'Logout successful'
      });

    } catch (error) {
      console.error('Logout error:', error);
      throw Boom.internal('Logout failed');
    }
  }

  // Get current user profile
  async getProfile(request, h) {
    try {
      const userId = request.auth.credentials.id;

      const useCase = new GetProfileUseCase(this.userRepository);
      const result = await useCase.execute({ userId });

      return h.response({
        success: true,
        data: result
      });

    } catch (error) {
      if (error.code === 'USER_NOT_FOUND') {
        throw Boom.notFound('User not found');
      }

      console.error('Get profile error:', error);
      throw Boom.internal('Failed to get profile');
    }
  }

  // Update user profile
  async updateProfile(request, h) {
    try {
      const userId = request.auth.credentials.id;
      const { firstName, lastName, avatarUrl } = request.payload;

      const useCase = new UpdateProfileUseCase(this.userRepository);
      const result = await useCase.execute({
        userId,
        firstName,
        lastName,
        avatarUrl
      });

      return h.response({
        success: true,
        message: 'Profile updated successfully',
        data: result
      });

    } catch (error) {
      if (error.code === 'USER_NOT_FOUND') {
        throw Boom.notFound('User not found');
      }

      console.error('Update profile error:', error);
      throw Boom.internal('Failed to update profile');
    }
  }

  // Change password
  async changePassword(request, h) {
    try {
      const userId = request.auth.credentials.id;
      const { currentPassword, newPassword } = request.payload;

      const useCase = new ChangePasswordUseCase(this.userRepository);
      await useCase.execute({
        userId,
        currentPassword,
        newPassword
      });

      return h.response({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      if (error.code === 'INVALID_CURRENT_PASSWORD') {
        throw Boom.unauthorized('Current password is incorrect');
      }

      if (error.code === 'USER_NOT_FOUND') {
        throw Boom.notFound('User not found');
      }

      console.error('Change password error:', error);
      throw Boom.internal('Failed to change password');
    }
  }

  // Verify token
  async verifyToken(request, h) {
    try {
      return h.response({
        success: true,
        message: 'Token is valid',
        data: {
          user: request.auth.credentials
        }
      });

    } catch (error) {
      console.error('Token verification error:', error);
      throw Boom.internal('Token verification failed');
    }
  }

  // Forgot password (placeholder)
  async forgotPassword(request, h) {
    try {
      // TODO: Implement password reset functionality
      return h.response({
        success: true,
        message: 'Password reset email sent (not implemented yet)'
      });

    } catch (error) {
      console.error('Forgot password error:', error);
      throw Boom.internal('Failed to send password reset email');
    }
  }

  // Reset password (placeholder)
  async resetPassword(request, h) {
    try {
      // TODO: Implement password reset functionality
      return h.response({
        success: true,
        message: 'Password reset successful (not implemented yet)'
      });

    } catch (error) {
      console.error('Reset password error:', error);
      throw Boom.internal('Failed to reset password');
    }
  }

  // Setup 2FA (placeholder)
  async setup2FA(request, h) {
    try {
      // TODO: Implement 2FA setup
      return h.response({
        success: true,
        message: '2FA setup (not implemented yet)'
      });

    } catch (error) {
      console.error('2FA setup error:', error);
      throw Boom.internal('Failed to setup 2FA');
    }
  }

  // Verify 2FA (placeholder)
  async verify2FA(request, h) {
    try {
      // TODO: Implement 2FA verification
      return h.response({
        success: true,
        message: '2FA verification (not implemented yet)'
      });

    } catch (error) {
      console.error('2FA verification error:', error);
      throw Boom.internal('Failed to verify 2FA');
    }
  }
}

module.exports = new AuthHandler();
