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
  getMe,
  setUsernameController,
  checkUsernameController,
} from "./auth.controller";
import { requireAuth } from "../../middleware/requireAuth";

const router = Router();

// Public auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshTokenController);
router.get("/check-username", checkUsernameController);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyOtp);
router.post("/reset-password", resetPasswordController);
router.post("/resend-reset-otp", resendResetOtpController);

// Authenticated user routes
router.get("/me", requireAuth, getMe);
router.post("/set-username", requireAuth, setUsernameController);

// Session revocation / logout
router.post("/logout", logout);

export default router;