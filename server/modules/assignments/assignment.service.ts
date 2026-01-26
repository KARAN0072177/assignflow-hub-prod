import { Assignment, AssignmentState, AssignmentType } from "../../models/assignment.model";
import { Classroom } from "../../models/classroom.model";
import { Types } from "mongoose";
import { generateAssignmentUploadUrl } from "../../utils/s3";

interface CreateAssignmentParams {
  teacherId: Types.ObjectId;
  classroomId: Types.ObjectId;
  title: string;
  description?: string;
  type: AssignmentType;
  dueDate?: Date;
  originalFileName: string;
  fileType: "PDF" | "DOCX";
}

export const createAssignmentDraft = async ({
  teacherId,
  classroomId,
  title,
  description,
  type,
  dueDate,
  originalFileName,
  fileType,
}: CreateAssignmentParams) => {
  // 1. Verify classroom ownership
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new Error("Classroom not found");
  }

  if (!classroom.teacherId.equals(teacherId)) {
    throw new Error("Not authorized to create assignment in this classroom");
  }

  // 2. Create assignment in DRAFT
  const assignment = await Assignment.create({
    classroomId,
    teacherId,
    title,
    description,
    type,
    dueDate,
    state: AssignmentState.DRAFT,
    fileKey: "PENDING", // temporary placeholder
    fileType,
  });

  // 3. Generate S3 upload URL
  const { uploadUrl, fileKey } = await generateAssignmentUploadUrl({
    classroomId: classroomId.toString(),
    assignmentId: assignment._id.toString(),
    originalFileName,
    fileType,
  });

  // 4. Update assignment with real fileKey
  assignment.fileKey = fileKey;
  await assignment.save();

  return {
    assignmentId: assignment._id,
    uploadUrl,
    fileKey,
  };
};