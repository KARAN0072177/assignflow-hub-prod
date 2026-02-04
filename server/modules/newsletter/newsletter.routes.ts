import { Router } from "express";
import { subscribe, unsubscribe } from "./newsletter.controller";

const router = Router();

router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);

export default router;