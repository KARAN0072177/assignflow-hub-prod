import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import {
  getMyNotificationsHandler,
  markNotificationReadHandler,
  markAllNotificationsReadHandler,
} from "./notification.controller";

const router = Router();

// All notification endpoints require authenticated user
router.use(requireAuth);

router.get("/", getMyNotificationsHandler);
router.patch("/read-all", markAllNotificationsReadHandler);
router.patch("/:id/read", markNotificationReadHandler);

export default router;
