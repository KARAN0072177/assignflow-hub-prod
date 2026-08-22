import { apiClient } from "./apiClient";

// ---------------- ADMIN ----------------

export const fetchAllBlogs = async () => {
  const res = await apiClient.get("/api/blogs/admin/all");
  return res.data;
};

export const createBlog = async (payload: any) => {
  const res = await apiClient.post("/api/blogs", payload);
  return res.data;
};

export const updateBlog = async (id: string, payload: any) => {
  const res = await apiClient.put(`/api/blogs/${id}`, payload);
  return res.data;
};

export const deleteBlog = async (id: string) => {
  const res = await apiClient.delete(`/api/blogs/${id}`);
  return res.data;
};