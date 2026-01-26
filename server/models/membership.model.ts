// server/models/membership.model.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IMembership extends Document {
  studentId: Types.ObjectId;
  classroomId: Types.ObjectId;
  createdAt: Date;
}

const MembershipSchema: Schema<IMembership> = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    classroomId: {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Prevent duplicate joins
MembershipSchema.index(
  { studentId: 1, classroomId: 1 },
  { unique: true }
);

export const Membership: Model<IMembership> =
  mongoose.models.Membership ||
  mongoose.model<IMembership>("Membership", MembershipSchema);