import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { createAssignmentHandler } from "./assignment.controller";
import { publishAssignmentHandler } from "./assignment.controller";
import { uploadRateLimiter } from "../../middleware/rateLimiter";

const router = Router();

router.post("/", requireAuth, uploadRateLimiter, createAssignmentHandler);

router.patch("/:id/publish", requireAuth, publishAssignmentHandler)

export default router;