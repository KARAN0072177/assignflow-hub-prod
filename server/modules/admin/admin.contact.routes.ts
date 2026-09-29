import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { requireAdmin } from "../../middleware/requireAdmin";
import { getAdminContacts, markMessageAsRead, markMessagesAsReadBulk } from "./admin.contact.controller";

const router = Router();

router.use(requireAuth);
router.use(requireAdmin);

// Admin inbox (read-only)
router.get("/contacts", getAdminContacts);

// Mark single message as read
router.patch("/contacts/:id/read", markMessageAsRead);

// Mark multiple messages as read
router.post("/contacts/bulk-read", markMessagesAsReadBulk);

export default router;