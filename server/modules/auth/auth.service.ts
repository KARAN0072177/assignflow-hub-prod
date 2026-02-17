import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, UserRole } from "../../models/user.model";
import { config } from "../../config";
import { logAuditEvent } from "../../utils/auditLogger";
import { generateVerificationToken } from "../../utils/generateVerificationToken";
import { sendMail } from "../../utils/mailer";
import crypto from "crypto";
import { generateOtp } from "../../utils/generateOtp";

const SALT_ROUNDS = 10;

/**
 * ============================
 * REGISTER USER
 * ============================
 */
export const registerUser = async (
  email: string,
  password: string,
  role: UserRole
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // 🔐 Generate email verification token
  const { token, hashedToken, expires } = generateVerificationToken();

  // Create user (NOT verified yet)
  const user = await User.create({
    email,
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
    html: `
      <h2>Verify Your Email</h2>
      <p>Thanks for registering on AssignFlow Hub.</p>

      <p>Click the button below to verify your account:</p>

      <a href="${verifyUrl}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#2563eb;
          color:white;
          text-decoration:none;
          border-radius:6px;
        ">
        Verify Email
      </a>

      <p>This link will expire in 1 hour.</p>
    `,
  });

  return {
    message: "Registration successful. Please verify your email.",
    user: {
      id: user._id,
      email: user.email,
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
    html: `
      <h2>Password Reset Request</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>Valid for 10 minutes.</p>
    `,
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
    subject: "Your New Password Reset OTP",
    html: `
      <h2>Password Reset</h2>
      <p>Your new OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP expires in 10 minutes.</p>
      <p>If you didn't request this, ignore this email.</p>
    `,
  });

  return { success: true };
};

/**
 * ============================
 * LOGIN USER
 * ============================
 */
export const loginUser = async (email: string, password: string) => {
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

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: "1d" }
  );

  await logAuditEvent({
    actorRole: "USER",
    actorId: user._id,
    action: "USER_LOGIN",
    entityType: "AUTH",
    entityId: user._id,
    metadata: {
      email: user.email,
    },
  });

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  };
};