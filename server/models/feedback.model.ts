import mongoose, { Schema, Document, Model, Types } from "mongoose";

/**
 * Feedback document interface
 */
export interface IFeedback extends Document {
  userId: Types.ObjectId;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  rating: number;       // 1–5
  message: string;
  createdAt: Date;
}

/**
 * Feedback schema
 */
const FeedbackSchema: Schema<IFeedback> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["STUDENT", "TEACHER", "ADMIN"],
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      index: true,
    },

    message: {
      type: String,
      required: true,
      maxlength: 300,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

/**
 * Optional: prevent spam (one feedback per user)
 * Uncomment if you want strict control
 */
// FeedbackSchema.index({ userId: 1 }, { unique: true });

/**
 * Feedback model
 */
export const Feedback: Model<IFeedback> =
  mongoose.models.Feedback ||
  mongoose.model<IFeedback>("Feedback", FeedbackSchema);