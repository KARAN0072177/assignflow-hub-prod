import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { createSubmissionDraftHandler } from "./submission.controller";

const router = Router();

router.post("/draft", requireAuth, createSubmissionDraftHandler);

export default router;