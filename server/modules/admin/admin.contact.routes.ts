import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { adminGuard } from "../../middleware/adminGuard";
import { getAdminContacts } from "./admin.contact.controller";

const router = Router();

// Admin inbox (read-only)
router.get(
  "/contacts",
  requireAuth,
  adminGuard,
  getAdminContacts
);

export default router;