import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export interface AdminContactMessage {
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