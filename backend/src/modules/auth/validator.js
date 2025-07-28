const Joi = require('@hapi/joi');

const authValidator = {
  // Registration schema
  registerSchema: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'any.required': 'Password is required'
      }),
    firstName: Joi.string()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.min': 'First name must not be empty',
        'string.max': 'First name must not exceed 50 characters',
        'any.required': 'First name is required'
      }),
    lastName: Joi.string()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.min': 'Last name must not be empty',
        'string.max': 'Last name must not exceed 50 characters',
        'any.required': 'Last name is required'
      }),
    organizationName: Joi.string()
      .min(1)
      .max(100)
      .optional()
      .messages({
        'string.min': 'Organization name must not be empty',
        'string.max': 'Organization name must not exceed 100 characters'
      }),
    organizationSlug: Joi.string()
      .min(1)
      .max(50)
      .pattern(/^[a-z0-9-]+$/)
      .optional()
      .messages({
        'string.min': 'Organization slug must not be empty',
        'string.max': 'Organization slug must not exceed 50 characters',
        'string.pattern.base': 'Organization slug must contain only lowercase letters, numbers, and hyphens'
      })
  }),

  // Login schema
  loginSchema: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  }),

  // Refresh token schema
  refreshTokenSchema: Joi.object({
    refreshToken: Joi.string()
      .required()
      .messages({
        'any.required': 'Refresh token is required'
      })
  }),

  // Update profile schema
  updateProfileSchema: Joi.object({
    firstName: Joi.string()
      .min(1)
      .max(50)
      .optional()
      .messages({
        'string.min': 'First name must not be empty',
        'string.max': 'First name must not exceed 50 characters'
      }),
    lastName: Joi.string()
      .min(1)
      .max(50)
      .optional()
      .messages({
        'string.min': 'Last name must not be empty',
        'string.max': 'Last name must not exceed 50 characters'
      }),
    avatarUrl: Joi.string()
      .uri()
      .optional()
      .messages({
        'string.uri': 'Avatar URL must be a valid URL'
      })
  }),

  // Change password schema
  changePasswordSchema: Joi.object({
    currentPassword: Joi.string()
      .required()
      .messages({
        'any.required': 'Current password is required'
      }),
    newPassword: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.min': 'New password must be at least 8 characters long',
        'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'any.required': 'New password is required'
      })
  }),

  // Forgot password schema
  forgotPasswordSchema: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      })
  }),

  // Reset password schema
  resetPasswordSchema: Joi.object({
    token: Joi.string()
      .required()
      .messages({
        'any.required': 'Reset token is required'
      }),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'any.required': 'Password is required'
      })
  }),

  // Verify 2FA schema
  verify2FASchema: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    code: Joi.string()
      .length(6)
      .pattern(/^\d{6}$/)
      .required()
      .messages({
        'string.length': '2FA code must be exactly 6 digits',
        'string.pattern.base': '2FA code must contain only numbers',
        'any.required': '2FA code is required'
      })
  }),

  // Common validation functions
  validateEmail: (email) => {
    const schema = Joi.string().email();
    return schema.validate(email);
  },

  validatePassword: (password) => {
    const schema = Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/);
    return schema.validate(password);
  },

  validateUUID: (uuid) => {
    const schema = Joi.string().uuid();
    return schema.validate(uuid);
  },

  validateOrganizationSlug: (slug) => {
    const schema = Joi.string()
      .min(1)
      .max(50)
      .pattern(/^[a-z0-9-]+$/);
    return schema.validate(slug);
  }
};

module.exports = authValidator;
