import { z } from 'zod';

// Time range validation regex
const timeRangeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]-([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

// Custom time range validator
const timeRangeValidator = (timeRange: string): boolean => {
  if (!timeRangeRegex.test(timeRange)) return false;
  
  const [start, end] = timeRange.split('-');
  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  return startMinutes < endMinutes;
};

// User registration schema
export const registerSchema = z.object({
  idToken: z.string().min(1, 'Firebase ID token is required'),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  email: z.string().email('Valid email is required'),
  role: z.enum(['student', 'mentor']).optional().default('student'),
  avatar_url: z.string().url('Invalid avatar URL').optional(),
  skills_offered: z.array(z.string().min(1).max(50))
    .max(10, 'Maximum 10 skills allowed')
    .optional()
    .default([]),
  skills_wanted: z.array(z.string().min(1).max(50))
    .max(10, 'Maximum 10 skills allowed')
    .optional()
    .default([]),
  availability: z.object({
    days: z.array(z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']))
      .optional()
      .default([]),
    times: z.array(
      z.string().refine(timeRangeValidator, {
        message: 'Invalid time range format. Use "HH:MM-HH:MM" where start time is before end time'
      })
    )
      .optional()
      .default([])
  }).optional().default({ days: [], times: [] })
});

// Profile update schema
export const updateProfileSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters')
    .optional(),
  avatar_url: z.string().url('Invalid avatar URL').optional(),
  skills_offered: z.array(z.string().min(1).max(50))
    .max(10, 'Maximum 10 skills allowed')
    .optional(),
  skills_wanted: z.array(z.string().min(1).max(50))
    .max(10, 'Maximum 10 skills allowed')
    .optional(),
  availability: z.object({
    days: z.array(z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']))
      .optional(),
    times: z.array(
      z.string().refine(timeRangeValidator, {
        message: 'Invalid time range format. Use "HH:MM-HH:MM" where start time is before end time'
      })
    )
      .optional()
  }).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update'
});

// Login schema
export const loginSchema = z.object({
  idToken: z.string().min(1, 'Firebase ID token is required')
});

// Pagination schema
export const paginationSchema = z.object({
  limit: z.number().int().min(1).max(100).optional().default(10),
  offset: z.number().int().min(0).optional().default(0)
});

// UID parameter schema
export const uidParamSchema = z.object({
  uid: z.string().min(1, 'User ID is required').max(128, 'Invalid user ID format')
});

// Validation helper function
export const validateSchema = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      throw new Error(`Validation failed: ${JSON.stringify(errorMessages)}`);
    }
    throw error;
  }
};

// Skill name validator
export const isValidSkillName = (skill: string): boolean => {
  return /^[a-zA-Z0-9\s\-\+\#\.\/]+$/.test(skill) && skill.length >= 1 && skill.length <= 50;
};

// Email validator
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// URL validator
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Time range format validator (HH:MM-HH:MM) - UPDATED
export const isValidTimeFormat = (timeRange: string): boolean => {
  return timeRangeValidator(timeRange);
};

// Day validator - KEPT ORIGINAL FORMAT
export const isValidDay = (day: string): boolean => {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].includes(day);
};

// Clean and validate skills array
export const cleanSkillsArray = (skills: string[]): string[] => {
  return skills
    .map(skill => skill.trim())
    .filter(skill => skill.length > 0 && isValidSkillName(skill))
    .slice(0, 10); // Limit to 10 skills
};

export const timeRangesOverlap = (range1: string, range2: string): boolean => {
  const parsed1 = parseTimeRange(range1);
  const parsed2 = parseTimeRange(range2);
  
  if (!parsed1 || !parsed2) return false;
  
  const [start1Hour, start1Min] = parsed1.start.split(':').map(Number);
  const [end1Hour, end1Min] = parsed1.end.split(':').map(Number);
  const [start2Hour, start2Min] = parsed2.start.split(':').map(Number);
  const [end2Hour, end2Min] = parsed2.end.split(':').map(Number);
  
  const start1Minutes = start1Hour * 60 + start1Min;
  const end1Minutes = end1Hour * 60 + end1Min;
  const start2Minutes = start2Hour * 60 + start2Min;
  const end2Minutes = end2Hour * 60 + end2Min;
  
  // Two ranges overlap if: start1 < end2 AND start2 < end1
  return start1Minutes < end2Minutes && start2Minutes < end1Minutes;
};


// Clean and validate availability
export const cleanAvailability = (availability: any): { days: string[], times: string[] } => {
  const cleaned = {
    days: [] as string[],
    times: [] as string[]
  };

  if (availability?.days && Array.isArray(availability.days)) {
    cleaned.days = availability.days.filter(isValidDay);
  }

  if (availability?.times && Array.isArray(availability.times)) {
    cleaned.times = availability.times.filter(isValidTimeFormat);
  }

  return cleaned;
};

// Helper function to parse time range
export const parseTimeRange = (timeRange: string): { start: string, end: string } | null => {
  if (!isValidTimeFormat(timeRange)) return null;
  
  const [start, end] = timeRange.split('-');
  return { start, end };
};


