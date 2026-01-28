import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import { SYSTEM_QUEUE_NAME } from "../queues/system.queue";

console.log("[Worker] Starting background worker...");

const worker = new Worker(
  SYSTEM_QUEUE_NAME,
  async (job) => {
    // Placeholder processor
    console.log(`[Worker] Received job: ${job.name}`);
  },
  {
    connection: redisConnection,
  }
);

worker.on("completed", (job) => {
  console.log(`[Worker] Job completed: ${job.name}`);
});

worker.on("failed", (job, err) => {
  console.error(
    `[Worker] Job failed: ${job?.name}`,
    err
  );
});