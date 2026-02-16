import type { ConnectionOptions } from "bullmq";

export const redisConnection: ConnectionOptions =
  process.env.REDIS_URL
    ? {
        // ✅ Production Redis (Render)
        url: process.env.REDIS_URL,
      }
    : {
        // ✅ Local Redis
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT) || 6379,
      };