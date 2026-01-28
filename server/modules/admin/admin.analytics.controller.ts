import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/requireAuth";

import { User, UserRole } from "../../models/user.model";
import { Classroom } from "../../models/classroom.model";
import { Membership } from "../../models/membership.model";
import { Assignment } from "../../models/assignment.model";
import { Submission, SubmissionState } from "../../models/submission.model";
import { Grade } from "../../models/grade.model";
import { AuditLog } from "../../models/auditLog.model";

export const getAdminAnalytics = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    /* =====================
       TIME WINDOWS
    ===================== */
    const now = new Date();

    const last24h = new Date(now);
    last24h.setHours(now.getHours() - 24);

    const last7d = new Date(now);
    last7d.setDate(now.getDate() - 7);

    /* =====================
       USERS
    ===================== */
    const totalUsers = await User.countDocuments();
    const usersLast24h = await User.countDocuments({
      createdAt: { $gte: last24h },
    });
    const usersLast7d = await User.countDocuments({
      createdAt: { $gte: last7d },
    });

    const students = await User.countDocuments({ role: UserRole.STUDENT });
    const teachers = await User.countDocuments({ role: UserRole.TEACHER });

    /* =====================
       CLASSROOMS
    ===================== */
    const totalClassrooms = await Classroom.countDocuments();
    const classroomsLast7d = await Classroom.countDocuments({
      createdAt: { $gte: last7d },
    });

    /* =====================
       MEMBERSHIPS
    ===================== */
    const totalEnrollments = await Membership.countDocuments();
    const enrollmentsLast7d = await Membership.countDocuments({
      createdAt: { $gte: last7d },
    });

    /* =====================
       ASSIGNMENTS
    ===================== */
    const totalAssignments = await Assignment.countDocuments();
    const assignmentsLast7d = await Assignment.countDocuments({
      createdAt: { $gte: last7d },
    });

    /* =====================
       SUBMISSIONS
    ===================== */
    const totalSubmissions = await Submission.countDocuments();
    const submissionsLast24h = await Submission.countDocuments({
      createdAt: { $gte: last24h },
    });
    const submissionsLast7d = await Submission.countDocuments({
      createdAt: { $gte: last7d },
    });

    const draftSubmissions = await Submission.countDocuments({
      state: SubmissionState.DRAFT,
    });
    const submittedSubmissions = await Submission.countDocuments({
      state: SubmissionState.SUBMITTED,
    });
    const lockedSubmissions = await Submission.countDocuments({
      state: SubmissionState.LOCKED,
    });

    /* =====================
       GRADES
    ===================== */
    const totalGrades = await Grade.countDocuments();
    const publishedGrades = await Grade.countDocuments({ published: true });
    const gradesPublishedLast7d = await Grade.countDocuments({
      published: true,
      updatedAt: { $gte: last7d },
    });

    /* =====================
       BACKGROUND JOB HEALTH
    ===================== */
    const lastAutoLockEvent = await AuditLog.findOne({
      action: "SUBMISSION_AUTO_LOCKED",
    }).sort({ createdAt: -1 });

    /* =====================
       RECENT SYSTEM EVENTS
    ===================== */
    const recentEvents = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("actorRole action entityType metadata createdAt");

    /* =====================
       HEALTH RATIOS
    ===================== */

    // Submission completion rate
    const completedBase = submittedSubmissions + lockedSubmissions;
    const submissionCompletionRate =
      completedBase > 0 ? submittedSubmissions / completedBase : 1;

    // Deadline miss rate
    const deadlineMissRate =
      totalSubmissions > 0 ? lockedSubmissions / totalSubmissions : 0;

    // Grading completion rate
    const gradingCompletionRate =
      submittedSubmissions > 0 ? publishedGrades / submittedSubmissions : 1;

    /* =====================
       ALERT FLAGS
    ===================== */
    const alerts: string[] = [];

    if (deadlineMissRate > 0.3) {
      alerts.push("High deadline miss rate (>30%)");
    }

    if (submissionCompletionRate < 0.7) {
      alerts.push("Low submission completion rate (<70%)");
    }

    if (gradingCompletionRate < 0.8) {
      alerts.push("Grading backlog detected (<80% graded)");
    }

    /* =====================
       RESPONSE
    ===================== */
    return res.status(200).json({
      users: {
        total: totalUsers,
        last24h: usersLast24h,
        last7d: usersLast7d,
        students,
        teachers,
      },

      classrooms: {
        total: totalClassrooms,
        last7d: classroomsLast7d,
      },

      enrollments: {
        total: totalEnrollments,
        last7d: enrollmentsLast7d,
      },

      assignments: {
        total: totalAssignments,
        last7d: assignmentsLast7d,
      },

      submissions: {
        total: totalSubmissions,
        last24h: submissionsLast24h,
        last7d: submissionsLast7d,
        draft: draftSubmissions,
        submitted: submittedSubmissions,
        locked: lockedSubmissions,
      },

      grades: {
        total: totalGrades,
        published: publishedGrades,
        publishedLast7d: gradesPublishedLast7d,
      },

      backgroundJobs: {
        autoLock: {
          lastRunAt: lastAutoLockEvent?.createdAt || null,
        },
      },

      health: {
        submissionCompletionRate,
        deadlineMissRate,
        gradingCompletionRate,
      },

      alerts,

      recentEvents,

      future: {
        growthMetrics: "Planned (time-series analytics & charts)",
      },
    });
  } catch (error) {
    console.error("[AdminAnalytics] Failed:", error);
    return res.status(500).json({ message: "Failed to load analytics" });
  }
};