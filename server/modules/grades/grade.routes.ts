import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { getMyGradesHandler, gradeSubmissionHandler, publishGradeHandler } from "./grade.controller";

const router = Router();

router.post("/", requireAuth, gradeSubmissionHandler);
router.patch("/:id/publish", requireAuth, publishGradeHandler);
router.get("/my", requireAuth, getMyGradesHandler);

export default router;