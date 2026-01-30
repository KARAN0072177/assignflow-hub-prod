import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/requireAuth";

export const getSystemMetadata = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const now = new Date();

    const timezone =
      Intl.DateTimeFormat().resolvedOptions().timeZone;

    return res.status(200).json({
      status: "HEALTHY",
      metadata: {
        environment: process.env.APP_ENV || process.env.NODE_ENV || "unknown",
        appVersion: process.env.APP_VERSION || "unknown",
        apiVersion: "v1",
        serverTime: now.toISOString(),
        serverTimezone: timezone,
        uptimeSeconds: Math.floor(process.uptime()),
        processId: process.pid,
        nodeVersion: process.version,
      },
    });
  } catch (error) {
    console.error("[SystemMetadata] Failed:", error);

    return res.status(500).json({
      status: "DEGRADED",
      message: "Failed to retrieve system metadata",
    });
  }
};