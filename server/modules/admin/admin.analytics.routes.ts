import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { requireAdmin } from "../../middleware/requireAdmin";
import { getAdminAnalytics } from "./admin.analytics.controller";

const router = Router();

router.get("/analytics", requireAuth, requireAdmin, getAdminAnalytics);

export default router;