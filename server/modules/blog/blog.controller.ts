import { Request, Response } from "express";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogsAdmin,
  getPublishedBlogs,
  getBlogBySlug,
} from "./blog.service";

// ---------------- ADMIN ----------------

export const createBlogController = async (
  req: Request,
  res: Response
) => {
  const blog = await createBlog(req.body);
  res.status(201).json(blog);
};

export const updateBlogController = async (
  req: Request,
  res: Response
) => {
  const blog = await updateBlog(req.params.id, req.body);
  res.json(blog);
};

export const deleteBlogController = async (
  req: Request,
  res: Response
) => {
  await deleteBlog(req.params.id);
  res.json({ message: "Blog deleted" });
};

export const getAllBlogsAdminController = async (
  _req: Request,
  res: Response
) => {
  const blogs = await getAllBlogsAdmin();
  res.json(blogs);
};

// ---------------- PUBLIC ----------------

export const getPublishedBlogsController = async (
  _req: Request,
  res: Response
) => {
  const blogs = await getPublishedBlogs();
  res.json(blogs);
};

export const getBlogBySlugController = async (
  req: Request,
  res: Response
) => {
  const blog = await getBlogBySlug(req.params.slug);

  if (!blog) {
    return res.status(404).json({
      message: "Blog not found",
    });
  }

  res.json(blog);
};