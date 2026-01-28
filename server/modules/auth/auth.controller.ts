import { Request, Response } from "express";
import { z } from "zod";
import { loginUser, registerUser } from "./auth.service";
import { UserRole } from "../../models/user.model";
import { logAuditEvent } from "../../utils/auditLogger";
import { AuthenticatedRequest } from "../../middleware/requireAuth";
import { Types } from "mongoose";

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
    const user = await registerUser(email, password, role);

    // 🔍 Audit log (optional, but good)
    await logAuditEvent({
      actorRole: "USER",
      actorId: user.id,
      action: "USER_REGISTER",
      entityType: "AUTH",
      entityId: user.id,
      metadata: { email, role },
    });

    res.status(201).json(user);
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

  try {
    const result = await loginUser(email, password);

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
    res.status(401).json({ message: error.message });
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