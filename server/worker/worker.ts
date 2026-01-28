import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import { SYSTEM_QUEUE_NAME } from "../queues/system.queue";
import mongoose from "mongoose";

import { Assignment, AssignmentState } from "../models/assignment.model";
import { Submission, SubmissionState } from "../models/submission.model";
import { connectDB } from "../db";
import { logAuditEvent } from "../utils/auditLogger";

console.log("[Worker] Starting background worker...");

const worker = new Worker(
  SYSTEM_QUEUE_NAME,
  async (job) => {
    if (job.name !== "LOCK_EXPIRED_SUBMISSIONS") {
      return;
    }

    console.log("[Worker] Running LOCK_EXPIRED_SUBMISSIONS job");

    // Ensure DB connection (worker is a separate process)
    await connectDB();

    const now = new Date();

    // 1️⃣ Find expired assignments
    const expiredAssignments = await Assignment.find({
      dueDate: { $exists: true, $lt: now },
      state: AssignmentState.PUBLISHED,
    }).select("_id");

    if (expiredAssignments.length === 0) {
      console.log("[Worker] No expired assignments found");
      return;
    }

    const assignmentIds = expiredAssignments.map((a) => a._id);

    // 2️⃣ Find DRAFT submissions that need to be locked
    const submissionsToLock = await Submission.find({
      assignmentId: { $in: assignmentIds },
      state: SubmissionState.DRAFT,
    }).select("_id assignmentId");

    if (submissionsToLock.length === 0) {
      console.log("[Worker] No draft submissions to lock");
      return;
    }

    // 3️⃣ Lock submissions in bulk (idempotent)
    await Submission.updateMany(
      {
        _id: { $in: submissionsToLock.map((s) => s._id) },
      },
      {
        $set: { state: SubmissionState.LOCKED },
      }
    );

    console.log(
      `[Worker] Locked ${submissionsToLock.length} submissions`
    );

    // 4️⃣ Write audit logs (fire-and-forget, safe)
    for (const submission of submissionsToLock) {
      await logAuditEvent({
        actorRole: "SYSTEM",
        action: "SUBMISSION_AUTO_LOCKED",
        entityType: "SUBMISSION",
        entityId: submission._id,
        metadata: {
          assignmentId: submission.assignmentId,
          reason: "DEADLINE_EXPIRED",
          jobName: job.name,
        },
      });
    }
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