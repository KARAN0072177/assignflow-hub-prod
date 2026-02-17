import { Request, Response } from "express";
import { z } from "zod";
import { loginUser, registerUser, requestPasswordReset, resetPassword, verifyResetOtp } from "./auth.service";
import { UserRole } from "../../models/user.model";
import { logAuditEvent } from "../../utils/auditLogger";
import { AuthenticatedRequest } from "../../middleware/requireAuth";
import { Types } from "mongoose";
import { resendResetPasswordOtp } from "./auth.service";

import {
  isLoginBlocked,
  recordFailedLogin,
  resetLoginAttempts,
} from "../../utils/loginAttemptLimiter";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(UserRole),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const register = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const { email, password, role } = parsed.data;

  try {
    const result = await registerUser(email, password, role);

    // 🔍 Audit log (optional, but good)
    await logAuditEvent({
      actorRole: "USER",
      actorId: result.user.id,
      action: "USER_REGISTER",
      entityType: "AUTH",
      entityId: result.user.id,
      metadata: { email, role },
    });

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const { email, password } = parsed.data;

  // ✅ GET CLIENT IP
  const ip =
    req.ip ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    "unknown";

  // ✅ BLOCK IF TOO MANY FAILED ATTEMPTS
  if (isLoginBlocked(ip as string)) {
    return res.status(429).json({
      message: "Too many failed login attempts. Try again later.",
    });
  }

  try {
    const result = await loginUser(email, password);

    // ✅ RESET FAILED ATTEMPTS ON SUCCESS
    resetLoginAttempts(ip as string);

    // 🔍 Audit log
    await logAuditEvent({
      actorRole: "USER",
      actorId: result.user.id,
      action: "USER_LOGIN",
      entityType: "AUTH",
      entityId: result.user.id,
      metadata: { email },
    });

    res.status(200).json(result);
  } catch (error: any) {
    // ✅ RECORD FAILED ATTEMPT
    recordFailedLogin(ip as string);

    res.status(401).json({ message: error.message });
  }
};

// ============================
// PASSWORD RESET FLOW (REQUEST OTP, VERIFY OTP, RESET PASSWORD)
// ============================

export const forgotPassword = async (req: Request, res: Response) => {
  await requestPasswordReset(req.body.email);
  res.json({ message: "OTP sent to email" });
};

export const verifyOtp = async (req: Request, res: Response) => {
  await verifyResetOtp(req.body.email, req.body.otp);
  res.json({ message: "OTP verified" });
};

export const resetPasswordController = async (
  req: Request,
  res: Response
) => {
  await resetPassword(req.body.email, req.body.password);
  res.json({ message: "Password reset successful" });
};


// ============================
// Resend OTP Controller
// ============================

export const resendResetOtpController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    await resendResetPasswordOtp(email);

    res.json({ message: "OTP resent successfully" });
  } catch (err: any) {
    res.status(400).json({
      message: err.message || "Failed to resend OTP",
    });
  }
};

/**
 * Logout handler
 * - DOES NOT invalidate JWT
 * - ONLY logs audit event
 */
export const logout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    await logAuditEvent({
      actorRole: "USER",
      actorId: new Types.ObjectId(req.user!.userId),
      action: "USER_LOGOUT",
      entityType: "AUTH",
      entityId: new Types.ObjectId(req.user!.userId),
    });
  } catch (error) {
    // never block logout
    console.error("[Logout] Audit log failed", error);
  }

  return res.status(200).json({ message: "Logged out" });
};