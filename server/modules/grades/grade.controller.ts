import { Response } from "express";
import { z } from "zod";
import { Types } from "mongoose";
import { AuthenticatedRequest } from "../../middleware/requireAuth";
import { createOrUpdateGrade } from "./grade.service";
import { publishGrade } from "./grade.service";

const gradeSchema = z.object({
  submissionId: z.string(),
  score: z.number().min(0),
  feedback: z.string().optional(),
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
    await createOrUpdateGrade({
      submissionId: new Types.ObjectId(parsed.data.submissionId),
      teacherId: new Types.ObjectId(req.user.userId),
      score: parsed.data.score,
      feedback: parsed.data.feedback,
    });

    return res.status(200).json({ message: "Grade saved successfully" });
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