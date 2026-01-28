import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export interface AuditLog {
  _id: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export const getAuditLogs = async (): Promise<AuditLog[]> => {
  const token = localStorage.getItem("authToken");

  const res = await axios.get(`${API_BASE_URL}/api/admin/audit-logs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};