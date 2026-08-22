import { Router } from "express";
import {
  login,
  register,
  logout,
  refreshTokenController,
  resetPasswordController,
  verifyOtp,
  forgotPassword,
  resendResetOtpController,
} from "./auth.controller";

const router = Router();

// Public auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshTokenController);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyOtp);
router.post("/reset-password", resetPasswordController);
router.post("/resend-reset-otp", resendResetOtpController);

// Session revocation / logout
router.post("/logout", logout);

export default router;