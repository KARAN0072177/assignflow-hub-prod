import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { createAssignmentHandler } from "./assignment.controller";
import { publishAssignmentHandler } from "./assignment.controller";

const router = Router();

router.post("/", requireAuth, createAssignmentHandler);

router.patch("/:id/publish", requireAuth, publishAssignmentHandler)

export default router;