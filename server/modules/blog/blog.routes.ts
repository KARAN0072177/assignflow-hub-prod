import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { requireAdmin } from "../../middleware/requireAdmin";

import {
  createBlogController,
  updateBlogController,
  deleteBlogController,
  getAllBlogsAdminController,
  getPublishedBlogsController,
  getBlogBySlugController,
} from "./blog.controller";

const router = Router();

// -------- PUBLIC --------
router.get("/", getPublishedBlogsController);
router.get("/:slug", getBlogBySlugController);

// -------- ADMIN --------
router.use(requireAuth, requireAdmin);

router.post("/", createBlogController);
router.put("/:id", updateBlogController);
router.delete("/:id", deleteBlogController);
router.get("/admin/all", getAllBlogsAdminController);

export default router;