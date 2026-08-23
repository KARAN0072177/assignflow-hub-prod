import { Response } from "express";
import { z } from "zod";
import { Types } from "mongoose";
import { AuthenticatedRequest } from "../../middleware/requireAuth";
import { createOrUpdateGrade } from "./grade.service";
import { publishGrade } from "./grade.service";
import { getPublishedGradesForStudent } from "./grade.service";

const gradeSchema = z.object({
  submissionId: z.string(),
  score: z.number().min(0).max(100),
  feedback: z.string().optional(),
  publishImmediately: z.boolean().optional(),
});

export const gradeSubmissionHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (req.user?.role !== "TEACHER") {
    return res.status(403).json({ message: "Only teachers can grade submissions" });
  }

  const parsed = gradeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const grade = await createOrUpdateGrade({
      submissionId: new Types.ObjectId(parsed.data.submissionId),
      teacherId: new Types.ObjectId(req.user.userId),
      score: parsed.data.score,
      feedback: parsed.data.feedback,
      publishImmediately: parsed.data.publishImmediately,
    });

    return res.status(200).json({
      message: grade.published ? "Grade published successfully" : "Grade saved successfully",
      grade: {
        id: grade._id,
        score: grade.score,
        feedback: grade.feedback,
        published: grade.published,
      },
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};


// Handler to publish a grade to the student

export const publishGradeHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (req.user?.role !== "TEACHER") {
    return res
      .status(403)
      .json({ message: "Only teachers can publish grades" });
  }

  const { id } = req.params;

  // 👇 guard added
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Valid grade id is required" });
  }

  try {
    await publishGrade(
      new Types.ObjectId(id),
      new Types.ObjectId(req.user.userId)
    );

    return res
      .status(200)
      .json({ message: "Grade published successfully" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};


// Handler for students to get their published grades

export const getMyGradesHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (req.user?.role !== "STUDENT") {
    return res
      .status(403)
      .json({ message: "Only students can view grades" });
  }

  try {
    const grades = await getPublishedGradesForStudent(
      new Types.ObjectId(req.user.userId)
    );

    return res.status(200).json(grades);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to fetch grades" });
  }
};

// Handler for teachers to get global student performance analytics across all classes

export const getTeacherStudentsAnalyticsHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (req.user?.role !== "TEACHER") {
    return res
      .status(403)
      .json({ message: "Only teachers can access student analytics" });
  }

  try {
    const { getTeacherStudentsAnalytics } = await import("./grade.service");
    const analytics = await getTeacherStudentsAnalytics(
      new Types.ObjectId(req.user.userId)
    );

    return res.status(200).json(analytics);
  } catch (error: any) {
    console.error("Failed to fetch teacher student analytics:", error);
    return res
      .status(500)
      .json({ message: error?.message || "Failed to load student analytics" });
  }
};

/**
 * Handler for students to get their server-evaluated AI performance insight
 */
export const getStudentAiInsightHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (req.user?.role !== "STUDENT") {
    return res
      .status(403)
      .json({ message: "Only students can view AI performance insights" });
  }

  try {
    const { getOrGenerateStudentPerformanceInsight } = await import(
      "../ai/studentInsight.service"
    );
    const insight = await getOrGenerateStudentPerformanceInsight(
      new Types.ObjectId(req.user.userId)
    );

    return res.status(200).json(insight);
  } catch (error: any) {
    console.error("Failed to generate student AI insight:", error);
    return res.status(500).json({
      message: error?.message || "Failed to generate student performance insight",
    });
  }
};