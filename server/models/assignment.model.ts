// server/models/assignment.model.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

/**
 * Assignment type
 */
export enum AssignmentType {
  GRADED = "GRADED",
  MATERIAL = "MATERIAL",
}

/**
 * Assignment state
 */
export enum AssignmentState {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

/**
 * Assignment document interface
 */
export interface IAssignment extends Document {
  classroomId: Types.ObjectId;
  teacherId: Types.ObjectId;

  title: string;
  description?: string;

  type: AssignmentType;
  state: AssignmentState;

  dueDate?: Date;

  fileKey: string; // S3 object key
  fileType: "PDF" | "DOCX";

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Assignment schema
 */
const AssignmentSchema: Schema<IAssignment> = new Schema(
  {
    classroomId: {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
      index: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      enum: Object.values(AssignmentType),
      required: true,
    },

    state: {
      type: String,
      enum: Object.values(AssignmentState),
      default: AssignmentState.DRAFT,
      index: true,
    },

    dueDate: {
      type: Date,
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
  },
  {
    timestamps: true,
  }
);

/**
 * Assignment model
 */
export const Assignment: Model<IAssignment> =
  mongoose.models.Assignment ||
  mongoose.model<IAssignment>("Assignment", AssignmentSchema);