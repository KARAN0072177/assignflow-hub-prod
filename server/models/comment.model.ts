import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { UserRole } from "./user.model";

export interface IComment extends Document {
  assignmentId: Types.ObjectId;
  classroomId: Types.ObjectId;
  authorId: Types.ObjectId;
  authorRole: UserRole;
  authorEmail: string;
  authorName?: string;
  content: string;
  parentCommentId?: Types.ObjectId; // For replies to other comments
  replyToUser?: {
    id: Types.ObjectId;
    email: string;
    role: UserRole;
  };
  readBy: Types.ObjectId[];
  isVerifiedAnswer?: boolean;
  verifiedBy?: Types.ObjectId;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema<IComment> = new Schema(
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
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    authorRole: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    authorEmail: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true,
    },
    replyToUser: {
      id: { type: Schema.Types.ObjectId, ref: "User" },
      email: { type: String },
      role: { type: String, enum: Object.values(UserRole) },
    },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },
    ],
    isVerifiedAnswer: {
      type: Boolean,
      default: false,
      index: true,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    verifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

CommentSchema.index({ assignmentId: 1, createdAt: 1 });
CommentSchema.index({ classroomId: 1, createdAt: -1 });

export const Comment: Model<IComment> =
  mongoose.models.Comment ||
  mongoose.model<IComment>("Comment", CommentSchema);
