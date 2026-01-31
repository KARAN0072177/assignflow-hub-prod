import mongoose, { Schema, Document, Model } from "mongoose";

export enum SecurityEventType {
  RATE_LIMIT_HIT = "RATE_LIMIT_HIT",
}

export interface ISecurityEvent extends Document {
  type: SecurityEventType;

  ip: string;
  endpoint: string;
  method: string;
  userAgent?: string;

  createdAt: Date;
}

const SecurityEventSchema = new Schema<ISecurityEvent>(
  {
    type: {
      type: String,
      enum: Object.values(SecurityEventType),
      required: true,
      index: true,
    },

    ip: {
      type: String,
      required: true,
      index: true,
    },

    endpoint: {
      type: String,
      required: true,
    },

    method: {
      type: String,
      required: true,
    },

    userAgent: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const SecurityEvent: Model<ISecurityEvent> =
  mongoose.models.SecurityEvent ||
  mongoose.model<ISecurityEvent>("SecurityEvent", SecurityEventSchema);