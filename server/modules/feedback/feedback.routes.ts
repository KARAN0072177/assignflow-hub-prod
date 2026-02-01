import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import {
  submitFeedback,
  getLatestFeedbacks,
} from "./feedback.controller";

const router = Router();

// Explicit paths ONLY
router.post("/submit", requireAuth, submitFeedback);
router.get("/latest", getLatestFeedbacks);

export default router;