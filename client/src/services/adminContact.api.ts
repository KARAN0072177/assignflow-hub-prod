import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

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
  token: string
): Promise<AdminContactMessage[]> => {
  const res = await axios.get(
    `${API_BASE_URL}/api/admin/contacts`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

/**
 * Mark a contact message as read (ADMIN only)
 * PATCH /api/admin/contacts/:id/read
 */
export const markMessageAsRead = async (
  token: string,
  messageId: string
): Promise<AdminContactMessage> => {
  const res = await axios.patch(
    `${API_BASE_URL}/api/admin/contacts/${messageId}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

/**
 * Mark multiple contact messages as read (ADMIN only)
 * POST /api/admin/contacts/bulk-read
 */
export const markMessagesAsReadBulk = async (
  token: string,
  messageIds: string[]
): Promise<{ success: boolean; count: number }> => {
  const res = await axios.post(
    `${API_BASE_URL}/api/admin/contacts/bulk-read`,
    { messageIds },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};