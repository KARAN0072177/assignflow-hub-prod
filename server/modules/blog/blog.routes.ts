import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { adminGuard } from "../../middleware/adminGuard";

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
router.use(requireAuth, adminGuard);

router.post("/", createBlogController);
router.put("/:id", updateBlogController);
router.delete("/:id", deleteBlogController);
router.get("/admin/all", getAllBlogsAdminController);

export default router;