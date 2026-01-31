import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { createSubmissionDraftHandler, submitSubmissionHandler } from "./submission.controller";
import { listSubmissionsForAssignmentHandler } from "./submission.controller";
import { uploadRateLimiter } from "../../middleware/rateLimiter";

const router = Router();

router.post("/draft", requireAuth, uploadRateLimiter, createSubmissionDraftHandler);
router.patch("/:id/submit", requireAuth, uploadRateLimiter, submitSubmissionHandler);
router.get("/assignment/:id", requireAuth, listSubmissionsForAssignmentHandler);

export default router;