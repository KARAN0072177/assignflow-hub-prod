import { Response } from "express";
import { z } from "zod";
import { Types } from "mongoose";
import { AuthenticatedRequest } from "../../middleware/requireAuth";
import { createOrUpdateSubmissionDraft } from "./submission.service";
import { submitSubmission } from "./submission.service";
import { getSubmissionsForAssignment } from "./submission.service";

const draftSchema = z.object({
  assignmentId: z.string(),
  originalFileName: z.string().min(1),
  fileType: z.enum(["PDF", "DOCX"]),
});


// Handler to create or update a submission draft

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


// Handler to submit a submission

export const submitSubmissionHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (req.user?.role !== "STUDENT") {
    return res.status(403).json({ message: "Only students can submit work" });
  }

  const { id } = req.params;

  // Ensure id exists and is a single string
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Valid submission id is required" });
  }

  try {
    await submitSubmission(
      new Types.ObjectId(id),
      new Types.ObjectId(req.user.userId)
    );

    return res
      .status(200)
      .json({ message: "Submission submitted successfully" });
  } catch (error: any) {
    if (
      error.message.includes("not found") ||
      error.message.includes("authorized") ||
      error.message.includes("deadline") ||
      error.message.includes("state")
    ) {
      return res.status(400).json({ message: error.message });
    }

    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to submit submission" });
  }
};


// Handler to list submissions for an assignment (teacher only)


export const listSubmissionsForAssignmentHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (req.user?.role !== "TEACHER") {
    return res
      .status(403)
      .json({ message: "Only teachers can view submissions" });
  }

  const { id } = req.params;

  // 👇 new safety + type-narrowing guard
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Valid assignment id is required" });
  }

  try {
    const submissions = await getSubmissionsForAssignment(
      new Types.ObjectId(id),
      new Types.ObjectId(req.user.userId)
    );

    return res.status(200).json(submissions);
  } catch (error: any) {
    if (
      error.message === "Assignment not found" ||
      error.message === "Access denied"
    ) {
      return res.status(403).json({ message: error.message });
    }

    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to fetch submissions" });
  }
};