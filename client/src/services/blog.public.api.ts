import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const fetchPublishedBlogs = async () => {
  const res = await axios.get(
    `${API_BASE_URL}/api/blogs`
  );
  return res.data;
};

export const fetchBlogBySlug = async (slug: string) => {
  const res = await axios.get(
    `${API_BASE_URL}/api/blogs/${slug}`
  );
  return res.data;
};