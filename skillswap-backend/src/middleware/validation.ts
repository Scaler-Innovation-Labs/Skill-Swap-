import { Request, Response, NextFunction } from 'express';
import { body, validationResult, param, query } from 'express-validator';
import { AppError } from '../utils/errors';

// Validation error handler
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg
    }));

    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errorMessages
    });
    return;
  }
  
  next();
};

// User registration validation
// User registration validation
export const validateRegistration = [
  body('idToken')
    .notEmpty()
    .withMessage('Firebase ID token is required'),
    
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .trim(),
  
  // ❌ REMOVE THIS - Email comes from Firebase token
  // body('email')
  //   .isEmail()
  //   .withMessage('Valid email is required')
  //   .normalizeEmail(),
  
  body('role')
    .optional()
    .isIn(['student', 'mentor'])
    .withMessage('Role must be either student or mentor'),
  
  body('avatar_url')
    .optional()
    .isURL()
    .withMessage('Avatar URL must be a valid URL'),
  
  body('skills_offered')
    .optional()
    .isArray()
    .withMessage('Skills offered must be an array'),
    
  body('skills_wanted')
    .optional()
    .isArray()
    .withMessage('Skills wanted must be an array'),
  
  handleValidationErrors
];


// Profile update validation
export const validateProfileUpdate = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .trim(),
  
  body('avatar_url')
    .optional()
    .isURL()
    .withMessage('Avatar URL must be a valid URL'),
  
  body('skills_offered')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Skills offered must be an array with maximum 10 items'),
  
  body('skills_offered.*')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each skill must be between 1 and 50 characters'),
  
  body('skills_wanted')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Skills wanted must be an array with maximum 10 items'),
  
  body('skills_wanted.*')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each skill must be between 1 and 50 characters'),
  
  body('availability.days')
    .optional()
    .isArray()
    .withMessage('Availability days must be an array'),
  
  body('availability.days.*')
    .optional()
    .isIn(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
    .withMessage('Invalid day format'),
  
  body('availability.times')
    .optional()
    .isArray()
    .withMessage('Availability times must be an array'),
  
  handleValidationErrors
];

// Pagination validation
export const validatePagination = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
  
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be non-negative')
    .toInt(),
  
  handleValidationErrors
];

// UID parameter validation
export const validateUidParam = [
  param('uid')
    .isLength({ min: 1, max: 128 })
    .withMessage('Valid user ID is required'),
  
  handleValidationErrors
];