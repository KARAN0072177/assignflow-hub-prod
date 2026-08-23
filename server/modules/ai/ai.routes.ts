import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { aiEnhancerLimiter } from "../../middleware/rateLimiters";
import { enhanceDescriptionHandler } from "./ai.controller";

const router = Router();

// All AI features require teacher authentication
router.use(requireAuth);

// Enhance assignment / coursework description with AI (Rate-limited to 5/min)
router.post("/enhance-description", aiEnhancerLimiter, enhanceDescriptionHandler);

export default router;
