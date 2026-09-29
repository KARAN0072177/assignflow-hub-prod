// server/modules/newsletter/admin.newsletter.routes.ts

import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { requireAdmin } from "../../middleware/requireAdmin";

import {
  getSubscribers,
  sendCampaign,
} from "./admin.newsletter.controller";

const router = Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get("/subscribers", getSubscribers);
router.post("/send", sendCampaign);

export default router;