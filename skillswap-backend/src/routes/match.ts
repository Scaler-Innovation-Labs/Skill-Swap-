import express from 'express';
import { MatchController } from '../controllers/matchController';
import { authenticateToken } from '../middleware/auth';
import { validatePagination } from '../middleware/validation';
import { matchRateLimit } from '../middleware/ratelimitter';
import { ProfileController } from '../controllers/profileController';

const router = express.Router();


// /**
//  * @route   POST /api/profile/calendar/book-session
//  * @desc    Book a session and create Google Calendar event
//  * @access  Private
//  */
// router.post('/calendar/book-session',
//   authenticateToken,
//   ProfileController.bookSession
// );

/**
 * @route   GET /api/match
 * @desc    Get matched users for current user
 * @access  Private
 * @query   { limit?, offset? }
 */
router.get('/',
  authenticateToken,
  matchRateLimit,
  validatePagination,
  MatchController.getMatches
);

/**
 * @route   POST /api/match/refresh
 * @desc    Force refresh user matches (clears cache)
 * @access  Private
 */
router.post('/refresh',
  authenticateToken,
  matchRateLimit,
  MatchController.refreshMatches
);

/**
 * @route   GET /api/match/skills/popular
 * @desc    Get popular skills for suggestions
 * @access  Public
 * @query   { limit? }
 */
router.get('/skills/popular',
  MatchController.getPopularSkills
);

/**
 * @route   GET /api/match/stats
 * @desc    Get matching statistics for current user
 * @access  Private
 */
router.get('/stats',
  authenticateToken,
  MatchController.getMatchStats
);

// Add these new routes to your existing match routes file

/**
 * @route   GET /api/match/redesigned
 * @desc    Get redesigned matches using new algorithm
 * @access  Private
 * @query   { limit?, offset? }
 */
router.get('/redesigned',
  authenticateToken,
  matchRateLimit,
  validatePagination,
  MatchController.getRedesignedMatches
);

/**
 * @route   POST /api/match/retry
 * @desc    Retry matching after denial
 * @access  Private
 * @body    { excludeUids?, retry: true }
 */
router.post('/retry',
  authenticateToken,
  matchRateLimit,
  MatchController.retryMatching
);

/**
 * @route   POST /api/match/manual
 * @desc    Manual mentor selection
 * @access  Private
 * @body    { preferredUid }
 */
router.post('/manual',
  authenticateToken,
  MatchController.manualMatch
);

/**
 * @route   POST /api/match/deny
 * @desc    Deny a mentor and exclude from future matches
 * @access  Private
 * @body    { mentorUid }
 */
router.post('/deny',
  authenticateToken,
  MatchController.denyMentor
);

export default router;