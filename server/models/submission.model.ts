// server/models/submission.model.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

/**
 * Submission state
 */
export enum SubmissionState {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  LOCKED = "LOCKED",
}

/**
 * Submission document interface
 */
export interface ISubmission extends Document {
  assignmentId: Types.ObjectId;
  classroomId: Types.ObjectId;
  studentId: Types.ObjectId;

  state: SubmissionState;

  fileKey: string; // S3 object key
  fileType: "PDF" | "DOCX";
  fileSize?: number; // in bytes

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Submission schema
 */
const SubmissionSchema: Schema<ISubmission> = new Schema(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
      index: true,
    },
    classroomId: {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
      index: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    state: {
      type: String,
      enum: Object.values(SubmissionState),
      default: SubmissionState.DRAFT,
      index: true,
    },

    fileKey: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      enum: ["PDF", "DOCX"],
      required: true,
    },
    fileSize: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Enforce one submission per student per assignment
 */
SubmissionSchema.index(
  { assignmentId: 1, studentId: 1 },
  { unique: true }
);

export const Submission: Model<ISubmission> =
  mongoose.models.Submission ||
  mongoose.model<ISubmission>("Submission", SubmissionSchema);