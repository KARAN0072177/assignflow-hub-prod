import { Request, Response, NextFunction } from "express";
import sanitizeHtml from "sanitize-html";

/**
 * Recursively sanitizes object keys and values against NoSQL injection
 * (removes keys starting with '$' or containing '.')
 */
export const sanitizeNoSql = (target: any): any => {
  if (target === null || typeof target !== "object") {
    return target;
  }

  if (Array.isArray(target)) {
    return target.map((item) => sanitizeNoSql(item));
  }

  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(target)) {
    // Drop keys that start with '$' or contain '.' (MongoDB operator injection vectors)
    if (key.startsWith("$") || key.includes(".")) {
      continue;
    }

    sanitized[key] = sanitizeNoSql(value);
  }

  return sanitized;
};

/**
 * Express middleware for NoSQL injection prevention
 */
export const noSqlSanitizer = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req.body) {
    req.body = sanitizeNoSql(req.body);
  }
  if (req.query) {
    req.query = sanitizeNoSql(req.query);
  }
  if (req.params) {
    req.params = sanitizeNoSql(req.params);
  }
  next();
};

/**
 * Recursively strips all HTML tags from string values in an object to prevent stored/reflected XSS
 */
export const sanitizeXss = (target: any): any => {
  if (typeof target === "string") {
    return sanitizeHtml(target, {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();
  }

  if (target === null || typeof target !== "object") {
    return target;
  }

  if (Array.isArray(target)) {
    return target.map((item) => sanitizeXss(item));
  }

  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(target)) {
    sanitized[key] = sanitizeXss(value);
  }

  return sanitized;
};

/**
 * Express middleware to treat HTML characters as plain safe raw text
 */
export const xssSanitizer = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeXss(req.body);
  }
  if (req.query && typeof req.query === "object") {
    req.query = sanitizeXss(req.query);
  }
  next();
};

/**
 * SSRF URL Validator: Ensures provided URLs do not target internal or private IP spaces
 */
export const isSafeExternalUrl = (urlString: string): boolean => {
  try {
    const parsed = new URL(urlString);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();

    // Block localhost, loopback, private ranges, metadata endpoints
    if (
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname === "0.0.0.0" ||
      hostname === "169.254.169.254" || // AWS / Cloud metadata
      /^10\./.test(hostname) ||
      /^192\.168\./.test(hostname) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};
