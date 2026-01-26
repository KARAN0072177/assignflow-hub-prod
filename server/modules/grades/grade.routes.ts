import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { gradeSubmissionHandler, publishGradeHandler } from "./grade.controller";

const router = Router();

router.post("/", requireAuth, gradeSubmissionHandler);
router.patch("/:id/publish", requireAuth, publishGradeHandler);

export default router;