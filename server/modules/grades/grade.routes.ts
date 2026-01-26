import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { gradeSubmissionHandler } from "./grade.controller";

const router = Router();

router.post("/", requireAuth, gradeSubmissionHandler);

export default router;