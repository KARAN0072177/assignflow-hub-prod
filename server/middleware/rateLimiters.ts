import rateLimit from "express-rate-limit";

/**
 * Strict rate limiter for authentication endpoints
 * (login, register, forgot-password, verify-otp, resend-otp)
 * 10 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many authentication requests from this IP. Please try again in 15 minutes.",
  },
});

/**
 * Rate limiter for public communication forms
 * (contact us, newsletter subscription, feedback form)
 * 15 requests per 15 minutes per IP
 */
export const publicFormsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many submissions. Please slow down and try again shortly.",
  },
});

/**
 * Rate limiter for classroom actions & coursework submissions
 * 45 requests per 1 minute per IP
 */
export const courseworkLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 45,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many coursework operations. Please wait a moment.",
  },
});

/**
 * Anti-Spam Rate Limiter for Assignment Comments
 * 10 comments per 1 minute per IP/User
 */
export const commentLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // max 10 comments per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Anti-spam rate limit exceeded: Maximum 10 comments per minute allowed. Please wait before posting again.",
  },
});

/**
 * AI Enhancement Rate Limiter for Teachers
 * 5 AI enhancement requests per 1 minute per IP/User
 */
export const aiEnhancerLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // max 5 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "AI rate limit reached: Maximum 5 enhancements per minute allowed. Please wait a moment before trying again.",
  },
});

/**
 * Student AI Performance Insight Rate Limiter
 * 60 requests per 15 minutes per IP/User (Generous for high exam season traffic)
 */
export const studentInsightLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // 60 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Rate limit reached for AI performance insights. Please try again in a few minutes.",
  },
});

/**
 * Teacher AI Class Insight Rate Limiter
 * 10 requests per 10 minutes per IP/User to prevent abuse of manual generation
 */
export const teacherInsightLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Rate limit reached for AI insights generation. Please wait a few minutes before trying again.",
  },
});
