import sanitizeHtml from "sanitize-html";
import slugify from "slugify";
import { Blog } from "../../models/blog.model";

// --------------------------------
// CREATE BLOG
// --------------------------------
export const createBlog = async (data: {
  title: string;
  excerpt: string;
  content: string;
  tags?: string[];
  coverImage?: string;
  status?: "draft" | "published";
}) => {
  const slug = slugify(data.title, { lower: true, strict: true });

  const cleanContent = sanitizeHtml(data.content, {
    allowedTags: sanitizeHtml.defaults.allowedTags,
    allowedAttributes: false,
  });

  return Blog.create({
    ...data,
    slug,
    content: cleanContent,
    publishedAt:
      data.status === "published" ? new Date() : undefined,
  });
};

// --------------------------------
// UPDATE BLOG
// --------------------------------
export const updateBlog = async (
  id: string,
  data: Partial<{
    title: string;
    excerpt: string;
    content: string;
    tags: string[];
    coverImage: string;
    status: "draft" | "published";
    slug: string;
    publishedAt: Date;
  }>
) => {
  if (data.content) {
    data.content = sanitizeHtml(data.content, {
      allowedTags: sanitizeHtml.defaults.allowedTags,
      allowedAttributes: false,
    });
  }

  if (data.title) {
    data["slug"] = slugify(data.title, {
      lower: true,
      strict: true,
    });
  }

  if (data.status === "published") {
    data["publishedAt"] = new Date();
  }

  return Blog.findByIdAndUpdate(id, data, {
    new: true,
  });
};

// --------------------------------
// DELETE BLOG
// --------------------------------
export const deleteBlog = async (id: string) => {
  return Blog.findByIdAndDelete(id);
};

// --------------------------------
// ADMIN LIST (ALL)
// --------------------------------
export const getAllBlogsAdmin = async () => {
  return Blog.find().sort({ createdAt: -1 });
};

// --------------------------------
// PUBLIC LIST (PUBLISHED ONLY)
// --------------------------------
export const getPublishedBlogs = async () => {
  return Blog.find({ status: "published" }).sort({
    publishedAt: -1,
  });
};

// --------------------------------
// GET BY SLUG (PUBLIC)
// --------------------------------
export const getBlogBySlug = async (slug: string) => {
  return Blog.findOne({
    slug,
    status: "published",
  });
};