import mongoose, { Schema, Document, Model, Types } from "mongoose";

export enum NotificationType {
  DEADLINE_STUDENT = "DEADLINE_STUDENT",
  DEADLINE_TEACHER = "DEADLINE_TEACHER",
  MENTION = "MENTION",
}

export interface INotification extends Document {
  recipientId: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  link: string;
  metadata?: {
    assignmentId?: Types.ObjectId;
    classroomId?: Types.ObjectId;
    commentId?: Types.ObjectId;
    authorUsername?: string;
    authorName?: string;
    assignmentTitle?: string;
    dueDate?: Date;
    shareText?: string;
  };
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

const NotificationSchema: Schema<INotification> = new Schema(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    metadata: {
      assignmentId: { type: Schema.Types.ObjectId, ref: "Assignment" },
      classroomId: { type: Schema.Types.ObjectId, ref: "Classroom" },
      commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
      authorUsername: { type: String },
      authorName: { type: String },
      assignmentTitle: { type: String },
      dueDate: { type: Date },
      shareText: { type: String },
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound indexes for fast retrieval & duplicate prevention
NotificationSchema.index({ recipientId: 1, createdAt: -1 });
NotificationSchema.index({ recipientId: 1, isRead: 1 });
NotificationSchema.index({ recipientId: 1, type: 1, "metadata.assignmentId": 1 });

export const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);
