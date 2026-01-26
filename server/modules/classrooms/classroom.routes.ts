import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { createClassroomHandler } from "./classroom.controller";
import { joinClassroomHandler } from "./classroom.controller";

const router = Router();

router.post("/", requireAuth, createClassroomHandler);        // Create classroom route
router.post("/join", requireAuth, joinClassroomHandler);      // Join classroom route

export default router;