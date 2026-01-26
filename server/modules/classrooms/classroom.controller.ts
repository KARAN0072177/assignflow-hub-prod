import { Request, Response } from "express";
import { z } from "zod";
import { createClassroom, joinClassroomByCode } from "./classroom.service";
import { AuthenticatedRequest } from "../../middleware/requireAuth";
import { Types } from "mongoose";
import { getStudentClassrooms, getTeacherClassrooms } from "./classroom.service";
import { getClassroomByIdWithAccessCheck } from "./classroom.service";

const createClassroomSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});


// Teacher creates a new classroom

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


// Student joins a classroom using join code

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


// Get all classrooms a user is enrolled in or teaching


export const getMyClassroomsHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (req.user?.role === "STUDENT") {
      const classrooms = await getStudentClassrooms(
        new Types.ObjectId(req.user.userId)
      );

      return res.status(200).json(
        classrooms.map((c) => ({
          id: c._id,
          name: c.name,
          description: c.description,
        }))
      );
    }

    if (req.user?.role === "TEACHER") {
      const classrooms = await getTeacherClassrooms(
        new Types.ObjectId(req.user.userId)
      );

      return res.status(200).json(
        classrooms.map((c) => ({
          id: c._id,
          name: c.name,
          description: c.description,
        }))
      );
    }

    return res.status(403).json({ message: "Unauthorized role" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to fetch classrooms" });
  }
};



// Get classroom by ID with access check for student or teacher roles

export const getClassroomByIdHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;

  // 🔒 Guard: id must be a single string
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Invalid classroom id" });
  }

  // 🔒 Guard: must be valid Mongo ObjectId
  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid classroom id format" });
  }

  try {
    const classroom = await getClassroomByIdWithAccessCheck(
      new Types.ObjectId(id),
      new Types.ObjectId(req.user!.userId),
      req.user!.role as "STUDENT" | "TEACHER"
    );

    return res.status(200).json({
      id: classroom._id,
      name: classroom.name,
      description: classroom.description,
    });
  } catch (error: any) {
    if (error.message === "Classroom not found") {
      return res.status(404).json({ message: "Classroom not found" });
    }

    if (error.message === "Access denied") {
      return res.status(403).json({ message: "Access denied" });
    }

    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to fetch classroom" });
  }
};