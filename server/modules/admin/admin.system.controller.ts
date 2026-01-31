import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/requireAuth";
import { Assignment } from "../../models/assignment.model";
import { Submission, SubmissionState } from "../../models/submission.model";
import { Grade } from "../../models/grade.model";
import { AuditLog } from "../../models/auditLog.model";
import { ErrorLog, ErrorSeverity } from "../../models/errorLog.model";
import { SecurityEvent, SecurityEventType } from "../../models/securityEvent.model";

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

        /* =====================
AUTH & SECURITY SIGNALS
===================== */

        // Calculate time windows
        const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Successful logins
        const loginsLast24h = await AuditLog.countDocuments({
            action: "USER_LOGIN",
            createdAt: { $gte: last24h },
        });

        const loginsLast7d = await AuditLog.countDocuments({
            action: "USER_LOGIN",
            createdAt: { $gte: last7d },
        });

        // Logouts
        const logoutsLast24h = await AuditLog.countDocuments({
            action: "USER_LOGOUT",
            createdAt: { $gte: last24h },
        });

        /* =====================
   SYSTEM ERRORS & WARNINGS
===================== */

        const last24hErrors = await ErrorLog.countDocuments({
            createdAt: { $gte: last24h },
        });

        const criticalErrors = await ErrorLog.countDocuments({
            severity: ErrorSeverity.CRITICAL,
            createdAt: { $gte: last24h },
        });

        const mostCommonError = await ErrorLog.aggregate([
            { $match: { createdAt: { $gte: last24h } } },
            { $group: { _id: "$message", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 },
        ]);

        const recentErrors = await ErrorLog.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("source message severity createdAt");

        /* =====================
SECURITY EVENTS
===================== */

        const recentRateLimitHits = await SecurityEvent.find({
            type: SecurityEventType.RATE_LIMIT_HIT,
        })
            .sort({ createdAt: -1 })
            .limit(20)
            .select("ip endpoint method userAgent createdAt");



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
            authSecurity: {
                loginsLast24h,
                loginsLast7d,
                logoutsLast24h,

                failedLoginsLast24h: "Not tracked",
                tokenErrorsLast24h: "Not tracked",
                accountLockouts: "Not implemented",
            },
            systemErrors: {
                totalLast24h: last24hErrors,
                criticalLast24h: criticalErrors,
                mostCommon: mostCommonError[0] || null,
                recent: recentErrors,
            },
            securityEvents: {
                rateLimitHits: recentRateLimitHits,
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