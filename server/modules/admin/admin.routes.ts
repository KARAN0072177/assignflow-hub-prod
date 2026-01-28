import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { getAuditLogs } from "./admin.controller";

const router = Router();

router.get("/audit-logs", requireAuth, getAuditLogs);

export default router;