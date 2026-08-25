// server/models/user.model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Allowed user roles (MVP)
 */
export enum UserRole {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  ADMIN = "ADMIN",
}

/**
 * User document interface
 */
export interface IUser extends Document {
  email: string;
  username?: string;
  password: string;
  role: UserRole;

  // ✅ Email verification
  isVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;

  // 🔐 Password reset fields
  resetPasswordOtp?: string;
  resetPasswordOtpExpires?: Date;

  // For OTP rate limiting (advanced feature) and resend cooldown
  resetOtpLastSentAt?: Date;
  resetOtpAttempts?: number;

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

    username: {
      type: String,
      unique: true,
      sparse: true, // Crucial: allows existing users without username to not collide
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
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

    // ============================
    // Email Verification Fields
    // ============================

    isVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
    },

    emailVerificationExpires: {
      type: Date,
    },

    // ============================
    // Password Reset Fields
    // ============================

    resetPasswordOtp: {
      type: String
    },
    resetPasswordOtpExpires: {
      type: Date
    },

    // ============================
    // Resend OTP Control (NEW)
    // ============================

    resetOtpLastSentAt: {
      type: Date,
    },

    resetOtpAttempts: {
      type: Number,
      default: 0,
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