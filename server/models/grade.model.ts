// server/models/grade.model.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

/**
 * Grade document interface
 */
export interface IGrade extends Document {
  assignmentId: Types.ObjectId;
  submissionId: Types.ObjectId;
  studentId: Types.ObjectId;
  teacherId: Types.ObjectId;

  score: number;          // numeric marks
  feedback?: string;      // optional textual feedback

  published: boolean;     // controls student visibility

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Grade schema
 */
const GradeSchema: Schema<IGrade> = new Schema(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
      index: true,
    },
    submissionId: {
      type: Schema.Types.ObjectId,
      ref: "Submission",
      required: true,
      unique: true, // ONE grade per submission
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
    },

    feedback: {
      type: String,
      trim: true,
    },

    published: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Grade model
 */
export const Grade: Model<IGrade> =
  mongoose.models.Grade ||
  mongoose.model<IGrade>("Grade", GradeSchema);