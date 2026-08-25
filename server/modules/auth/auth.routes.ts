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
  updateProfileHandler,
  getAvatarUploadUrlHandler,
  getProfileCardHandler,
} from "./auth.controller";
import { requireAuth } from "../../middleware/requireAuth";
import { authIpSecurityMiddleware } from "../../utils/authSecurityLimiter";

const router = Router();

// Apply IP Ban / Rate limiting guard across all auth routes
router.use(authIpSecurityMiddleware);

// Public auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshTokenController);
router.get("/check-username", checkUsernameController);
router.get("/profile-card/:identifier", getProfileCardHandler);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyOtp);
router.post("/reset-password", resetPasswordController);
router.post("/resend-reset-otp", resendResetOtpController);

// Authenticated user routes
router.get("/me", requireAuth, getMe);
router.post("/set-username", requireAuth, setUsernameController);
router.patch("/profile", requireAuth, updateProfileHandler);
router.post("/avatar/presigned-url", requireAuth, getAvatarUploadUrlHandler);

// Session revocation / logout
router.post("/logout", logout);

export default router;