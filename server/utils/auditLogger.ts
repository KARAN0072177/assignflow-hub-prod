import { Types } from "mongoose";
import { AuditLog, AuditActorRole, AuditEntityType } from "../models/auditLog.model";

interface AuditLogParams {
  actorRole: AuditActorRole;
  actorId?: Types.ObjectId;

  action: string;

  entityType: AuditEntityType;
  entityId?: Types.ObjectId;

  metadata?: Record<string, any>;
}

/**
 * Central audit logger utility.
 * 
 * - Fire-and-forget
 * - Never throws
 * - Safe to call from API & worker
 */
export const logAuditEvent = async ({
  actorRole,
  actorId,
  action,
  entityType,
  entityId,
  metadata,
}: AuditLogParams): Promise<void> => {
  try {
    await AuditLog.create({
      actorRole,
      actorId,
      action,
      entityType,
      entityId,
      metadata,
    });
  } catch (error) {
    // Audit logging must NEVER crash the app
    console.error("[AuditLog] Failed to write audit log:", {
      actorRole,
      action,
      entityType,
      entityId,
      error,
    });
  }
};