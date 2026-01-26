// server/models/classroom.model.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

/**
 * Classroom lifecycle status
 */
export enum ClassroomStatus {
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
}

/**
 * Classroom document interface
 */
export interface IClassroom extends Document {
  name: string;
  description?: string;
  code: string;
  teacherId: Types.ObjectId;
  status: ClassroomStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Classroom schema
 */
const ClassroomSchema: Schema<IClassroom> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(ClassroomStatus),
      default: ClassroomStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Classroom model
 */
export const Classroom: Model<IClassroom> =
  mongoose.models.Classroom ||
  mongoose.model<IClassroom>("Classroom", ClassroomSchema);