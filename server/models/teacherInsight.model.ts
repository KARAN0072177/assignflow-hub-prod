import mongoose, { Document, Schema } from "mongoose";

export interface ITeacherInsight extends Document {
  teacherId: mongoose.Types.ObjectId;
  summary: string;
  actionItems: string[];
  metrics: Record<string, string>;
  isPinned: boolean;
  pinnedAt?: Date;
  generatedAt: Date;
}

const teacherInsightSchema = new Schema<ITeacherInsight>(
  {
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    summary: {
      type: String,
      required: true,
    },
    actionItems: {
      type: [String],
      required: true,
    },
    metrics: {
      type: Schema.Types.Mixed,
      required: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },
    pinnedAt: {
      type: Date,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const TeacherInsight = mongoose.model<ITeacherInsight>("TeacherInsight", teacherInsightSchema);

// Sync indexes with MongoDB to drop any legacy unique constraint on teacherId_1
TeacherInsight.syncIndexes().catch((err) => {
  console.log("TeacherInsight index sync info:", err?.message);
});

export default TeacherInsight;
