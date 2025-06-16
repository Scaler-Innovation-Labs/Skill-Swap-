import { Request, Response, NextFunction } from 'express';
import { CacheService } from '../config/redis';
import { logger } from '../utils/logger';
import redisClient from "../config/redis";


// Advanced rate limiter using Redis
export const createRateLimiter = (options: {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
}) => {
  const {
    windowMs,
    maxRequests,
    keyGenerator = (req: Request) => req.ip,
    skipSuccessfulRequests = false
  } = options;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const key = `rate_limit:${keyGenerator(req)}`;
      const windowSeconds = Math.floor(windowMs / 1000);
      
      const isAllowed = await CacheService.checkRateLimit(key, maxRequests, windowSeconds);
      
      if (!isAllowed) {
        logger.warn(`🚫 Rate limit exceeded for: ${keyGenerator(req)}`);
        
        res.status(429).json({
          success: false,
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: windowSeconds
        });
        return;
      }

      // If configured to skip successful requests, decrement counter on successful response
      if (skipSuccessfulRequests) {
        const originalSend = res.json;
        res.json = function(data: any) {
          if (res.statusCode < 400) {
            // Decrement counter for successful requests (fire and forget)
            redisClient.decr(key).catch(() => {});
          }
          return originalSend.call(this, data);
        };
      }

      next();
    } catch (error) {
      logger.error('❌ Rate limiter error:', error);
      // Allow request if rate limiter fails
      next();
    }
  };
};

// Specific rate limiters for different endpoints

export const authRateLimit = createRateLimiter({
  windowMs: 1 * 60 * 1000, // 3 minutes

  maxRequests: 10000, // 1 attempts per 3 minutes

  keyGenerator: (req) => `auth:${req.ip}:${req.body.email || 'unknown'}`
});

export const profileRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute

  maxRequests: 10000, // 11 requests per minute

  keyGenerator: (req) => `profile:${req.user?.uid || req.ip}`
});

export const matchRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute

  maxRequests: 10000, // 7 match requests per minute

  keyGenerator: (req) => `match:${req.user?.uid || req.ip}`
});
