import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { publicFormsLimiter } from "../../middleware/rateLimiters";
import {
  submitFeedback,
  getLatestFeedbacks,
  getFeedbackStats,
} from "./feedback.controller";

const router = Router();

// Form submission protected by auth and submission rate limiter
router.post("/submit", publicFormsLimiter, requireAuth, submitFeedback);

// Public read endpoints (cached & unthrottled for smooth landing page loads)
router.get("/latest", getLatestFeedbacks);
router.get("/stats", getFeedbackStats);

export default router;