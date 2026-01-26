import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { createSubmissionDraftHandler, submitSubmissionHandler } from "./submission.controller";

const router = Router();

router.post("/draft", requireAuth, createSubmissionDraftHandler);
router.patch("/:id/submit", requireAuth, submitSubmissionHandler);

export default router;