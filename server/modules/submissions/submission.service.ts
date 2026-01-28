import { Types } from "mongoose";
import { Assignment, AssignmentState } from "../../models/assignment.model";
import { Submission, SubmissionState } from "../../models/submission.model";
import { Membership } from "../../models/membership.model";
import { generateSubmissionUploadUrl } from "../../utils/s3-submission";
import { Grade } from "../../models/grade.model";
import { logAuditEvent } from "../../utils/auditLogger";

// Create or update a submission draft

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

// Submit a submission for grading

export const submitSubmission = async (
  submissionId: Types.ObjectId,
  studentId: Types.ObjectId
) => {
  const submission = await Submission.findById(submissionId);

  if (!submission) {
    throw new Error("Submission not found");
  }

  if (!submission.studentId.equals(studentId)) {
    throw new Error("Not authorized to submit this submission");
  }

  if (submission.state !== SubmissionState.DRAFT) {
    throw new Error("Submission is not in draft state");
  }

  const assignment = await Assignment.findById(submission.assignmentId);

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  if (assignment.state !== AssignmentState.PUBLISHED) {
    throw new Error("Assignment is not accepting submissions");
  }

  if (assignment.dueDate && new Date() > assignment.dueDate) {
    submission.state = SubmissionState.LOCKED;
    await submission.save();
    throw new Error("Submission deadline has passed");
  }

  submission.state = SubmissionState.SUBMITTED;
  await submission.save();

  await logAuditEvent({
    actorRole: "STUDENT",
    actorId: studentId,
    action: "SUBMISSION_SUBMITTED",
    entityType: "SUBMISSION",
    entityId: submission._id,
    metadata: {
      assignmentId: submission.assignmentId,
      classroomId: submission.classroomId,
    },
  });
  return submission;
};


// Get all submissions for an assignment (teacher view)

import { generateDownloadUrl } from "../../utils/s3-download";
import { User } from "../../models/user.model";

export const getSubmissionsForAssignment = async (
  assignmentId: Types.ObjectId,
  teacherId: Types.ObjectId
) => {
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    throw new Error("Assignment not found");
  }

  if (!assignment.teacherId.equals(teacherId)) {
    throw new Error("Access denied");
  }

  const submissions = await Submission.find({ assignmentId })
    .populate("studentId", "email")
    .sort({ createdAt: -1 });

  return Promise.all(
    submissions.map(async (s) => {
      const grade = await Grade.findOne({ submissionId: s._id });

      return {
        id: s._id,
        student: {
          id: (s.studentId as any)._id,
          email: (s.studentId as any).email,
        },
        state: s.state,
        submittedAt: s.updatedAt,
        downloadUrl:
          s.state !== "DRAFT" ? await generateDownloadUrl(s.fileKey) : null,
        grade: grade
          ? {
            id: grade._id,
            score: grade.score,
            feedback: grade.feedback,
            published: grade.published,
          }
          : null,
      };
    })
  );
};