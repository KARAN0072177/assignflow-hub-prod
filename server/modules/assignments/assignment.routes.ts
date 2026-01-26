import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { createAssignmentHandler } from "./assignment.controller";

const router = Router();

router.post("/", requireAuth, createAssignmentHandler);

export default router;