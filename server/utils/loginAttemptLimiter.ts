const attempts = new Map<
  string,
  { count: number; expiresAt: number }
>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

export const isLoginBlocked = (ip: string) => {
  const entry = attempts.get(ip);

  if (!entry) return false;

  if (Date.now() > entry.expiresAt) {
    attempts.delete(ip);
    return false;
  }

  return entry.count >= MAX_ATTEMPTS;
};

export const recordFailedLogin = (ip: string) => {
  const entry = attempts.get(ip);

  if (!entry) {
    attempts.set(ip, {
      count: 1,
      expiresAt: Date.now() + WINDOW_MS,
    });
  } else {
    entry.count += 1;
  }
};

export const resetLoginAttempts = (ip: string) => {
  attempts.delete(ip);
};