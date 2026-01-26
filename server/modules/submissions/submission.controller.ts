import { Response } from "express";
import { z } from "zod";
import { Types } from "mongoose";
import { AuthenticatedRequest } from "../../middleware/requireAuth";
import { createOrUpdateSubmissionDraft } from "./submission.service";

const draftSchema = z.object({
  assignmentId: z.string(),
  originalFileName: z.string().min(1),
  fileType: z.enum(["PDF", "DOCX"]),
});

export const createSubmissionDraftHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (req.user?.role !== "STUDENT") {
    return res.status(403).json({ message: "Only students can submit work" });
  }

  const parsed = draftSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const result = await createOrUpdateSubmissionDraft({
      studentId: new Types.ObjectId(req.user.userId),
      assignmentId: new Types.ObjectId(parsed.data.assignmentId),
      originalFileName: parsed.data.originalFileName,
      fileType: parsed.data.fileType,
    });

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};