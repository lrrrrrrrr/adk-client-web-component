import { z } from 'zod';

// Environment variable validation schema
export const envSchema = z.object({
  VITE_ADK_API_URL: z.string().url().default('http://localhost:8000'),
  VITE_ADK_APP_NAME: z.string().min(1),
  VITE_ADK_USER_ID: z.string().min(1),
  VITE_ADK_SESSION_ID: z.string().min(1),
  VITE_CHAT_TITLE: z.string().optional().default('ADK Assistant'),
  VITE_CHAT_DEFAULT_MODE: z.enum(['fullscreen', 'widget']).optional().default('fullscreen'),
});

// Message validation schema
export const messageSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(10000),
  timestamp: z.date(),
  isStreaming: z.boolean().optional(),
});

// Session validation schema
export const sessionSchema = z.object({
  id: z.string(),
  appName: z.string(),
  userId: z.string(),
  state: z.record(z.unknown()),
  events: z.array(z.unknown()),
  lastUpdateTime: z.number(),
});

// Chat config validation schema
export const chatConfigSchema = z.object({
  appName: z.string().min(1),
  userId: z.string().min(1),
  sessionId: z.string().min(1),
  apiBaseUrl: z.string().url(),
  responseMode: z.enum(['stream', 'standard']),
});

// ADK Event validation schema
export const adkEventSchema = z.object({
  type: z.string(),
  data: z.unknown(),
  timestamp: z.number(),
});

// Validate environment variables at runtime
export function validateEnv() {
  try {
    const env = {
      VITE_ADK_API_URL: import.meta.env.VITE_ADK_API_URL,
      VITE_ADK_APP_NAME: import.meta.env.VITE_ADK_APP_NAME,
      VITE_ADK_USER_ID: import.meta.env.VITE_ADK_USER_ID,
      VITE_ADK_SESSION_ID: import.meta.env.VITE_ADK_SESSION_ID,
      VITE_CHAT_TITLE: import.meta.env.VITE_CHAT_TITLE,
      VITE_CHAT_DEFAULT_MODE: import.meta.env.VITE_CHAT_DEFAULT_MODE,
    };

    return envSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Environment validation failed:', error.errors);
      throw new Error('Invalid environment configuration. Please check your .env file.');
    }
    throw error;
  }
}

// Input sanitization utilities
export function sanitizeInput(input: string): string {
  // Remove control characters except newlines and tabs
  return input
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim()
    .slice(0, 10000); // Limit length
}

// URL validation and sanitization
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid protocol');
    }
    return parsed.toString();
  } catch {
    throw new Error('Invalid URL');
  }
}

// Rate limiting helper
export class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }

  getRemainingTime(): number {
    if (this.requests.length === 0) return 0;
    
    const oldestRequest = this.requests[0];
    const now = Date.now();
    const timeUntilReset = this.windowMs - (now - oldestRequest);
    
    return Math.max(0, timeUntilReset);
  }
}

// Debounce helper for input fields
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle helper for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}