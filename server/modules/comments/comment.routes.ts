import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { commentLimiter } from "../../middleware/rateLimiters";
import {
  postCommentHandler,
  getAssignmentCommentsHandler,
  getTeacherDiscussionsHandler,
  markAssignmentReadHandler,
  getTeacherUnreadCountHandler,
  deleteCommentHandler,
  toggleVerifiedAnswerHandler,
} from "./comment.controller";

const router = Router();

// All comment routes require authentication
router.use(requireAuth);

// Post a comment / reply (protected by strict 10/min commentLimiter)
router.post("/", commentLimiter, postCommentHandler);

// Get comments for an assignment
router.get("/assignment/:assignmentId", getAssignmentCommentsHandler);

// Mark all comments for an assignment as read
router.post("/assignment/:assignmentId/read", markAssignmentReadHandler);

// Toggle Instructor Verified Answer / Pin Solution
router.patch("/:id/verify", toggleVerifiedAnswerHandler);

// Teacher Discussions Hub
router.get("/teacher/hub", getTeacherDiscussionsHandler);

// Teacher total unread discussions count (for sidebar badge)
router.get("/teacher/unread-count", getTeacherUnreadCountHandler);

// Delete comment
router.delete("/:id", deleteCommentHandler);

export default router;
