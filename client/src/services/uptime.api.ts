import { apiClient } from "./apiClient";

export interface UptimeData {
  uptimeRatio: string;
  status: "operational" | "degraded" | "incident" | "paused";
  isLive: boolean;
  monitoredPeriod: string;
  monitorName?: string;
  lastChecked: string;
}

export interface UptimeApiResponse {
  success: boolean;
  data: UptimeData;
}

const FALLBACK_UPTIME: UptimeData = {
  uptimeRatio: "99.95",
  status: "operational",
  isLive: false,
  monitoredPeriod: "30 days",
  lastChecked: new Date().toISOString(),
};

/**
 * Fetches live platform SLA uptime status from server
 * GET /api/system/uptime
 */
export const getPublicUptime = async (): Promise<UptimeData> => {
  try {
    const response = await apiClient.get<UptimeApiResponse>("/api/system/uptime");
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return FALLBACK_UPTIME;
  } catch (error) {
    console.warn("Failed to fetch live uptime, using fallback:", error);
    return FALLBACK_UPTIME;
  }
};
