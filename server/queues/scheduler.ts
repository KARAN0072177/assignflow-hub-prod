import { systemQueue } from "./system.queue";

export const registerRepeatableJobs = async () => {
  console.log("[Scheduler] Registering repeatable jobs...");

  await systemQueue.add(
    "LOCK_EXPIRED_SUBMISSIONS",
    {},
    {
      repeat: {
        every: 30 * 1000, // every 5 minutes
      },
      removeOnComplete: true,
      removeOnFail: false,
    }
  );

  console.log(
    "[Scheduler] LOCK_EXPIRED_SUBMISSIONS job scheduled"
  );
};