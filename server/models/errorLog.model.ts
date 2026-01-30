import mongoose, { Schema, Document, Model } from "mongoose";

export enum ErrorSeverity {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
}

export interface IErrorLog extends Document {
  source: "API" | "WORKER";
  message: string;
  severity: ErrorSeverity;

  route?: string;
  method?: string;
  statusCode?: number;

  jobName?: string;
  stack?: string;

  createdAt: Date;
}

const ErrorLogSchema = new Schema<IErrorLog>(
  {
    source: {
      type: String,
      enum: ["API", "WORKER"],
      required: true,
      index: true,
    },

    message: {
      type: String,
      required: true,
    },

    severity: {
      type: String,
      enum: Object.values(ErrorSeverity),
      required: true,
      index: true,
    },

    route: String,
    method: String,
    statusCode: Number,

    jobName: String,
    stack: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ErrorLog: Model<IErrorLog> =
  mongoose.models.ErrorLog ||
  mongoose.model<IErrorLog>("ErrorLog", ErrorLogSchema);