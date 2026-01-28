import { Router } from "express";
import { login, register, logout } from "./auth.controller";
import { requireAuth } from "../../middleware/requireAuth";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// 🔐 Logout must be authenticated
router.post("/logout", requireAuth, logout);

export default router;