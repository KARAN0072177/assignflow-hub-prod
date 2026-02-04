import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
});

export const fetchSubscribers = async (status: string) => {
  const res = await axios.get(
    `${API_BASE_URL}/api/admin/newsletter/subscribers?status=${status}`,
    { headers: getAuthHeaders() }
  );

  return res.data;
};

export const sendNewsletter = async (payload: {
  subject: string;
  content: string;
}) => {
  const res = await axios.post(
    `${API_BASE_URL}/api/admin/newsletter/send`,
    payload,
    { headers: getAuthHeaders() }
  );

  return res.data;
};