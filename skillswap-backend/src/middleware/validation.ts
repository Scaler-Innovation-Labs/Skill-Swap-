import { Request, Response, NextFunction } from 'express';
import { body, validationResult, param, query } from 'express-validator';
import { AppError } from '../utils/errors';
// Import the overlap function
import { timeRangesOverlap } from '../utils/validators';

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

// User registration validation - FIXED
export const validateRegistration = [
  // ❌ REMOVED - Token is handled by middleware now
  // body('idToken')
  //   .notEmpty()
  //   .withMessage('Firebase ID token is required'),
    
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .trim(),
  
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

  // Keep original days format (Mon, Tue, etc.)
  body('availability.days')
    .optional()
    .isArray()
    .withMessage('Availability days must be an array'),
  
  body('availability.days.*')
    .optional()
    .isIn(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
    .withMessage('Invalid day format'),
  
 // Updated times format for ranges
body('availability.times')
  .optional()
  .isArray()
  .withMessage('Availability times must be an array')
  .custom((times) => {
    const timeRangePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]-([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (times && !times.every((time: string) => timeRangePattern.test(time))) {
      //                      ^^^^^^^^^^^^^ Add explicit string type here
      throw new Error('Times must be in format "HH:MM-HH:MM" (e.g., "09:00-12:00")');
    }
    return true;
  }),
  
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
  
  // Keep original days format (Mon, Tue, etc.)
  body('availability.days')
    .optional()
    .isArray()
    .withMessage('Availability days must be an array'),
  
  body('availability.days.*')
    .optional()
    .isIn(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
    .withMessage('Invalid day format'),
  
  // Updated times format for ranges
  body('availability.times')
    .optional()
    .isArray()
    .withMessage('Availability times must be an array')
   .custom((times) => {
    const timeRangePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]-([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (times && !times.every((time: string) => timeRangePattern.test(time))) {
      //                      ^^^^^^^^^^^^^ Explicitly typed as string
      throw new Error('Times must be in format "HH:MM-HH:MM" (e.g., "09:00-12:00")');
    }
      // Additional validation: start time should be before end time
      if (times) {
        for (const timeRange of times) {
          const [start, end] = timeRange.split('-');
          const [startHour, startMin] = start.split(':').map(Number);
          const [endHour, endMin] = end.split(':').map(Number);
          const startMinutes = startHour * 60 + startMin;
          const endMinutes = endHour * 60 + endMin;
          
          if (startMinutes >= endMinutes) {
            throw new Error(`Invalid time range "${timeRange}": start time must be before end time`);
          }

             // Check for overlaps - STRICT REJECTION
          if (times && times.length > 1) {
            for (let i = 0; i < times.length; i++) {
              for (let j = i + 1; j < times.length; j++) {
                if (timeRangesOverlap(times[i], times[j])) {
                  throw new Error(`Time ranges "${times[i]}" and "${times[j]}" overlap. Please use non-overlapping time slots.`);
                }
              }
            }
          }
        }
      }
      return true;
    }),
  
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
