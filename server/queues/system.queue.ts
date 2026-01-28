import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const SYSTEM_QUEUE_NAME = "systemQueue";

export const systemQueue = new Queue(SYSTEM_QUEUE_NAME, {
  connection: redisConnection,
});