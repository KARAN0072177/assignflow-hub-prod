import { SecurityEvent, SecurityEventType } from "../models/securityEvent.model";

export const logRateLimitHit = async ({
  ip,
  endpoint,
  method,
  userAgent,
}: {
  ip: string;
  endpoint: string;
  method: string;
  userAgent?: string;
}) => {
  try {
    await SecurityEvent.create({
      type: SecurityEventType.RATE_LIMIT_HIT,
      ip,
      endpoint,
      method,
      userAgent,
    });
  } catch (err) {
    // Never break auth flow due to logging failure
    console.error("[SecurityLogger] Failed to log rate limit hit", err);
  }
};