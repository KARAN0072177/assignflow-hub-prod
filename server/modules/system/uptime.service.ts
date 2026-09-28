import { config } from "../../config";

export interface UptimeStatusResult {
  uptimeRatio: string;
  status: "operational" | "degraded" | "incident" | "paused";
  isLive: boolean;
  monitoredPeriod: string;
  monitorName?: string;
  lastChecked: string;
  cached: boolean;
}

interface CacheEntry {
  data: UptimeStatusResult;
  expiresAt: number;
}

// 10 minutes in-memory cache to strictly preserve UptimeRobot API rate limits
const CACHE_TTL_MS = 10 * 60 * 1000;
let memoryCache: CacheEntry | null = null;

const DEFAULT_FALLBACK: UptimeStatusResult = {
  uptimeRatio: "99.95",
  status: "operational",
  isLive: false,
  monitoredPeriod: "30 days",
  lastChecked: new Date().toISOString(),
  cached: false,
};

export class UptimeService {
  /**
   * Fetches latest uptime metrics from UptimeRobot with in-memory caching
   */
  public static async getUptimeStats(): Promise<UptimeStatusResult> {
    const apiKey = config.uptimeRobotApiKey || process.env.UPTIMEROBOT_API_KEY;
    const monitorId = config.uptimeRobotMonitorId || process.env.UPTIMEROBOT_MONITOR_ID;

    // Check if we have valid unexpired cache
    const now = Date.now();
    if (memoryCache && memoryCache.expiresAt > now) {
      return { ...memoryCache.data, cached: true };
    }

    // If API key is not configured yet, return fallback gracefully
    if (!apiKey || apiKey.trim() === "") {
      return {
        ...DEFAULT_FALLBACK,
        lastChecked: new Date().toISOString(),
      };
    }

    try {
      const bodyParams: Record<string, string> = {
        api_key: apiKey.trim(),
        format: "json",
        custom_uptime_ratios: "30",
        all_time_uptime_ratio: "1",
      };

      if (monitorId && monitorId.trim() !== "") {
        bodyParams.monitors = monitorId.trim();
      }

      const response = await fetch("https://api.uptimerobot.com/v2/getMonitors", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cache-Control": "no-cache",
        },
        body: new URLSearchParams(bodyParams).toString(),
        signal: AbortSignal.timeout(7000),
      });

      if (!response.ok) {
        console.warn(`[UptimeService] UptimeRobot API responded with status ${response.status}`);
        return memoryCache ? { ...memoryCache.data, cached: true } : DEFAULT_FALLBACK;
      }

      const json: any = await response.json();

      if (json.stat !== "ok" || !Array.isArray(json.monitors) || json.monitors.length === 0) {
        console.warn("[UptimeService] UptimeRobot API notice:", json.message || json);
        return memoryCache ? { ...memoryCache.data, cached: true } : DEFAULT_FALLBACK;
      }

      const monitor = json.monitors[0];

      // Parse custom 30-day ratio or fallback to all_time or 99.95
      let ratioNum = parseFloat(monitor.custom_uptime_ratio);
      if (isNaN(ratioNum) || ratioNum <= 0) {
        ratioNum = parseFloat(monitor.all_time_uptime_ratio);
      }
      if (isNaN(ratioNum) || ratioNum <= 0) {
        ratioNum = 99.95;
      }

      // Map UptimeRobot status code
      // 0: paused, 1: not checked, 2: up, 8: seems down, 9: down
      let status: "operational" | "degraded" | "incident" | "paused" = "operational";
      if (monitor.status === 2) {
        status = "operational";
      } else if (monitor.status === 8) {
        status = "degraded";
      } else if (monitor.status === 9) {
        status = "incident";
      } else if (monitor.status === 0) {
        status = "paused";
      }

      const result: UptimeStatusResult = {
        uptimeRatio: ratioNum.toFixed(2),
        status,
        isLive: true,
        monitoredPeriod: "30 days",
        monitorName: monitor.friendly_name || "AssignFlow API Health",
        lastChecked: new Date().toISOString(),
        cached: false,
      };

      // Store in memory cache
      memoryCache = {
        data: result,
        expiresAt: now + CACHE_TTL_MS,
      };

      return result;
    } catch (error: any) {
      console.warn("[UptimeService] Failed to query UptimeRobot:", error.message || error);
      if (memoryCache) {
        return { ...memoryCache.data, cached: true };
      }
      return {
        ...DEFAULT_FALLBACK,
        lastChecked: new Date().toISOString(),
      };
    }
  }
}
