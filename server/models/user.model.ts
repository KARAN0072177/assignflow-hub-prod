// server/models/user.model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Allowed user roles (MVP)
 */
export enum UserRole {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
}

/**
 * User document interface
 */
export interface IUser extends Document {
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User schema
 */
const UserSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // IMPORTANT: do not return password by default
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * User model
 */
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);