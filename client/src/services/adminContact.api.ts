import { apiClient } from "./apiClient";

export interface AdminContactMessage {
  isRead: boolean;
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}

/**
 * Fetch admin contact inbox (ADMIN only)
 * GET /api/admin/contacts
 */
export const getAdminContacts = async (
  _token?: string
): Promise<AdminContactMessage[]> => {
  const res = await apiClient.get<AdminContactMessage[]>("/api/admin/contacts");
  return res.data;
};

/**
 * Mark a contact message as read (ADMIN only)
 * PATCH /api/admin/contacts/:id/read
 */
export const markMessageAsRead = async (
  _token: string,
  messageId: string
): Promise<AdminContactMessage> => {
  const res = await apiClient.patch<AdminContactMessage>(
    `/api/admin/contacts/${messageId}/read`,
    {}
  );
  return res.data;
};

/**
 * Mark multiple contact messages as read (ADMIN only)
 * POST /api/admin/contacts/bulk-read
 */
export const markMessagesAsReadBulk = async (
  _token: string,
  messageIds: string[]
): Promise<{ success: boolean; count: number }> => {
  const res = await apiClient.post<{ success: boolean; count: number }>(
    "/api/admin/contacts/bulk-read",
    { messageIds }
  );
  return res.data;
};