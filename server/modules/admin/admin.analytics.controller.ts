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
       USERS
    ===================== */
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: UserRole.STUDENT });
    const teachers = await User.countDocuments({ role: UserRole.TEACHER });

    /* =====================
       CLASSROOMS
    ===================== */
    const totalClassrooms = await Classroom.countDocuments();

    /* =====================
       MEMBERSHIPS
    ===================== */
    const totalEnrollments = await Membership.countDocuments();

    /* =====================
       ASSIGNMENTS
    ===================== */
    const totalAssignments = await Assignment.countDocuments();

    /* =====================
       SUBMISSIONS
    ===================== */
    const totalSubmissions = await Submission.countDocuments();
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

    /* =====================
       BACKGROUND JOB HEALTH
       (Derived from audit logs)
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
       RESPONSE
    ===================== */
    return res.status(200).json({
      users: {
        total: totalUsers,
        students,
        teachers,
      },

      classrooms: {
        total: totalClassrooms,
      },

      enrollments: {
        total: totalEnrollments,
      },

      assignments: {
        total: totalAssignments,
      },

      submissions: {
        total: totalSubmissions,
        draft: draftSubmissions,
        submitted: submittedSubmissions,
        locked: lockedSubmissions,
      },

      grades: {
        total: totalGrades,
        published: publishedGrades,
      },

      backgroundJobs: {
        autoLock: {
          lastRunAt: lastAutoLockEvent?.createdAt || null,
        },
      },

      recentEvents,

      future: {
        growthMetrics: "Planned (users, submissions over time)",
      },
    });
  } catch (error) {
    console.error("[AdminAnalytics] Failed:", error);
    return res.status(500).json({ message: "Failed to load analytics" });
  }
};