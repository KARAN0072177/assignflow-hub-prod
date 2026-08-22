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
 * General application rate limiter for general browsing & grading suite
 * 500 requests per 15 minutes (ensures teachers grading 100+ students are never blocked)
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests from this IP. Please wait a few minutes.",
  },
});
