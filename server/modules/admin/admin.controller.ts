import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/requireAuth";
import { AuditLog } from "../../models/auditLog.model";

export const getAuditLogs = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  // TEMP: allow TEACHER for now, later restrict to ADMIN
  if (req.user?.role !== "ADMIN" && req.user?.role !== "TEACHER") {
    return res.status(403).json({ message: "Access denied" });
  }

  const logs = await AuditLog.find()
    .sort({ createdAt: -1 })
    .limit(100);

  res.status(200).json(logs);
};