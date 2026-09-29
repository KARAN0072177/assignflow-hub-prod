import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { requireAdmin } from "../../middleware/requireAdmin";
import { getAuditLogs } from "./admin.controller";

const router = Router();

router.get("/audit-logs", requireAuth, requireAdmin, getAuditLogs);

export default router;