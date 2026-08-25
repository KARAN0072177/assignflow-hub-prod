import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { studentInsightLimiter, teacherInsightLimiter } from "../../middleware/rateLimiters";
import {
  getMyGradesHandler,
  gradeSubmissionHandler,
  publishGradeHandler,
  getTeacherStudentsAnalyticsHandler,
  getStudentAiInsightHandler,
  getTeacherAiInsightHandler,
  generateTeacherAiInsightHandler,
  deleteTeacherAiInsightHandler,
  togglePinTeacherAiInsightHandler,
} from "./grade.controller";

const router = Router();

router.post("/", requireAuth, gradeSubmissionHandler);
router.patch("/:id/publish", requireAuth, publishGradeHandler);
router.get("/my", requireAuth, getMyGradesHandler);
router.get("/my/ai-insight", requireAuth, studentInsightLimiter, getStudentAiInsightHandler);
router.get("/teacher/analytics", requireAuth, getTeacherStudentsAnalyticsHandler);
router.get("/teacher/ai-insights", requireAuth, getTeacherAiInsightHandler);
router.post("/teacher/ai-insights/generate", requireAuth, teacherInsightLimiter, generateTeacherAiInsightHandler);
router.delete("/teacher/ai-insights/:id", requireAuth, deleteTeacherAiInsightHandler);
router.patch("/teacher/ai-insights/:id/pin", requireAuth, togglePinTeacherAiInsightHandler);

export default router;