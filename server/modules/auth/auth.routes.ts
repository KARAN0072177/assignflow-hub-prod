import { Router } from "express";
import { login, register, logout } from "./auth.controller";
import { requireAuth } from "../../middleware/requireAuth";
import { authRateLimiter } from "../../middleware/rateLimiter";

const router = Router();

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);

// 🔐 Logout must be authenticated
router.post("/logout", requireAuth, logout);

export default router;