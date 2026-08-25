import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, UserRole } from "../../models/user.model";
import { config } from "../../config";
import { logAuditEvent } from "../../utils/auditLogger";
import { generateVerificationToken } from "../../utils/generateVerificationToken";
import { sendMail } from "../../utils/mailer";
import crypto from "crypto";
import { generateOtp } from "../../utils/generateOtp";
import {
  generateResetOtpEmailTemplate,
  generateVerificationEmailTemplate,
} from "./auth.mail";

const SALT_ROUNDS = 10;

/**
 * ============================
 * REGISTER USER
 * ============================
 */
export const registerUser = async (
  email: string,
  password: string,
  role: UserRole,
  username?: string
) => {
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new Error("User with this email already exists");
  }

  let cleanUsername: string | undefined = undefined;
  if (username && username.trim()) {
    cleanUsername = username.trim().toLowerCase();
    if (!/^[a-zA-Z0-9_.-]{3,30}$/.test(cleanUsername)) {
      throw new Error(
        "Username must be between 3 and 30 characters and contain only letters, numbers, underscores, hyphens, or dots."
      );
    }
    const existingUsername = await User.findOne({ username: cleanUsername });
    if (existingUsername) {
      throw new Error("Username is already taken. Please choose another one.");
    }
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // 🔐 Generate email verification token
  const { token, hashedToken, expires } = generateVerificationToken();

  // Create user (NOT verified yet)
  const user = await User.create({
    email,
    username: cleanUsername,
    password: hashedPassword,
    role,
    isVerified: false,
    emailVerificationToken: hashedToken,
    emailVerificationExpires: expires,
  });

  // 📧 Send verification email
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  await sendMail({
    to: email,
    subject: "Verify your AssignFlow Hub account",
    html: generateVerificationEmailTemplate({ email, verifyUrl }),
  });

  return {
    message: "Registration successful. Please verify your email.",
    user: {
      id: user._id,
      email: user.email,
      username: user.username || null,
      role: user.role,
    },
  };
};


// ============================
// REQUEST PASSWORD RESET (OTP FLOW )
// ============================

export const requestPasswordReset = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const otp = generateOtp();
  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  user.resetPasswordOtp = hashedOtp;
  user.resetPasswordOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  await user.save();

  await sendMail({
    to: email,
    subject: "Password Reset OTP - AssignFlow Hub",
    html: generateResetOtpEmailTemplate({ email, otp }),
  });
};

// ============================
// VERIFY RESET OTP
// ============================

export const verifyResetOtp = async (
  email: string,
  otp: string
) => {
  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  const user = await User.findOne({
    email,
    resetPasswordOtp: hashedOtp,
    resetPasswordOtpExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new Error("Invalid or expired OTP");
  }

  user.resetPasswordOtp = undefined;
  user.resetPasswordOtpExpires = undefined;
  await user.save();

  return true;
};


// ============================
// RESET PASSWORD AFTER OTP VERIFICATION
// ============================

export const resetPassword = async (
  email: string,
  newPassword: string
) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const user = await User.findOneAndUpdate(
    { email },
    {
      password: hashedPassword,
      resetPasswordOtp: undefined,
      resetPasswordOtpExpires: undefined,
    }
  );

  if (!user) {
    throw new Error("User not found");
  }
};


// ==============================
// RESEND RESET PASSWORD OTP
// ==============================

export const resendResetPasswordOtp = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user || !user.resetPasswordOtp) {
    throw new Error("Password reset not initiated");
  }

  const now = new Date();

  // ⏳ Cooldown: 60 seconds
  if (
    user.resetOtpLastSentAt &&
    now.getTime() - user.resetOtpLastSentAt.getTime() < 60 * 1000
  ) {
    throw new Error("Please wait before requesting another OTP");
  }

  // 🚫 Limit attempts
  if (user.resetOtpAttempts && user.resetOtpAttempts >= 5) {
    throw new Error("Too many OTP requests. Try again later.");
  }

  // ✅ Generate NEW OTP
  const otp = generateOtp();

  // ✅ Hash OTP (VERY IMPORTANT)
  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  // ✅ Override old OTP (this automatically invalidates previous one)
  user.resetPasswordOtp = hashedOtp;
  user.resetPasswordOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  user.resetOtpLastSentAt = now;
  user.resetOtpAttempts = (user.resetOtpAttempts || 0) + 1;

  await user.save();

  // 📧 Send email
  await sendMail({
    to: user.email,
    subject: "Your New Password Reset OTP - AssignFlow Hub",
    html: generateResetOtpEmailTemplate({
      email: user.email,
      otp,
      isResend: true,
    }),
  });

  return { success: true };
};

import { RefreshToken } from "../../models/refreshToken.model";
import { Types } from "mongoose";

const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * Generates an Access Token and a persistent rotating Refresh Token
 */
export const generateTokens = async (
  userId: string | Types.ObjectId,
  role: UserRole,
  familyId?: string,
  userAgent?: string,
  ipAddress?: string
) => {
  const accessToken = jwt.sign(
    {
      userId: userId.toString(),
      role,
    },
    config.jwtSecret,
    { expiresIn: "15m" }
  );

  const activeFamilyId = familyId || crypto.randomUUID();
  const rawRefreshToken = `${crypto.randomUUID()}.${crypto.randomUUID()}`;
  const tokenHash = hashToken(rawRefreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + config.refreshTokenExpiryDays);

  await RefreshToken.create({
    userId,
    tokenHash,
    familyId: activeFamilyId,
    expiresAt,
    userAgent,
    ipAddress,
  });

  return {
    accessToken,
    refreshToken: rawRefreshToken,
    expiresIn: 15 * 60, // 15 mins in seconds
  };
};

/**
 * ============================
 * LOGIN USER
 * ============================
 */
export const loginUser = async (
  email: string,
  password: string,
  userAgent?: string,
  ipAddress?: string
) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // 🚫 Block login if email not verified
  if (!user.isVerified) {
    throw new Error("Please verify your email before logging in");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const tokenData = await generateTokens(
    user._id,
    user.role,
    undefined,
    userAgent,
    ipAddress
  );

  await logAuditEvent({
    actorRole: "USER",
    actorId: user._id,
    action: "USER_LOGIN",
    entityType: "AUTH",
    entityId: user._id,
    metadata: {
      email: user.email,
      ipAddress,
      userAgent,
    },
  });

  return {
    token: tokenData.accessToken,
    refreshToken: tokenData.refreshToken,
    expiresIn: tokenData.expiresIn,
    user: {
      id: user._id,
      email: user.email,
      username: user.username || null,
      role: user.role,
    },
  };
};

/**
 * ============================
 * ROTATE REFRESH TOKEN
 * ============================
 */
export const rotateRefreshToken = async (
  rawRefreshToken: string,
  userAgent?: string,
  ipAddress?: string
) => {
  if (!rawRefreshToken) {
    throw new Error("Refresh token is required");
  }

  const tokenHash = hashToken(rawRefreshToken);
  const existingTokenDoc = await RefreshToken.findOne({ tokenHash });

  if (!existingTokenDoc) {
    throw new Error("Invalid refresh token");
  }

  // 🚨 Reuse Detection: If an already revoked token is used, someone is attempting to hijack the session!
  if (existingTokenDoc.isRevoked) {
    // Revoke all tokens in this family immediately!
    await RefreshToken.updateMany(
      { familyId: existingTokenDoc.familyId },
      { isRevoked: true }
    );
    throw new Error("Session hijacking detected. All sessions in this family have been terminated.");
  }

  // Check expiration (7 days)
  if (new Date() > existingTokenDoc.expiresAt) {
    existingTokenDoc.isRevoked = true;
    await existingTokenDoc.save();
    throw new Error("Session expired. Please log in again.");
  }

  // One-Time Use Rotation: Invalidate the current refresh token
  existingTokenDoc.isRevoked = true;
  await existingTokenDoc.save();

  // Find user to ensure active account
  const user = await User.findById(existingTokenDoc.userId);
  if (!user) {
    throw new Error("User no longer exists");
  }

  // Issue new token pair preserving the session familyId
  const newTokens = await generateTokens(
    user._id,
    user.role,
    existingTokenDoc.familyId,
    userAgent,
    ipAddress
  );

  return {
    token: newTokens.accessToken,
    refreshToken: newTokens.refreshToken,
    expiresIn: newTokens.expiresIn,
    user: {
      id: user._id,
      email: user.email,
      username: user.username || null,
      role: user.role,
    },
  };
};

/**
 * ============================
 * GET CURRENT USER PROFILE
 * ============================
 */
export const getCurrentUser = async (userId: string | Types.ObjectId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user._id,
    email: user.email,
    username: user.username || null,
    role: user.role,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };
};

/**
 * ============================
 * CHECK USERNAME AVAILABILITY
 * ============================
 */
export const checkUsernameAvailable = async (username: string) => {
  if (!username || !username.trim()) {
    return { available: false, message: "Username cannot be empty" };
  }

  const clean = username.trim().toLowerCase();
  if (clean.length < 3 || clean.length > 30) {
    return {
      available: false,
      message: "Username must be between 3 and 30 characters",
    };
  }

  if (!/^[a-zA-Z0-9_.-]+$/.test(clean)) {
    return {
      available: false,
      message: "Username can only contain letters, numbers, underscores, hyphens, and dots",
    };
  }

  const existing = await User.findOne({ username: clean });
  if (existing) {
    return { available: false, message: "Username is already taken" };
  }

  return { available: true, message: "Username is available!" };
};

/**
 * ============================
 * SET / UPDATE USERNAME
 * ============================
 */
export const setUsername = async (
  userId: string | Types.ObjectId,
  newUsername: string
) => {
  if (!newUsername || !newUsername.trim()) {
    throw new Error("Username cannot be empty");
  }

  const clean = newUsername.trim().toLowerCase();
  if (clean.length < 3 || clean.length > 30) {
    throw new Error("Username must be between 3 and 30 characters");
  }

  if (!/^[a-zA-Z0-9_.-]+$/.test(clean)) {
    throw new Error(
      "Username can only contain letters, numbers, underscores, hyphens, and dots"
    );
  }

  // Check if taken by another user
  const existing = await User.findOne({
    username: clean,
    _id: { $ne: new Types.ObjectId(userId) },
  });

  if (existing) {
    throw new Error("Username is already taken. Please pick another one.");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.username = clean;
  await user.save();

  await logAuditEvent({
    actorRole: "USER",
    actorId: user._id,
    action: "USER_UPDATE",
    entityType: "AUTH",
    entityId: user._id,
    metadata: { username: clean },
  });

  return {
    id: user._id,
    email: user.email,
    username: user.username,
    role: user.role,
    isVerified: user.isVerified,
  };
};

/**
 * ============================
 * LOGOUT USER
 * ============================
 */
export const logoutUser = async (
  rawRefreshToken?: string,
  userId?: string
) => {
  if (rawRefreshToken) {
    const tokenHash = hashToken(rawRefreshToken);
    await RefreshToken.findOneAndUpdate({ tokenHash }, { isRevoked: true });
  } else if (userId) {
    await RefreshToken.updateMany({ userId }, { isRevoked: true });
  }
  return { success: true, message: "Logged out successfully" };
};