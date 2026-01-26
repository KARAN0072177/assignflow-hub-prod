import { Classroom, ClassroomStatus } from "../../models/classroom.model";
import { Types } from "mongoose";

const generateJoinCode = (): string => {
  const letters = Math.random().toString(36).substring(2, 6).toUpperCase();
  const numbers = Math.floor(1000 + Math.random() * 9000);
  return `${letters}-${numbers}`;
};

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