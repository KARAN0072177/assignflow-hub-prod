import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { requireAdmin } from "../../middleware/requireAdmin";
import { getSystemMetadata } from "./admin.system.controller";

const router = Router();

router.get("/system", requireAuth, requireAdmin, getSystemMetadata);

export default router;