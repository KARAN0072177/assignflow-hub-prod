import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { adminGuard } from "../../middleware/adminGuard";

import {
  getSubscribers,
  sendCampaign,
} from "./admin.newsletter.controller";

const router = Router();

router.use(requireAuth);
router.use(adminGuard);

router.get("/subscribers", getSubscribers);
router.post("/send", sendCampaign);

export default router;