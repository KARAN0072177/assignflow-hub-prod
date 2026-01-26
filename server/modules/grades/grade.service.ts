import { Types } from "mongoose";
import { Grade } from "../../models/grade.model";
import { Submission, SubmissionState } from "../../models/submission.model";
import { Assignment } from "../../models/assignment.model";

export const createOrUpdateGrade = async ({
  submissionId,
  teacherId,
  score,
  feedback,
}: {
  submissionId: Types.ObjectId;
  teacherId: Types.ObjectId;
  score: number;
  feedback?: string;
}) => {
  // 1. Fetch submission
  const submission = await Submission.findById(submissionId);
  if (!submission) {
    throw new Error("Submission not found");
  }

  if (submission.state !== SubmissionState.SUBMITTED) {
    throw new Error("Only submitted submissions can be graded");
  }

  // 2. Fetch assignment & verify ownership
  const assignment = await Assignment.findById(submission.assignmentId);
  if (!assignment) {
    throw new Error("Assignment not found");
  }

  if (!assignment.teacherId.equals(teacherId)) {
    throw new Error("Not authorized to grade this submission");
  }

  // 3. Check existing grade
  let grade = await Grade.findOne({ submissionId });

  if (grade) {
    if (grade.published) {
      throw new Error("Published grade cannot be modified");
    }

    grade.score = score;
    grade.feedback = feedback;
    await grade.save();
  } else {
    grade = await Grade.create({
      assignmentId: submission.assignmentId,
      submissionId,
      studentId: submission.studentId,
      teacherId,
      score,
      feedback,
      published: false,
    });
  }

  return grade;
};