import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type AuditActorRole =
  | "SYSTEM"
  | "TEACHER"
  | "STUDENT"
  | "USER";

export type AuditEntityType =
  | "ASSIGNMENT"
  | "SUBMISSION"
  | "GRADE"
  | "CLASSROOM"
  | "AUTH";

export interface IAuditLog extends Document {
  actorId?: Types.ObjectId;      // null/undefined for SYSTEM
  actorRole: AuditActorRole;

  action: string;               // e.g. "SUBMISSION_LOCKED"
  entityType: AuditEntityType;
  entityId?: Types.ObjectId;     // optional for AUTH events

  metadata?: Record<string, any>;

  createdAt: Date;
}

const AuditLogSchema: Schema<IAuditLog> = new Schema(
  {
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },

    actorRole: {
      type: String,
      enum: ["SYSTEM", "TEACHER", "STUDENT", "USER"],
      required: true,
      index: true,
    },

    action: {
      type: String,
      required: true,
      index: true,
    },

    entityType: {
      type: String,
      enum: [
        "ASSIGNMENT",
        "SUBMISSION",
        "GRADE",
        "CLASSROOM",
        "AUTH",
      ],
      required: true,
      index: true,
    },

    entityId: {
      type: Schema.Types.ObjectId,
      required: false,
      index: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);