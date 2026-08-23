import { Request, Response } from "express";
import { z } from "zod";
import { Types } from "mongoose";
import { AuthenticatedRequest } from "../../middleware/requireAuth";
import { AssignmentType } from "../../models/assignment.model";
import {
  createAssignmentDraft,
  publishAssignment,
  getAssignmentsForClassroom,
  markClassroomAssignmentsAsRead,
  getStudentUnreadAssignments,
} from "./assignment.service";

const allowedExtensions = [".pdf", ".docx", ".xlsx", ".pptx"];
const blockedExtensions = [
  ".zip",
  ".dll",
  ".bat",
  ".exe",
  ".sh",
  ".cmd",
  ".vbs",
  ".js",
  ".py",
  ".html",
  ".htm",
  ".svg",
  ".msi",
  ".tar",
  ".gz",
  ".bin",
];

const createAssignmentSchema = z.object({
  classroomId: z.string(),
  title: z.string().min(2),
  description: z.string().optional(),
  type: z.nativeEnum(AssignmentType),
  dueDate: z.string().optional(),
  originalFileName: z
    .string()
    .min(1)
    .refine(
      (name) => {
        const lower = name.toLowerCase();
        const ext = lower.slice(lower.lastIndexOf("."));
        return (
          allowedExtensions.includes(ext) &&
          !blockedExtensions.some((b) => lower.endsWith(b))
        );
      },
      {
        message:
          "Security violation: Only .pdf, .docx, .xlsx, and .pptx files are allowed.",
      }
    ),
  fileType: z.enum(["PDF", "DOCX", "XLSX", "PPTX"]),
  fileSize: z
    .number()
    .positive()
    .max(10 * 1024 * 1024, "File size cannot exceed 10MB"),
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
      fileSize: parsed.data.fileSize,
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

/**
 * Mark all assignments in a classroom as read for the student
 */
export const markClassroomReadHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const { classroomId } = req.params;
  if (!classroomId || !Types.ObjectId.isValid(classroomId)) {
    return res.status(400).json({ message: "Valid classroom ID is required" });
  }

  try {
    const result = await markClassroomAssignmentsAsRead(
      new Types.ObjectId(classroomId),
      new Types.ObjectId(req.user.userId)
    );

    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to mark assignments as read" });
  }
};

/**
 * Get student total unread assignments count & breakdown per classroom
 */
export const getStudentUnreadCountHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const data = await getStudentUnreadAssignments(
      new Types.ObjectId(req.user.userId)
    );

    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Failed to fetch unread assignments count",
    });
  }
};