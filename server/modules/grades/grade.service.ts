import { Types } from "mongoose";
import { Grade } from "../../models/grade.model";
import { Submission, SubmissionState } from "../../models/submission.model";
import { Assignment } from "../../models/assignment.model";


// Create or update a grade for a submission

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


// Publish a grade to make it visible to the student


export const publishGrade = async (
  gradeId: Types.ObjectId,
  teacherId: Types.ObjectId
) => {
  const grade = await Grade.findById(gradeId);
  if (!grade) {
    throw new Error("Grade not found");
  }

  if (!grade.teacherId.equals(teacherId)) {
    throw new Error("Not authorized to publish this grade");
  }

  if (grade.published) {
    throw new Error("Grade is already published");
  }

  grade.published = true;
  await grade.save();

  return grade;
};


// Get published grades for a student

export const getPublishedGradesForStudent = async (
  studentId: Types.ObjectId
) => {
  const grades = await Grade.find({
    studentId,
    published: true,
  })
    .populate("assignmentId", "title")
    .sort({ updatedAt: -1 });

  return grades.map((g) => ({
    assignment: {
      id: (g.assignmentId as any)._id,
      title: (g.assignmentId as any).title,
    },
    score: g.score,
    feedback: g.feedback,
    gradedAt: g.updatedAt,
  }));
};