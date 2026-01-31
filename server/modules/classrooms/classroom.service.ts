import { Classroom, ClassroomStatus } from "../../models/classroom.model";
import { Types } from "mongoose";
import { Membership } from "../../models/membership.model";
import sanitizeHtml from "sanitize-html";

const generateJoinCode = (): string => {
  const letters = Math.random().toString(36).substring(2, 6).toUpperCase();
  const numbers = Math.floor(1000 + Math.random() * 9000);
  return `${letters}-${numbers}`;
};


// Create a new classroom by a teacher

export const createClassroom = async (
  teacherId: Types.ObjectId,
  name: string,
  description?: string
) => {
  // 0. Sanitize user input (WRITE-time protection)
  const cleanName = sanitizeHtml(name.trim(), {
    allowedTags: [],
    allowedAttributes: {},
  });

  const cleanDescription = description
    ? sanitizeHtml(description.trim(), {
        allowedTags: [],
        allowedAttributes: {},
      })
    : undefined;

  // Optional but recommended: basic validation
  if (!cleanName) {
    throw new Error("Classroom name is required");
  }

  let code = "";
  let exists = true;

  while (exists) {
    code = generateJoinCode();
    exists = !!(await Classroom.findOne({ code }));
  }

  const classroom = await Classroom.create({
    name: cleanName,
    description: cleanDescription,
    code,
    teacherId,
    status: ClassroomStatus.ACTIVE,
  });

  return classroom;
};


// Student joins a classroom using join code

export const joinClassroomByCode = async (
  studentId: Types.ObjectId,
  code: string
) => {
  const classroom = await Classroom.findOne({ code, status: "ACTIVE" });
  if (!classroom) {
    throw new Error("Invalid classroom code");
  }

  // Membership creation (unique index prevents duplicates)
  const membership = await Membership.create({
    studentId,
    classroomId: classroom._id,
  });

  return {
    classroomId: classroom._id,
    name: classroom.name,
  };
};

// Get all classrooms a student is enrolled in

export const getStudentClassrooms = async (studentId: Types.ObjectId) => {
  const memberships = await Membership.find({ studentId }).select(
    "classroomId"
  );

  const classroomIds = memberships.map((m) => m.classroomId);

  const classrooms = await Classroom.find({
    _id: { $in: classroomIds },
    status: "ACTIVE",
  }).select("name description");

  return classrooms;
};

// Get all classrooms created by a teacher

export const getTeacherClassrooms = async (teacherId: Types.ObjectId) => {
  const classrooms = await Classroom.find({
    teacherId,
    status: "ACTIVE",
  }).select("name description");

  return classrooms;
};


// Get classroom by ID with access check for student or teacher roles

export const getClassroomByIdWithAccessCheck = async (
  classroomId: Types.ObjectId,
  userId: Types.ObjectId,
  role: "STUDENT" | "TEACHER"
) => {
  const classroom = await Classroom.findById(classroomId).select(
    "name description teacherId status"
  );

  if (!classroom || classroom.status !== "ACTIVE") {
    throw new Error("Classroom not found");
  }

  // Teacher access: must own the classroom
  if (role === "TEACHER") {
    if (!classroom.teacherId.equals(userId)) {
      throw new Error("Access denied");
    }
    return classroom;
  }

  // Student access: must have membership
  if (role === "STUDENT") {
    const membership = await Membership.findOne({
      studentId: userId,
      classroomId: classroom._id,
    });

    if (!membership) {
      throw new Error("Access denied");
    }

    return classroom;
  }

  throw new Error("Access denied");
};