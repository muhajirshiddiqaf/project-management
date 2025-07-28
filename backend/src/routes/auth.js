const express = require('express');
const { body, validationResult } = require('express-validator');
const AuthController = require('../controllers/authController');
const AuthMiddleware = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateRegistration = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('organizationName').optional().trim().isLength({ min: 1 }).withMessage('Organization name must not be empty'),
  body('organizationSlug').optional().trim().isLength({ min: 1 }).withMessage('Organization slug must not be empty'),
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const validateRefreshToken = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];

const validateChangePassword = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long'),
];

const validateUpdateProfile = [
  body('firstName').optional().trim().isLength({ min: 1 }).withMessage('First name must not be empty'),
  body('lastName').optional().trim().isLength({ min: 1 }).withMessage('Last name must not be empty'),
  body('avatarUrl').optional().isURL().withMessage('Avatar URL must be a valid URL'),
];

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
      code: 'VALIDATION_ERROR'
    });
  }
  next();
};

// Rate limiting for auth endpoints
const authRateLimit = AuthMiddleware.rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
});

// Routes

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register',
  authRateLimit,
  validateRegistration,
  handleValidationErrors,
  AuthController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login',
  authRateLimit,
  validateLogin,
  handleValidationErrors,
  AuthController.login
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh',
  validateRefreshToken,
  handleValidationErrors,
  AuthController.refreshToken
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout',
  AuthMiddleware.authenticate,
  AuthController.logout
);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile',
  AuthMiddleware.authenticate,
  AuthController.getProfile
);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/profile',
  AuthMiddleware.authenticate,
  validateUpdateProfile,
  handleValidationErrors,
  AuthController.updateProfile
);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post('/change-password',
  AuthMiddleware.authenticate,
  validateChangePassword,
  handleValidationErrors,
  AuthController.changePassword
);

/**
 * @route   GET /api/auth/verify
 * @desc    Verify access token
 * @access  Private
 */
router.get('/verify',
  AuthMiddleware.authenticate,
  (req, res) => {
    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        user: req.user
      }
    });
  }
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post('/forgot-password',
  authRateLimit,
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  ],
  handleValidationErrors,
  (req, res) => {
    // TODO: Implement password reset functionality
    res.json({
      success: true,
      message: 'Password reset email sent (not implemented yet)'
    });
  }
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password',
  authRateLimit,
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  ],
  handleValidationErrors,
  (req, res) => {
    // TODO: Implement password reset functionality
    res.json({
      success: true,
      message: 'Password reset successful (not implemented yet)'
    });
  }
);

/**
 * @route   POST /api/auth/2fa/setup
 * @desc    Setup two-factor authentication
 * @access  Private
 */
router.post('/2fa/setup',
  AuthMiddleware.authenticate,
  (req, res) => {
    // TODO: Implement 2FA setup
    res.json({
      success: true,
      message: '2FA setup (not implemented yet)'
    });
  }
);

/**
 * @route   POST /api/auth/2fa/verify
 * @desc    Verify two-factor authentication code
 * @access  Public
 */
router.post('/2fa/verify',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('2FA code must be 6 digits'),
  ],
  handleValidationErrors,
  (req, res) => {
    // TODO: Implement 2FA verification
    res.json({
      success: true,
      message: '2FA verification (not implemented yet)'
    });
  }
);

module.exports = router;
