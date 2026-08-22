import { Request, Response } from "express";
import { z } from "zod";
import {
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
  verifyResetOtp,
  rotateRefreshToken,
  logoutUser,
} from "./auth.service";
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

  const userAgent = req.headers["user-agent"];

  // ✅ BLOCK IF TOO MANY FAILED ATTEMPTS
  if (isLoginBlocked(ip as string)) {
    return res.status(429).json({
      message: "Too many failed login attempts. Try again later.",
    });
  }

  try {
    const result = await loginUser(email, password, userAgent, ip as string);

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

/**
 * ============================
 * REFRESH TOKEN CONTROLLER
 * ============================
 */
export const refreshTokenController = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  const ip = (req.ip || req.headers["x-forwarded-for"] || "unknown") as string;
  const userAgent = req.headers["user-agent"];

  try {
    const result = await rotateRefreshToken(refreshToken, userAgent, ip);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(401).json({
      message: error.message || "Invalid or expired session. Please log in again.",
    });
  }
};

// ============================
// PASSWORD RESET FLOW (REQUEST OTP, VERIFY OTP, RESET PASSWORD)
// ============================

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    await requestPasswordReset(email);
    res.json({ message: "OTP sent to email" });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Failed to process forgot password request" });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    await verifyResetOtp(email, otp);
    res.json({ message: "OTP verified" });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Invalid or expired OTP" });
  }
};

export const resetPasswordController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    await resetPassword(email, password);
    res.json({ message: "Password reset successful" });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Failed to reset password" });
  }
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
 * - Revokes refresh token in database
 * - Logs audit event
 */
export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const authReq = req as AuthenticatedRequest;

  try {
    await logoutUser(refreshToken, authReq.user?.userId);

    if (authReq.user?.userId) {
      await logAuditEvent({
        actorRole: "USER",
        actorId: new Types.ObjectId(authReq.user.userId),
        action: "USER_LOGOUT",
        entityType: "AUTH",
        entityId: new Types.ObjectId(authReq.user.userId),
      });
    }
  } catch (error) {
    // never block logout response
    console.error("[Logout] Cleanup/audit error:", error);
  }

  return res.status(200).json({ message: "Logged out successfully" });
};