import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import {
  createAssignmentHandler,
  publishAssignmentHandler,
  markClassroomReadHandler,
  getStudentUnreadCountHandler,
} from "./assignment.controller";
import { uploadRateLimiter } from "../../middleware/rateLimiter";

const router = Router();

router.post("/", requireAuth, uploadRateLimiter, createAssignmentHandler);

router.patch("/:id/publish", requireAuth, publishAssignmentHandler);

// Student total and per-classroom unread assignments count
router.get("/student/unread-count", requireAuth, getStudentUnreadCountHandler);

// Mark all assignments in a classroom as read for student
router.post("/classroom/:classroomId/read", requireAuth, markClassroomReadHandler);

export default router;