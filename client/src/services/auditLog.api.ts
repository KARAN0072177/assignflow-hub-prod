import { apiClient } from "./apiClient";

export interface AuditLog {
  actorId: any;
  _id: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export const getAuditLogs = async (): Promise<AuditLog[]> => {
  const res = await apiClient.get<AuditLog[]>("/api/admin/audit-logs");
  return res.data;
};