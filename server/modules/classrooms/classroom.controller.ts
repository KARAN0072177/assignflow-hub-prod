import { Request, Response } from "express";
import { z } from "zod";
import { createClassroom, joinClassroomByCode } from "./classroom.service";
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

export const joinClassroomHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (req.user?.role !== "STUDENT") {
    return res
      .status(403)
      .json({ message: "Only students can join classrooms" });
  }

  const { code } = req.body;

  if (!code || typeof code !== "string") {
    return res.status(400).json({ message: "Classroom code is required" });
  }

  try {
    const result = await joinClassroomByCode(
      new Types.ObjectId(req.user.userId),
      code
    );

    return res.status(201).json({
      message: "Joined classroom successfully",
      classroom: result,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Already joined this classroom" });
    }

    return res.status(400).json({ message: error.message });
  }
};