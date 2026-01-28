import { Request, Response } from "express";
import { z } from "zod";
import { createAssignmentDraft } from "./assignment.service";
import { AuthenticatedRequest } from "../../middleware/requireAuth";
import { Types } from "mongoose";
import { AssignmentType } from "../../models/assignment.model";
import { publishAssignment } from "./assignment.service";
import { getAssignmentsForClassroom } from "./assignment.service";

const createAssignmentSchema = z.object({
  classroomId: z.string(),
  title: z.string().min(2),
  description: z.string().optional(),
  type: z.nativeEnum(AssignmentType),
  dueDate: z.string().optional(),
  originalFileName: z.string().min(1),
  fileType: z.enum(["PDF", "DOCX"]),
});



// Create assignment draft and generate S3 upload URL for the assignment file upload


export const createAssignmentHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (req.user?.role !== "TEACHER") {
    return res.status(403).json({ message: "Only teachers can create assignments" });
  }

  const parsed = createAssignmentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const result = await createAssignmentDraft({
      teacherId: new Types.ObjectId(req.user.userId),
      classroomId: new Types.ObjectId(parsed.data.classroomId),
      title: parsed.data.title,
      description: parsed.data.description,
      type: parsed.data.type,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
      originalFileName: parsed.data.originalFileName,
      fileType: parsed.data.fileType,
    });

    return res.status(201).json(result);
  } catch (error: any) {
    if (error.message === "Classroom not found") {
      return res.status(404).json({ message: error.message });
    }

    if (error.message.includes("authorized")) {
      return res.status(403).json({ message: error.message });
    }

    console.error(error);
    return res.status(500).json({ message: "Failed to create assignment" });
  }
};


// Publish an assignment (change state from DRAFT to PUBLISHED)


export const publishAssignmentHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (req.user?.role !== "TEACHER") {
    return res
      .status(403)
      .json({ message: "Only teachers can publish assignments" });
  }

  const { id } = req.params;

  // Ensure id exists and is a single string
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Valid assignment id is required" });
  }

  try {
    await publishAssignment(
      new Types.ObjectId(id),
      new Types.ObjectId(req.user.userId)
    );

    return res
      .status(200)
      .json({ message: "Assignment published successfully" });
  } catch (error: any) {
    if (error.message === "Assignment not found") {
      return res.status(404).json({ message: error.message });
    }

    if (error.message.includes("authorized")) {
      return res.status(403).json({ message: error.message });
    }

    if (error.message.includes("already")) {
      return res.status(400).json({ message: error.message });
    }

    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to publish assignment" });
  }
};


// List assignments for a classroom based on user role (TEACHER or STUDENT)


export const listAssignmentsForClassroomHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;

  // Ensure id exists and is a single string
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Valid classroom id is required" });
  }

  try {
    const assignments = await getAssignmentsForClassroom(
      new Types.ObjectId(id),
      new Types.ObjectId(req.user!.userId),
      req.user!.role as "TEACHER" | "STUDENT"
    );

    return res.status(200).json(
      assignments.map((item: any) => {
        // STUDENT shape
        if (item.assignment) {
          return {
            id: item.assignment._id,
            title: item.assignment.title,
            description: item.assignment.description,
            type: item.assignment.type,
            state: item.assignment.state,
            dueDate: item.assignment.dueDate,
            submission: item.submission, // 👈 IMPORTANT
          };
        }

        // TEACHER shape
        return {
          id: item._id,
          title: item.title,
          description: item.description,
          type: item.type,
          state: item.state,
          dueDate: item.dueDate,
        };
      })
    );
  } catch (error: any) {
    if (error.message === "Classroom not found") {
      return res.status(404).json({ message: error.message });
    }

    if (error.message === "Access denied") {
      return res.status(403).json({ message: error.message });
    }

    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to fetch assignments" });
  }
};