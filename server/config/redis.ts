// config/redis.ts
import type { ConnectionOptions } from "bullmq";

export const redisConnection: ConnectionOptions = {
  url: process.env.REDIS_URL!,
};