import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/requireAuth";
import { AuditLog } from "../../models/auditLog.model";

export const getAuditLogs = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access only" });
  }

  const logs = await AuditLog.find()
    .sort({ createdAt: -1 })
    .limit(100);

  res.status(200).json(logs);
};