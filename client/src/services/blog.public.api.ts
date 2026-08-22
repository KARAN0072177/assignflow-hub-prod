import { apiClient } from "./apiClient";

export const fetchPublishedBlogs = async () => {
  const res = await apiClient.get("/api/blogs");
  return res.data;
};

export const fetchBlogBySlug = async (slug: string) => {
  const res = await apiClient.get(`/api/blogs/${slug}`);
  return res.data;
};