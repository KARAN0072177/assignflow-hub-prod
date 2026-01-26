import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { createClassroomHandler } from "./classroom.controller";

const router = Router();

router.post("/", requireAuth, createClassroomHandler);

export default router;