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
  bullmqAdminUser: process.env.BULLMQ_ADMIN_USER!,
  bullmqAdminPass: process.env.BULLMQ_ADMIN_PASS!,
  gmailUser: process.env.GMAIL_USER!,
  gmailAppPassword:process.env.GMAIL_APP_PASSWORD!,
  resendApiKey: process.env.RESEND_API_KEY!,
  ADMIN_CONTACT_EMAIL:process.env.ADMIN_CONTACT_EMAIL,
};