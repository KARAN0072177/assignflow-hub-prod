import rateLimit from "express-rate-limit";
import { logRateLimitHit } from "../utils/securityLogger";

const getClientIp = (req: any) =>
  req.ip ||
  req.headers["x-forwarded-for"] ||
  req.connection.remoteAddress ||
  "unknown";

// Auth rate limiter
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,

  handler: async (req, res) => {
    await logRateLimitHit({
      ip: getClientIp(req),
      endpoint: req.originalUrl,
      method: req.method,
      userAgent: req.headers["user-agent"],
    });

    res.status(429).json({
      message:
        "Too many authentication attempts. Please try again later.",
    });
  },
});

// Upload rate limiter
export const uploadRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,

  handler: async (req, res) => {
    await logRateLimitHit({
      ip: getClientIp(req),
      endpoint: req.originalUrl,
      method: req.method,
      userAgent: req.headers["user-agent"],
    });

    res.status(429).json({
      message:
        "Too many upload attempts. Please slow down.",
    });
  },
});