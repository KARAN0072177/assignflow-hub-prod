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

/**
 * Handler for teachers to get their cached AI class insights (with pagination)
 */
export const getTeacherAiInsightHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (req.user?.role !== "TEACHER") {
    return res.status(403).json({ message: "Only teachers can view AI class insights" });
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 5;

  try {
    const { getTeacherAiInsights } = await import("../ai/teacherInsight.service");
    const result = await getTeacherAiInsights(req.user.userId, page, limit);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Failed to fetch teacher AI insight:", error);
    return res.status(500).json({ message: "Failed to fetch teacher class insight" });
  }
};

/**
 * Handler for teachers to manually trigger generation of AI class insights
 */
export const generateTeacherAiInsightHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (req.user?.role !== "TEACHER") {
    return res.status(403).json({ message: "Only teachers can generate AI class insights" });
  }

  try {
    const { generateTeacherAiInsights } = await import("../ai/teacherInsight.service");
    const insight = await generateTeacherAiInsights(req.user.userId);
    return res.status(200).json(insight);
  } catch (error: any) {
    console.error("Failed to generate teacher AI insight:", error);
    return res.status(500).json({ message: "Failed to generate teacher class insight" });
  }
};

/**
 * Handler for teachers to delete an AI insight record
 */
export const deleteTeacherAiInsightHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (req.user?.role !== "TEACHER") {
    return res.status(403).json({ message: "Only teachers can delete AI class insights" });
  }

  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Insight ID is required" });
  }

  try {
    const { deleteTeacherAiInsight } = await import("../ai/teacherInsight.service");
    const result = await deleteTeacherAiInsight(req.user.userId, id);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Failed to delete teacher AI insight:", error);
    return res.status(400).json({ message: error.message || "Failed to delete insight" });
  }
};

/**
 * Handler for teachers to pin/unpin an AI insight record (up to 3)
 */
export const togglePinTeacherAiInsightHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (req.user?.role !== "TEACHER") {
    return res.status(403).json({ message: "Only teachers can pin AI class insights" });
  }

  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Insight ID is required" });
  }

  try {
    const { togglePinTeacherAiInsight } = await import("../ai/teacherInsight.service");
    const result = await togglePinTeacherAiInsight(req.user.userId, id);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Failed to toggle pin on teacher AI insight:", error);
    return res.status(400).json({ message: error.message || "Failed to toggle pin" });
  }
};