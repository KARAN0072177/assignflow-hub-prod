import { Request, Response } from "express";
import { z } from "zod";
import { createClassroom } from "./classroom.service";
import { AuthenticatedRequest } from "../../middleware/requireAuth";
import { Types } from "mongoose";

const createClassroomSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

export const createClassroomHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  // Auth guaranteed by middleware
  if (req.user?.role !== "TEACHER") {
    return res.status(403).json({ message: "Only teachers can create classrooms" });
  }

  const parsed = createClassroomSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const classroom = await createClassroom(
      new Types.ObjectId(req.user.userId),
      parsed.data.name,
      parsed.data.description
    );

    return res.status(201).json({
      id: classroom._id,
      name: classroom.name,
      code: classroom.code,
      status: classroom.status,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create classroom" });
  }
};