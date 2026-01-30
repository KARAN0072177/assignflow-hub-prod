import { ErrorLog, ErrorSeverity } from "../models/errorLog.model";

export const logSystemError = async ({
  source,
  message,
  severity,
  route,
  method,
  statusCode,
  jobName,
  stack,
}: {
  source: "API" | "WORKER";
  message: string;
  severity: ErrorSeverity;
  route?: string;
  method?: string;
  statusCode?: number;
  jobName?: string;
  stack?: string;
}) => {
  try {
    await ErrorLog.create({
      source,
      message,
      severity,
      route,
      method,
      statusCode,
      jobName,
      stack,
    });
  } catch (err) {
    // NEVER crash system for logging failure
    console.error("[ErrorLogger] Failed to persist error", err);
  }
};