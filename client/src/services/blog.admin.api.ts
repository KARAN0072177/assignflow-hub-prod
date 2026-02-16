import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
});

// ---------------- ADMIN ----------------

export const fetchAllBlogs = async () => {
  const res = await axios.get(
    `${API_BASE_URL}/api/blogs/admin/all`,
    { headers: authHeader() }
  );
  return res.data;
};

export const createBlog = async (payload: any) => {
  const res = await axios.post(
    `${API_BASE_URL}/api/blogs`,
    payload,
    { headers: authHeader() }
  );
  return res.data;
};

export const updateBlog = async (id: string, payload: any) => {
  const res = await axios.put(
    `${API_BASE_URL}/api/blogs/${id}`,
    payload,
    { headers: authHeader() }
  );
  return res.data;
};

export const deleteBlog = async (id: string) => {
  const res = await axios.delete(
    `${API_BASE_URL}/api/blogs/${id}`,
    { headers: authHeader() }
  );
  return res.data;
};