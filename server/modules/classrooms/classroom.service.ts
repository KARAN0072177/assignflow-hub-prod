import { Classroom, ClassroomStatus } from "../../models/classroom.model";
import { Types } from "mongoose";
import { Membership } from "../../models/membership.model";

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
  let code: string = ""; // initialize
  let exists = true;

  while (exists) {
    code = generateJoinCode();
    exists = !!(await Classroom.findOne({ code }));
  }

  const classroom = await Classroom.create({
    name,
    description,
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