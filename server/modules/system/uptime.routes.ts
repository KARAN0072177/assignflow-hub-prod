import { Router } from "express";
import { getPublicUptime } from "./uptime.controller";

const router = Router();

// GET /api/system/uptime
router.get("/uptime", getPublicUptime);

export default router;
