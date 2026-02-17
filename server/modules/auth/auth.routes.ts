import { Router } from "express";
import { login, register, logout, resetPasswordController, verifyOtp, forgotPassword, resendResetOtpController } from "./auth.controller";
import { requireAuth } from "../../middleware/requireAuth";

const router = Router();

// Public routes - registration and login are open to everyone (no auth required) 

router.post("/register", register);
router.post("/login", login);


// Password reset routes - all public since user is not authenticated at this stage

router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyOtp);
router.post("/reset-password", resetPasswordController);
router.post("/resend-reset-otp", resendResetOtpController);

// 🔐 Logout must be authenticated
router.post("/logout", requireAuth, logout);

export default router;