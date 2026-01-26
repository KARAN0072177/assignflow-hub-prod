import { Types } from "mongoose";
import { Assignment, AssignmentState } from "../../models/assignment.model";
import { Submission, SubmissionState } from "../../models/submission.model";
import { Membership } from "../../models/membership.model";
import { generateSubmissionUploadUrl } from "../../utils/s3-submission";

export const createOrUpdateSubmissionDraft = async ({
  studentId,
  assignmentId,
  originalFileName,
  fileType,
}: {
  studentId: Types.ObjectId;
  assignmentId: Types.ObjectId;
  originalFileName: string;
  fileType: "PDF" | "DOCX";
}) => {
  // 1. Fetch assignment
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    throw new Error("Assignment not found");
  }

  if (assignment.state !== AssignmentState.PUBLISHED) {
    throw new Error("Assignment is not open for submissions");
  }

  // 2. Deadline enforcement
  if (assignment.dueDate && new Date() > assignment.dueDate) {
    throw new Error("Submission deadline has passed");
  }

  // 3. Verify classroom membership
  const membership = await Membership.findOne({
    studentId,
    classroomId: assignment.classroomId,
  });

  if (!membership) {
    throw new Error("Not a member of this classroom");
  }

  // 4. Check existing submission
  let submission = await Submission.findOne({
    assignmentId,
    studentId,
  });

  if (submission) {
    if (submission.state !== SubmissionState.DRAFT) {
      throw new Error("Submission can no longer be edited");
    }
  } else {
    submission = await Submission.create({
      assignmentId,
      classroomId: assignment.classroomId,
      studentId,
      state: SubmissionState.DRAFT,
      fileKey: "PENDING",
      fileType,
    });
  }

  // 5. Generate S3 upload URL
  const { uploadUrl, fileKey } = await generateSubmissionUploadUrl({
    classroomId: assignment.classroomId.toString(),
    assignmentId: assignmentId.toString(),
    studentId: studentId.toString(),
    originalFileName,
    fileType,
  });

  // 6. Update submission fileKey
  submission.fileKey = fileKey;
  submission.fileType = fileType;
  await submission.save();

  return {
    submissionId: submission._id,
    uploadUrl,
    fileKey,
  };
};