import { logoutUser } from "./auth.api";

// 1 Week inactivity window: 7 days in milliseconds
export const INACTIVITY_TIMEOUT_MS = 7 * 24 * 60 * 60 * 1000;

// Throttle activity recording to once every 30 seconds
const ACTIVITY_THROTTLE_MS = 30 * 1000;
let lastRecordedTime = 0;

/**
 * Records user activity by updating the timestamp in localStorage.
 * Throttled to avoid unnecessary localStorage writes.
 */
export const recordUserActivity = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  const now = Date.now();
  if (now - lastRecordedTime > ACTIVITY_THROTTLE_MS) {
    lastRecordedTime = now;
    localStorage.setItem("lastActivityTimestamp", now.toString());
  }
};

/**
 * Checks if the user has been inactive for longer than 1 week.
 * If inactive for > 1 week, logs out the user and redirects to login.
 */
export const checkInactivity = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  const storedTime = localStorage.getItem("lastActivityTimestamp");
  const now = Date.now();

  if (!storedTime) {
    // Initialize timestamp if missing
    localStorage.setItem("lastActivityTimestamp", now.toString());
    lastRecordedTime = now;
    return;
  }

  const lastActivity = Number(storedTime);
  const inactiveDuration = now - lastActivity;

  if (inactiveDuration > INACTIVITY_TIMEOUT_MS) {
    console.warn(
      `[InactivityTracker] User has been inactive for ${Math.round(
        inactiveDuration / (1000 * 60 * 60 * 24)
      )} days (limit: 7 days). Auto-logging out.`
    );

    await logoutUser();

    // Redirect to login with reason
    const currentPath = window.location.pathname;
    const isPublic =
      currentPath === "/" ||
      currentPath === "/home" ||
      currentPath.startsWith("/login") ||
      currentPath.startsWith("/register");

    if (!isPublic) {
      window.location.href = `/login?redirect=${encodeURIComponent(
        currentPath
      )}&expired=true`;
    }
  }
};

/**
 * Initializes listeners for user actions to track active usage and enforce 1-week inactivity logout.
 */
export const initInactivityTracker = () => {
  // Check immediately on load
  void checkInactivity();

  // Record initial activity if logged in
  recordUserActivity();

  // Activity events
  const activityEvents = ["mousedown", "keydown", "scroll", "touchstart"];
  const handleActivity = () => {
    recordUserActivity();
  };

  activityEvents.forEach((event) => {
    window.addEventListener(event, handleActivity, { passive: true });
  });

  // Check whenever user returns to tab
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      void checkInactivity();
      recordUserActivity();
    }
  };
  document.addEventListener("visibilitychange", handleVisibilityChange);

  // Periodic check every minute
  const intervalId = setInterval(() => {
    void checkInactivity();
  }, 60 * 1000);

  return () => {
    activityEvents.forEach((event) => {
      window.removeEventListener(event, handleActivity);
    });
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    clearInterval(intervalId);
  };
};
