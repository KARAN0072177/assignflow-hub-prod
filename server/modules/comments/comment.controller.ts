import { Response } from "express";
import { z } from "zod";
import { Types } from "mongoose";
import { AuthenticatedRequest } from "../../middleware/requireAuth";
import {
  createComment,
  getCommentsForAssignment,
  getTeacherDiscussionsHub,
  markAssignmentCommentsAsRead,
  getTeacherUnreadCount,
  deleteComment,
  toggleVerifiedAnswer,
} from "./comment.service";
import { UserRole } from "../../models/user.model";

const postCommentSchema = z.object({
  assignmentId: z.string().min(1),
  content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment cannot exceed 1000 characters"),
  parentCommentId: z.string().optional(),
});

export const postCommentHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const parsed = postCommentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: parsed.error.issues[0]?.message || "Invalid input",
    });
  }

  const { assignmentId, content, parentCommentId } = parsed.data;

  try {
    const comment = await createComment({
      assignmentId: new Types.ObjectId(assignmentId),
      userId: new Types.ObjectId(req.user.userId),
      role: req.user.role as UserRole,
      content,
      parentCommentId: parentCommentId
        ? new Types.ObjectId(parentCommentId)
        : undefined,
    });

    return res.status(201).json(comment);
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Failed to post comment" });
  }
};

export const getAssignmentCommentsHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const { assignmentId } = req.params;
  if (!assignmentId || !Types.ObjectId.isValid(assignmentId)) {
    return res.status(400).json({ message: "Valid assignmentId is required" });
  }

  try {
    const data = await getCommentsForAssignment(
      new Types.ObjectId(assignmentId),
      new Types.ObjectId(req.user.userId),
      req.user.role as UserRole
    );

    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Failed to fetch comments" });
  }
};

export const markAssignmentReadHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const { assignmentId } = req.params;
  if (!assignmentId || !Types.ObjectId.isValid(assignmentId)) {
    return res.status(400).json({ message: "Valid assignmentId is required" });
  }

  try {
    await markAssignmentCommentsAsRead(
      new Types.ObjectId(assignmentId),
      new Types.ObjectId(req.user.userId)
    );

    return res.status(200).json({ success: true });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Failed to mark as read" });
  }
};

export const getTeacherUnreadCountHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user || req.user.role !== "TEACHER") {
    return res.status(403).json({ message: "Only teachers can access unread count" });
  }

  try {
    const data = await getTeacherUnreadCount(new Types.ObjectId(req.user.userId));
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to load unread count" });
  }
};

export const getTeacherDiscussionsHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user || req.user.role !== "TEACHER") {
    return res.status(403).json({ message: "Only teachers can access the discussions hub" });
  }

  const { classroomId, assignmentId } = req.query;

  try {
    const data = await getTeacherDiscussionsHub(
      new Types.ObjectId(req.user.userId),
      classroomId as string | undefined,
      assignmentId as string | undefined
    );

    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to load discussions" });
  }
};

export const deleteCommentHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const { id } = req.params;
  if (!id || !Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Valid comment id is required" });
  }

  try {
    const result = await deleteComment(
      new Types.ObjectId(id),
      new Types.ObjectId(req.user.userId),
      req.user.role as UserRole
    );

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Failed to delete comment" });
  }
};

export const toggleVerifiedAnswerHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user || req.user.role !== "TEACHER") {
    return res.status(403).json({ message: "Only instructors can verify answers" });
  }

  const { id } = req.params;
  if (!id || !Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Valid comment id is required" });
  }

  try {
    const updated = await toggleVerifiedAnswer(
      new Types.ObjectId(id),
      new Types.ObjectId(req.user.userId)
    );

    return res.status(200).json(updated);
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Failed to toggle verified answer" });
  }
};
