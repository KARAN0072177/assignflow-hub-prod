// server/models/studentInsight.model.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export enum InsightSentiment {
  EXCELLING = "EXCELLING",
  GOOD = "GOOD",
  NEEDS_IMPROVEMENT = "NEEDS_IMPROVEMENT",
  NEEDS_ATTENTION = "NEEDS_ATTENTION",
}

export interface IStudentPerformanceInsight extends Document {
  studentId: Types.ObjectId;
  advice: string;
  focusArea: string;
  sentiment: InsightSentiment;
  gradesCountEvaluated: number;
  lastGradeEvaluatedAt?: Date;
  averageScoreEvaluated: number;
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StudentPerformanceInsightSchema: Schema<IStudentPerformanceInsight> =
  new Schema(
    {
      studentId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
        index: true,
      },
      advice: {
        type: String,
        required: true,
        trim: true,
      },
      focusArea: {
        type: String,
        required: true,
        trim: true,
      },
      sentiment: {
        type: String,
        enum: Object.values(InsightSentiment),
        default: InsightSentiment.GOOD,
      },
      gradesCountEvaluated: {
        type: Number,
        required: true,
        default: 0,
      },
      lastGradeEvaluatedAt: {
        type: Date,
        default: null,
      },
      averageScoreEvaluated: {
        type: Number,
        required: true,
        default: 0,
      },
      generatedAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );

export const StudentPerformanceInsight: Model<IStudentPerformanceInsight> =
  mongoose.models.StudentPerformanceInsight ||
  mongoose.model<IStudentPerformanceInsight>(
    "StudentPerformanceInsight",
    StudentPerformanceInsightSchema
  );
