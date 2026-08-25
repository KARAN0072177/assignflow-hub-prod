import { Request, Response, NextFunction } from "express";

/**
 * 30-Minute IP Ban Store
 */
interface BanRecord {
  bannedUntil: number;
  reason: string;
}

const ipBans = new Map<string, BanRecord>();
export const BAN_DURATION_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Failed Login Attempts Store (10 failed attempts under 1 minute)
 */
const loginFailures = new Map<string, number[]>();
export const FAILED_LOGIN_WINDOW_MS = 1 * 60 * 1000; // 1 minute
export const MAX_FAILED_LOGINS = 10;

/**
 * Account Creation Attempts Store (5 accounts under 1 minute)
 */
const registerAttempts = new Map<string, number[]>();
export const REGISTER_WINDOW_MS = 1 * 60 * 1000; // 1 minute
export const MAX_REGISTER_ACCOUNTS = 5;

/**
 * Password Change Attempts Store (5 password changes under 1 hour)
 */
const passwordChangeAttempts = new Map<string, number[]>();
export const PASSWORD_CHANGE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
export const MAX_PASSWORD_CHANGES = 5;

/**
 * Generic Rate Limit Message (No internal infrastructure details exposed)
 */
export const GENERIC_RATE_LIMIT_MSG = "Too many requests. Please try again later.";

/**
 * Extract clean client IP
 */
export const getClientIp = (req: Request): string => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || req.socket.remoteAddress || "unknown";
};

/**
 * Check if IP is actively banned
 */
export const isIpBlocked = (ip: string): boolean => {
  if (!ip || ip === "unknown") return false;

  const ban = ipBans.get(ip);
  if (!ban) return false;

  if (Date.now() > ban.bannedUntil) {
    ipBans.delete(ip);
    return false;
  }

  return true;
};

/**
 * Block an IP for 30 minutes
 */
export const blockIp = (ip: string, reason: string): void => {
  if (!ip || ip === "unknown") return;
  ipBans.set(ip, {
    bannedUntil: Date.now() + BAN_DURATION_MS,
    reason,
  });
  console.warn(`[AUTH-SECURITY] Blocked IP ${ip} for 30 minutes. Trigger: ${reason}`);
};

/**
 * Rule 1: Failed Login Limiter
 * Returns true if the IP has reached/exceeded 10 failed logins in 1 minute and is now blocked for 30m.
 */
export const recordFailedLoginAttempt = (ip: string): boolean => {
  if (!ip || ip === "unknown") return false;

  const now = Date.now();
  const history = loginFailures.get(ip) || [];
  // Keep only failed attempts within the 1-minute window
  const recent = history.filter((t) => now - t <= FAILED_LOGIN_WINDOW_MS);
  recent.push(now);
  loginFailures.set(ip, recent);

  if (recent.length >= MAX_FAILED_LOGINS) {
    blockIp(ip, "10 failed login attempts under 1 minute");
    loginFailures.delete(ip);
    return true;
  }

  return false;
};

/**
 * Clear failed login attempts upon a successful login
 */
export const resetFailedLoginAttempts = (ip: string): void => {
  loginFailures.delete(ip);
};

/**
 * Rule 2: Account Creation Limiter (5 accounts created under 1 minute)
 * Returns true if limit is exceeded (and bans IP for 30m).
 */
export const checkAndRecordRegisterAttempt = (ip: string): boolean => {
  if (!ip || ip === "unknown") return false;

  if (isIpBlocked(ip)) return true;

  const now = Date.now();
  const history = registerAttempts.get(ip) || [];
  const recent = history.filter((t) => now - t <= REGISTER_WINDOW_MS);

  if (recent.length >= MAX_REGISTER_ACCOUNTS) {
    blockIp(ip, "5 accounts created under 1 minute");
    return true;
  }

  recent.push(now);
  registerAttempts.set(ip, recent);
  return false;
};

/**
 * Rule 3: Password Change Limiter (5 times under 1 hour)
 * Returns true if limit is exceeded (and bans IP for 30m).
 */
export const checkAndRecordPasswordChangeAttempt = (ip: string): boolean => {
  if (!ip || ip === "unknown") return false;

  if (isIpBlocked(ip)) return true;

  const now = Date.now();
  const history = passwordChangeAttempts.get(ip) || [];
  const recent = history.filter((t) => now - t <= PASSWORD_CHANGE_WINDOW_MS);

  if (recent.length >= MAX_PASSWORD_CHANGES) {
    blockIp(ip, "5 password changes under 1 hour");
    return true;
  }

  recent.push(now);
  passwordChangeAttempts.set(ip, recent);
  return false;
};

/**
 * Express Middleware: Blocks banned IPs from hitting auth endpoints
 */
export const authIpSecurityMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = getClientIp(req);
  if (isIpBlocked(ip)) {
    return res.status(429).json({
      message: GENERIC_RATE_LIMIT_MSG,
    });
  }
  next();
};
