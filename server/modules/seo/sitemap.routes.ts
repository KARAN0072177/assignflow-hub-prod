import { Router } from "express";
import { generateSitemap } from "./sitemap.controller";

const router = Router();

// Public route
router.get("/sitemap.xml", generateSitemap);

export default router;