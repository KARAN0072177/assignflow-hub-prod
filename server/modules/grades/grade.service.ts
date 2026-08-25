import { Types } from "mongoose";
import { Grade } from "../../models/grade.model";
import { Submission, SubmissionState } from "../../models/submission.model";
import { Assignment } from "../../models/assignment.model";
import { Classroom, ClassroomStatus } from "../../models/classroom.model";
import { Membership } from "../../models/membership.model";
import { logAuditEvent } from "../../utils/auditLogger";
import { generateDownloadUrl } from "../../utils/s3-download";
import sanitizeHtml from "sanitize-html";

// Create or update a grade for a submission

export const createOrUpdateGrade = async ({
  submissionId,
  teacherId,
  score,
  feedback,
  publishImmediately,
}: {
  submissionId: Types.ObjectId;
  teacherId: Types.ObjectId;
  score: number;
  feedback?: string;
  publishImmediately?: boolean;
}) => {
  // 0. Sanitize feedback (WRITE-time protection)
  const cleanFeedback = feedback
    ? sanitizeHtml(feedback.trim(), {
      allowedTags: [],
      allowedAttributes: {},
    })
    : undefined;
  // 1. Fetch submission
  const submission = await Submission.findById(submissionId);
  if (!submission) {
    throw new Error("Submission not found");
  }

  if (submission.state !== SubmissionState.SUBMITTED) {
    throw new Error("Only submitted submissions can be graded");
  }

  // 2. Fetch assignment & verify ownership
  const assignment = await Assignment.findById(submission.assignmentId);
  if (!assignment) {
    throw new Error("Assignment not found");
  }

  if (!assignment.teacherId.equals(teacherId)) {
    throw new Error("Not authorized to grade this submission");
  }

  // 3. Check existing grade (by submissionId OR by assignmentId + studentId)
  let grade = await Grade.findOne({
    $or: [
      { submissionId: submission._id },
      { assignmentId: submission.assignmentId, studentId: submission.studentId },
    ],
  });

  if (grade) {
    grade.submissionId = submission._id;
    grade.score = score;
    grade.feedback = cleanFeedback;
    if (publishImmediately !== undefined) {
      grade.published = !!publishImmediately;
    }
    await grade.save();
  } else {
    grade = await Grade.create({
      assignmentId: submission.assignmentId,
      submissionId: submission._id,
      studentId: submission.studentId,
      teacherId,
      score,
      feedback: cleanFeedback,
      published: !!publishImmediately,
    });
  }

  if (grade.published) {
    await logAuditEvent({
      actorRole: "TEACHER",
      actorId: teacherId,
      action: "GRADE_PUBLISHED",
      entityType: "GRADE",
      entityId: grade._id,
      metadata: {
        submissionId: grade.submissionId,
        assignmentId: grade.assignmentId,
        studentId: grade.studentId,
        score: grade.score,
      },
    });
  }

  return grade;
};


// Publish a grade to make it visible to the student

export const publishGrade = async (
  gradeId: Types.ObjectId,
  teacherId: Types.ObjectId
) => {
  const grade = await Grade.findById(gradeId);
  if (!grade) {
    throw new Error("Grade not found");
  }

  if (!grade.teacherId.equals(teacherId)) {
    throw new Error("Not authorized to publish this grade");
  }

  if (!grade.published) {
    grade.published = true;
    await grade.save();

    await logAuditEvent({
      actorRole: "TEACHER",
      actorId: teacherId,
      action: "GRADE_PUBLISHED",
      entityType: "GRADE",
      entityId: grade._id,
      metadata: {
        submissionId: grade.submissionId,
        assignmentId: grade.assignmentId,
        studentId: grade.studentId,
        score: grade.score,
      },
    });
  }

  return grade;
};


// Get published grades for a student

export const getPublishedGradesForStudent = async (
  studentId: Types.ObjectId
) => {
  const grades = await Grade.find({
    studentId,
    published: true,
  })
    .populate("assignmentId", "title description")
    .populate("submissionId", "updatedAt createdAt fileKey")
    .sort({ updatedAt: -1 });

  return Promise.all(
    grades.map(async (g) => {
      const submission = g.submissionId as any;
      let downloadUrl = null;
      if (submission?.fileKey && submission.fileKey !== "PENDING") {
        try {
          downloadUrl = await generateDownloadUrl(submission.fileKey);
        } catch {
          // ignore s3 error
        }
      }

      return {
        id: g._id,
        assignment: {
          id: (g.assignmentId as any)?._id,
          title: (g.assignmentId as any)?.title || "Assignment",
          description: (g.assignmentId as any)?.description,
        },
        score: g.score,
        feedback: g.feedback,
        gradedAt: g.updatedAt || g.createdAt,
        submittedAt: submission?.updatedAt || submission?.createdAt || g.createdAt,
        submissionDownloadUrl: downloadUrl,
      };
    })
  );
};

// Global Teacher Analytics: Aggregate performance across all students & classrooms

export const getTeacherStudentsAnalytics = async (
  teacherId: Types.ObjectId
) => {
  // 1. Find all active classrooms taught by this teacher
  const classrooms = await Classroom.find({
    teacherId,
    status: ClassroomStatus.ACTIVE,
  })
    .select("name code createdAt")
    .lean();

  if (classrooms.length === 0) {
    return {
      students: [],
      summary: {
        totalUniqueStudents: 0,
        totalEnrollments: 0,
        totalClassrooms: 0,
        totalAssignments: 0,
        overallAverageScore: null,
        highAchieversCount: 0,
        goodStandingCount: 0,
        needsSupportCount: 0,
        ungradedCount: 0,
      },
      gradeDistribution: [
        { tier: "A (90-100%)", grade: "A", count: 0, percentage: 0, color: "#10b981" },
        { tier: "B (80-89%)", grade: "B", count: 0, percentage: 0, color: "#3b82f6" },
        { tier: "C (70-79%)", grade: "C", count: 0, percentage: 0, color: "#f59e0b" },
        { tier: "D (60-69%)", grade: "D", count: 0, percentage: 0, color: "#ea580c" },
        { tier: "F (<60%)", grade: "F", count: 0, percentage: 0, color: "#ef4444" },
      ],
      classroomsSummary: [],
    };
  }

  const classroomIds = classrooms.map((c) => c._id);
  const classroomMap = new Map<string, { id: string; name: string; code: string }>();
  classrooms.forEach((c) => {
    classroomMap.set(c._id.toString(), {
      id: c._id.toString(),
      name: c.name,
      code: c.code,
    });
  });

  // 2. Find all assignments created in these classrooms
  const assignments = await Assignment.find({
    classroomId: { $in: classroomIds },
  })
    .select("title classroomId type dueDate createdAt")
    .lean();

  const assignmentIds = assignments.map((a) => a._id);
  const assignmentMap = new Map<string, any>();
  assignments.forEach((a) => {
    assignmentMap.set(a._id.toString(), a);
  });

  // 3. Find all memberships and students
  const memberships = await Membership.find({
    classroomId: { $in: classroomIds },
  })
    .populate<{
      studentId: {
        _id: Types.ObjectId;
        email: string;
        username?: string;
        createdAt: Date;
      };
    }>("studentId", "email username createdAt")
    .lean();

  // 4. Find all grades and submissions for these assignments
  const [grades, submissions] = await Promise.all([
    Grade.find({ assignmentId: { $in: assignmentIds } }).lean(),
    Submission.find({ assignmentId: { $in: assignmentIds } })
      .select("assignmentId classroomId studentId state updatedAt createdAt")
      .lean(),
  ]);

  // Group data by student
  const studentMap = new Map<
    string,
    {
      studentId: string;
      email: string;
      username?: string | null;
      joinedAt: Date;
      classrooms: { id: string; name: string; code: string }[];
      classroomIds: Set<string>;
    }
  >();

  memberships.forEach((m) => {
    if (!m.studentId) return;
    const sId = m.studentId._id.toString();
    const cId = m.classroomId.toString();
    const classInfo = classroomMap.get(cId);

    if (!studentMap.has(sId)) {
      studentMap.set(sId, {
        studentId: sId,
        email: m.studentId.email,
        username: (m.studentId as any).username || null,
        joinedAt: m.createdAt,
        classrooms: classInfo ? [classInfo] : [],
        classroomIds: new Set([cId]),
      });
    } else {
      const existing = studentMap.get(sId)!;
      if (classInfo && !existing.classroomIds.has(cId)) {
        existing.classroomIds.add(cId);
        existing.classrooms.push(classInfo);
      }
      if (new Date(m.createdAt) < new Date(existing.joinedAt)) {
        existing.joinedAt = m.createdAt;
      }
    }
  });

  // Calculate student-level metrics
  const studentsList = Array.from(studentMap.values()).map((student) => {
    // Applicable assignments for this student based on enrolled classrooms
    const applicableAssignments = assignments.filter((a) =>
      student.classroomIds.has(a.classroomId.toString())
    );
    const applicableAssignmentIds = new Set(
      applicableAssignments.map((a) => a._id.toString())
    );

    // Grades for this student
    const studentGrades = grades.filter(
      (g) =>
        g.studentId.toString() === student.studentId &&
        applicableAssignmentIds.has(g.assignmentId.toString())
    );

    // Submissions for this student
    const studentSubmissions = submissions.filter(
      (s) =>
        s.studentId.toString() === student.studentId &&
        applicableAssignmentIds.has(s.assignmentId.toString())
    );

    const gradedCount = studentGrades.length;
    const scores = studentGrades.map((g) => g.score);
    const averageScore =
      gradedCount > 0
        ? Number((scores.reduce((a, b) => a + b, 0) / gradedCount).toFixed(1))
        : null;
    const highestScore = gradedCount > 0 ? Math.max(...scores) : null;
    const lowestScore = gradedCount > 0 ? Math.min(...scores) : null;

    let letterGrade = "N/A";
    let performanceTier: "High Achiever" | "Good Standing" | "Needs Support" | "Not Graded" =
      "Not Graded";

    if (averageScore !== null) {
      if (averageScore >= 90) letterGrade = "A";
      else if (averageScore >= 80) letterGrade = "B";
      else if (averageScore >= 70) letterGrade = "C";
      else if (averageScore >= 60) letterGrade = "D";
      else letterGrade = "F";

      if (averageScore >= 85) performanceTier = "High Achiever";
      else if (averageScore >= 70) performanceTier = "Good Standing";
      else performanceTier = "Needs Support";
    }

    const submissionRate =
      applicableAssignments.length > 0
        ? Number(
            (
              (studentSubmissions.length / applicableAssignments.length) *
              100
            ).toFixed(1)
          )
        : 0;

    const gradesHistory = studentGrades
      .map((g) => {
        const asg = assignmentMap.get(g.assignmentId.toString());
        const cls = asg ? classroomMap.get(asg.classroomId.toString()) : null;
        return {
          assignmentId: g.assignmentId.toString(),
          assignmentTitle: asg?.title || "Assignment",
          classroomName: cls?.name || "Classroom",
          score: g.score,
          feedback: g.feedback || "",
          published: g.published,
          gradedAt: g.updatedAt || g.createdAt,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.gradedAt).getTime() - new Date(a.gradedAt).getTime()
      );

    return {
      studentId: student.studentId,
      email: student.email,
      username: student.username || null,
      name: student.username ? `@${student.username}` : student.email.split("@")[0].replace(/[._]/g, " "),
      joinedAt: student.joinedAt,
      classrooms: student.classrooms,
      totalAssigned: applicableAssignments.length,
      totalSubmitted: studentSubmissions.length,
      totalGraded: gradedCount,
      averageScore,
      highestScore,
      lowestScore,
      letterGrade,
      performanceTier,
      submissionRate,
      gradesHistory,
    };
  });

  // Calculate Overall Summary
  const gradedStudents = studentsList.filter((s) => s.averageScore !== null);
  const overallAverageScore =
    gradedStudents.length > 0
      ? Number(
          (
            gradedStudents.reduce((acc, s) => acc + s.averageScore!, 0) /
            gradedStudents.length
          ).toFixed(1)
        )
      : null;

  const highAchieversCount = studentsList.filter(
    (s) => s.performanceTier === "High Achiever"
  ).length;
  const goodStandingCount = studentsList.filter(
    (s) => s.performanceTier === "Good Standing"
  ).length;
  const needsSupportCount = studentsList.filter(
    (s) => s.performanceTier === "Needs Support"
  ).length;
  const ungradedCount = studentsList.filter(
    (s) => s.performanceTier === "Not Graded"
  ).length;

  // Grade Tier Distribution
  const aCount = studentsList.filter((s) => s.letterGrade === "A").length;
  const bCount = studentsList.filter((s) => s.letterGrade === "B").length;
  const cCount = studentsList.filter((s) => s.letterGrade === "C").length;
  const dCount = studentsList.filter((s) => s.letterGrade === "D").length;
  const fCount = studentsList.filter((s) => s.letterGrade === "F").length;
  const totalWithGrades = gradedStudents.length;

  const gradeDistribution = [
    {
      tier: "A (90-100%)",
      grade: "A",
      count: aCount,
      percentage:
        totalWithGrades > 0 ? Number(((aCount / totalWithGrades) * 100).toFixed(1)) : 0,
      color: "#10b981",
    },
    {
      tier: "B (80-89%)",
      grade: "B",
      count: bCount,
      percentage:
        totalWithGrades > 0 ? Number(((bCount / totalWithGrades) * 100).toFixed(1)) : 0,
      color: "#3b82f6",
    },
    {
      tier: "C (70-79%)",
      grade: "C",
      count: cCount,
      percentage:
        totalWithGrades > 0 ? Number(((cCount / totalWithGrades) * 100).toFixed(1)) : 0,
      color: "#f59e0b",
    },
    {
      tier: "D (60-69%)",
      grade: "D",
      count: dCount,
      percentage:
        totalWithGrades > 0 ? Number(((dCount / totalWithGrades) * 100).toFixed(1)) : 0,
      color: "#ea580c",
    },
    {
      tier: "F (<60%)",
      grade: "F",
      count: fCount,
      percentage:
        totalWithGrades > 0 ? Number(((fCount / totalWithGrades) * 100).toFixed(1)) : 0,
      color: "#ef4444",
    },
  ];

  return {
    students: studentsList,
    summary: {
      totalUniqueStudents: studentsList.length,
      totalEnrollments: memberships.length,
      totalClassrooms: classrooms.length,
      totalAssignments: assignments.length,
      overallAverageScore,
      highAchieversCount,
      goodStandingCount,
      needsSupportCount,
      ungradedCount,
    },
    gradeDistribution,
    classroomsSummary: classrooms.map((c) => {
      const classStudents = studentsList.filter((s) =>
        s.classrooms.some((cls) => cls.id === c._id.toString())
      );
      const classGraded = classStudents.filter((s) => s.averageScore !== null);
      const classAvg =
        classGraded.length > 0
          ? Number(
              (
                classGraded.reduce((acc, s) => acc + s.averageScore!, 0) /
                classGraded.length
              ).toFixed(1)
            )
          : null;
      return {
        classroomId: c._id.toString(),
        classroomName: c.name,
        code: c.code,
        studentCount: classStudents.length,
        averageScore: classAvg,
      };
    }),
  };
};