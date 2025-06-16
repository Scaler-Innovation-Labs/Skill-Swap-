// app.ts - ENHANCED VERSION
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import compression from 'compression';

import { logger } from './utils/logger';
import { errorHandler, notFound } from './utils/errors';

// Import routes
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import matchRoutes from './routes/match';

const app = express();

// Trust proxy if behind reverse proxy (important for rate limiting)
app.set('trust proxy', process.env.NODE_ENV === 'production' ? 1 : false);

// Compression middleware (should be early in stack)
app.use(compression());

// Enhanced security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://identitytoolkit.googleapis.com"], // Firebase Auth
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: "same-origin" }
}));

// Enhanced CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    const allowedOrigins = process.env.NODE_ENV === 'production' 
      ? (process.env.ALLOWED_ORIGINS || 'https://skillswap.vercel.app').split(',')
      : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  optionsSuccessStatus: 200, // For legacy browser support
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Enhanced rate limiting with different tiers
const createRateLimit = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip successful requests to allow more failed attempts to be blocked
    skipSuccessfulRequests: true,
    // Custom key generator for better rate limiting
    keyGenerator: (req) => {
      return req.ip + ':' + (req.headers['user-agent'] || '');
    }
  });
};

// Apply different rate limits
const generalLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  'Too many requests from this IP, please try again later'
);

const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes  
  10, // Stricter limit for auth endpoints
  'Too many authentication attempts, please try again later'
);

// Apply general rate limiting
app.use(generalLimiter);

// Body parsing middleware with size limits
app.use(express.json({ 
  limit: '1mb', // Reduced from 10mb for security
  verify: (req, res, buf) => {
    // Store raw body for webhook verification if needed
    (req as any).rawBody = buf;
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '1mb',
  parameterLimit: 100 // Prevent parameter pollution
}));

// Enhanced logging middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
  stream: {
    write: (message: string) => {
      // Remove sensitive data from logs
      const sanitized = message.replace(/authorization:\s*[^\s]+/gi, 'authorization: [REDACTED]');
      logger.info(sanitized.trim());
    }
  },
  skip: (req, res) => {
    // Skip logging health checks in production
    return process.env.NODE_ENV === 'production' && req.url === '/health';
  }
}));

// Request ID middleware for tracing
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] || 
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
});

// Health check endpoint (before rate limiting for monitoring)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
    }
  });
});

// API routes with specific rate limiting
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/match', matchRoutes);

// API documentation redirect
app.get('/api/docs', (req, res) => {
  res.redirect('https://documenter.getpostman.com/view/your-collection-id');
});

// Welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🎯 Welcome to SkillSwap Backend API',
    version: process.env.npm_package_version || '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      profile: '/api/profile', 
      match: '/api/match',
      health: '/health'
    },
    timestamp: new Date().toISOString()
  });
});

// Catch 404 and forward to error handler
app.use(notFound);

// Global error handling middleware (must be last)
app.use(errorHandler);

export default app;