// routes/auth.ts - FIXED VERSION
import express from 'express';
import { AuthController } from '../controllers/authController';
import { validateRegistration } from '../middleware/validation';
import { authRateLimit } from '../middleware/ratelimitter';
import { 
  authenticateToken, 
  authenticateTokenForRegistration, 
  authenticateTokenForLogin 
} from '../middleware/auth';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user with Firebase
 * @access  Public
 * @headers Authorization: Bearer <idToken>
 * @body    { name, role?, avatar_url?, skills_offered?, skills_wanted?, availability? }
 */
router.post('/register', 
  authRateLimit,
  authenticateTokenForRegistration, // 🔥 Use registration-specific middleware
  validateRegistration,
  AuthController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user with Firebase ID token
 * @access  Public
 * @headers Authorization: Bearer <idToken>
 */
router.post('/login',
  authRateLimit,
  authenticateTokenForLogin, // 🔥 Use login-specific middleware
  AuthController.login
);

/**
 * @route   POST /api/auth/verify
 * @desc    Verify Firebase ID token
 * @access  Private
 * @headers Authorization: Bearer <idToken>
 */
router.post('/verify',
  authRateLimit,
  authenticateToken, // 🔥 Use regular middleware (requires user in DB)
  AuthController.verifyToken
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (optional endpoint)
 * @access  Private
 */
router.post('/logout',
  authenticateToken, // 🔥 Use regular middleware
  AuthController.logout
);

export default router;