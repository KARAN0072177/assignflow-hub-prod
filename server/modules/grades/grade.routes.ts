import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { studentInsightLimiter } from "../../middleware/rateLimiters";
import {
  getMyGradesHandler,
  gradeSubmissionHandler,
  publishGradeHandler,
  getTeacherStudentsAnalyticsHandler,
  getStudentAiInsightHandler,
} from "./grade.controller";

const router = Router();

router.post("/", requireAuth, gradeSubmissionHandler);
router.patch("/:id/publish", requireAuth, publishGradeHandler);
router.get("/my", requireAuth, getMyGradesHandler);
router.get("/my/ai-insight", requireAuth, studentInsightLimiter, getStudentAiInsightHandler);
router.get("/teacher/analytics", requireAuth, getTeacherStudentsAnalyticsHandler);

export default router;