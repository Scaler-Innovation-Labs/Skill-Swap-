import express from 'express';
import { ProfileController } from '../controllers/profileController';
import { MatchController } from '../controllers/matchController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateProfileUpdate, validateUidParam, validatePagination } from '../middleware/validation';
import { profileRateLimit, matchRateLimit } from '../middleware/ratelimitter';
// Add these imports at the top if missing
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation'; // Adjust path as needed

const router = express.Router();

router.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.originalUrl}`);
  next();
});

// SPECIFIC ROUTES FIRST (before any wildcard routes)

/**
 * @route   GET /api/profile/me
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/me',
  authenticateToken,
  ProfileController.getMyProfile
);

/**
 * @route   GET /api/profile/admin/stats
 * @desc    Get user statistics (admin only)
 * @access  Private (Admin)
 */
router.get('/admin/stats',
  authenticateToken,
  requireRole(['admin']),
  ProfileController.getStats
);

/**
 * @route   POST /api/profile/calendar/connect
 * @desc    Store Google Calendar access token
 * @access  Private
 */
router.post('/calendar/connect',
  authenticateToken,
  ProfileController.storeCalendarToken
);

/**
 * @route   POST /api/profile/calendar/sync
 * @desc    Sync Google Calendar availability
 * @access  Private
 */
router.post('/calendar/sync',
  authenticateToken,
  ProfileController.syncCalendarAvailability
);

/**
 * @route   POST /api/profile/session/book-two-way
 * @desc    Book a session for both users and create calendar events
 * @access  Private
 */
router.post('/session/book-two-way',
  authenticateToken,
  ProfileController.bookTwoWaySession
);

/**
 * @route   POST /api/profile/update
 * @desc    Update current user's profile
 * @access  Private
 */
router.post('/update',
  authenticateToken,
  profileRateLimit,
  validateProfileUpdate,
  ProfileController.updateProfile
);

/**
 * @route   POST /api/profile/badges
 * @desc    Update user's badge count (for achievements)
 * @access  Private
 */
router.post('/badges',
  authenticateToken,
  ProfileController.updateBadges
);

/**
 * @route   POST /api/profile/rate-session
 * @desc    Rate a completed session
 * @access  Private
 * @body    { sessionId, mentorUid, rating }
 */
router.post('/rate-session',
  authenticateToken, // Your existing middleware
  [
    body('sessionId')
      .notEmpty()
      .withMessage('Session ID is required'),
    body('mentorUid')
      .notEmpty()
      .withMessage('Mentor ID is required'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be an integer between 1 and 5'),
    handleValidationErrors
  ],
  ProfileController.rateSession
);

// WILDCARD ROUTES LAST (after all specific routes)

/**
 * @route   GET /api/profile/:uid
 * @desc    Get public profile of another user
 * @access  Public
 */
router.get('/:uid',
  validateUidParam,
  ProfileController.getUserProfile
);

/**
 * @route   DELETE /api/profile/:uid
 * @desc    Delete user profile (own profile or admin)
 * @access  Private
 */
router.delete('/:uid',
  authenticateToken,
  ProfileController.deleteProfile
);

export default router;
