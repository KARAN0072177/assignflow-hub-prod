import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import { SYSTEM_QUEUE_NAME } from "../queues/system.queue";
import mongoose from "mongoose";
import { Assignment, AssignmentState } from "../models/assignment.model";
import { Submission, SubmissionState } from "../models/submission.model";
import { connectDB } from "../db";


console.log("[Worker] Starting background worker...");

const worker = new Worker(
  SYSTEM_QUEUE_NAME,
  async (job) => {
    if (job.name !== "LOCK_EXPIRED_SUBMISSIONS") {
      return;
    }

    console.log("[Worker] Running LOCK_EXPIRED_SUBMISSIONS job");

    // Ensure DB connection (worker is separate process)
    await connectDB();

    const now = new Date();

    // 1. Find expired assignments
    const expiredAssignments = await Assignment.find({
      dueDate: { $exists: true, $lt: now },
      state: AssignmentState.PUBLISHED,
    }).select("_id");

    if (expiredAssignments.length === 0) {
      console.log("[Worker] No expired assignments found");
      return;
    }

    const assignmentIds = expiredAssignments.map((a) => a._id);

    // 2. Lock all DRAFT submissions for expired assignments
    const result = await Submission.updateMany(
      {
        assignmentId: { $in: assignmentIds },
        state: SubmissionState.DRAFT,
      },
      {
        $set: { state: SubmissionState.LOCKED },
      }
    );

    console.log(
      `[Worker] Locked ${result.modifiedCount} submissions`
    );
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