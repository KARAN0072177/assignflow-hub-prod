import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { adminGuard } from "../../middleware/adminGuard";
import { getAdminContacts, markMessageAsRead, markMessagesAsReadBulk } from "./admin.contact.controller";

const router = Router();

// Admin inbox (read-only)
router.get(
  "/contacts",
  requireAuth,
  adminGuard,
  getAdminContacts
);

// Mark single message as read
router.patch(
  "/contacts/:id/read",
  requireAuth,
  adminGuard,
  markMessageAsRead
);

// Mark multiple messages as read
router.post(
  "/contacts/bulk-read",
  requireAuth,
  adminGuard,
  markMessagesAsReadBulk
);

export default router;