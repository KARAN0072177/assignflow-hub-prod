// server/config/index.ts
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

/**
 * Environment schema
 * This enforces required variables at startup
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.string().transform(Number),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_SECRET: z.string().min(10, "JWT_SECRET must be at least 10 characters"),

  RESEND_API_KEY: z.string().min(10),
  UPTIMEROBOT_API_KEY: z.string().optional(),
  UPTIMEROBOT_MONITOR_ID: z.string().optional(),
});

/**
 * Parse & validate environment variables
 */
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment configuration");
  console.error(parsedEnv.error.format());
  process.exit(1);
}

/**
 * Typed, validated config object
 */
export const config = {
  env: parsedEnv.data.NODE_ENV,
  port: parsedEnv.data.PORT,
  mongoUri: parsedEnv.data.MONGO_URI,
  jwtSecret: parsedEnv.data.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || `${parsedEnv.data.JWT_SECRET}_refresh_secret`,
  accessTokenExpiry: "7d",
  refreshTokenExpiryDays: 7,

  bullmqAdminUser: process.env.BULLMQ_ADMIN_USER!,
  bullmqAdminPass: process.env.BULLMQ_ADMIN_PASS!,

  resendApiKey: parsedEnv.data.RESEND_API_KEY,

  uptimeRobotApiKey: parsedEnv.data.UPTIMEROBOT_API_KEY || process.env.UPTIMEROBOT_API_KEY || "",
  uptimeRobotMonitorId: parsedEnv.data.UPTIMEROBOT_MONITOR_ID || process.env.UPTIMEROBOT_MONITOR_ID || "",
};