import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import {
  createClassroomHandler,
  joinClassroomHandler,
  getMyClassroomsHandler,
  getClassroomByIdHandler,
  getTeacherClassroomStudentsHandler,
} from "./classroom.controller";
import { listAssignmentsForClassroomHandler } from "../assignments/assignment.controller";

const router = Router();

router.post("/", requireAuth, createClassroomHandler); // Create classroom route
router.post("/join", requireAuth, joinClassroomHandler); // Join classroom route
router.get("/my", requireAuth, getMyClassroomsHandler); // Get my classrooms route
router.get(
  "/teacher/students",
  requireAuth,
  getTeacherClassroomStudentsHandler
); // Teacher view: students across created classrooms
router.get(
  "/:id/assignments",
  requireAuth,
  listAssignmentsForClassroomHandler
);
router.get("/:id", requireAuth, getClassroomByIdHandler); // Get classroom by ID route

export default router;