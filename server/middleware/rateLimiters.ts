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

