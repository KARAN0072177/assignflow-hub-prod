import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/requireAuth";
import { Assignment } from "../../models/assignment.model";
import { Submission, SubmissionState } from "../../models/submission.model";
import { Grade } from "../../models/grade.model";

export const getSystemMetadata = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const now = new Date();

        const timezone =
            Intl.DateTimeFormat().resolvedOptions().timeZone;

        /* =====================
     DATA INTEGRITY CHECKS
  ===================== */

        // Get all assignment IDs (used for orphan check)
        const assignmentIds = await Assignment.find().select("_id");
        const assignmentIdSet = assignmentIds.map((a) => a._id.toString());

        // 1️⃣ Orphaned submissions (submission without assignment)
        const orphanedSubmissions = await Submission.find({
            assignmentId: { $nin: assignmentIdSet },
        }).countDocuments();

        // 2️⃣ Submitted submissions without grades
        const submittedWithoutGrades = await Submission.aggregate([
            { $match: { state: SubmissionState.SUBMITTED } },
            {
                $lookup: {
                    from: "grades",
                    localField: "_id",
                    foreignField: "submissionId",
                    as: "grade",
                },
            },
            { $match: { grade: { $size: 0 } } },
            { $count: "count" },
        ]);

        const ungradedSubmissions =
            submittedWithoutGrades[0]?.count || 0;

        // 3️⃣ Unpublished grades
        const unpublishedGrades = await Grade.countDocuments({
            published: false,
        });

        // 4️⃣ Locked submissions (expected but monitored)
        const lockedSubmissions = await Submission.countDocuments({
            state: SubmissionState.LOCKED,
        });

        /* =====================
   STORAGE & FILE HEALTH
===================== */

        // Assignment storage stats (only records with fileSize)
        const assignmentStorageAgg = await Assignment.aggregate([
            { $match: { fileSize: { $exists: true } } },
            {
                $group: {
                    _id: null,
                    files: { $sum: 1 },
                    totalSizeBytes: { $sum: "$fileSize" },
                    avgSizeBytes: { $avg: "$fileSize" },
                },
            },
        ]);

        // Submission storage stats (only records with fileSize)
        const submissionStorageAgg = await Submission.aggregate([
            { $match: { fileSize: { $exists: true } } },
            {
                $group: {
                    _id: null,
                    files: { $sum: 1 },
                    totalSizeBytes: { $sum: "$fileSize" },
                    avgSizeBytes: { $avg: "$fileSize" },
                },
            },
        ]);

        const assignmentStorage = assignmentStorageAgg[0] || {
            files: 0,
            totalSizeBytes: 0,
            avgSizeBytes: 0,
        };

        const submissionStorage = submissionStorageAgg[0] || {
            files: 0,
            totalSizeBytes: 0,
            avgSizeBytes: 0,
        };

        const totalFiles =
            assignmentStorage.files + submissionStorage.files;

        const totalSizeBytes =
            assignmentStorage.totalSizeBytes +
            submissionStorage.totalSizeBytes;

        const avgFileSizeBytes =
            totalFiles > 0 ? totalSizeBytes / totalFiles : 0;


        return res.status(200).json({
            status: "HEALTHY",
            metadata: {
                environment: process.env.APP_ENV || process.env.NODE_ENV || "unknown",
                appVersion: process.env.APP_VERSION || "unknown",
                apiVersion: "v1",
                serverTime: now.toISOString(),
                serverTimezone: timezone,
                uptimeSeconds: Math.floor(process.uptime()),
                processId: process.pid,
                nodeVersion: process.version,
            },
            dataIntegrity: {
                orphanedSubmissions,
                ungradedSubmissions,
                unpublishedGrades,
                lockedSubmissions,
                backgroundJobFailures: "Not enabled",
            },
            storage: {
                totalFiles,
                totalSizeBytes,
                avgFileSizeBytes,

                assignments: {
                    files: assignmentStorage.files,
                    totalSizeBytes: assignmentStorage.totalSizeBytes,
                    avgSizeBytes: assignmentStorage.avgSizeBytes,
                },

                submissions: {
                    files: submissionStorage.files,
                    totalSizeBytes: submissionStorage.totalSizeBytes,
                    avgSizeBytes: submissionStorage.avgSizeBytes,
                },

                notes: {
                    source: "Derived from recorded file metadata",
                    missingFileSize:
                        "Older records may not include fileSize",
                },
            },
        });

    } catch (error) {
        console.error("[SystemMetadata] Failed:", error);

        return res.status(500).json({
            status: "DEGRADED",
            message: "Failed to retrieve system metadata",
        });
    }
};