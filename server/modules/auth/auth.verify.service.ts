import crypto from "crypto";
import { User } from "../../models/user.model";

export const verifyEmailToken = async (token: string) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

    console.log("Hashed token:", hashedToken);

  // First try to find by token
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
  });

  console.log("User found:", user ? "YES" : "NO");

  if (!user) {
    throw new Error("Invalid or expired verification link");
  }

  console.log("User isVerified:", user.isVerified);

  // If already verified, don't error
  if (user.isVerified) {
    return {
      message: "Email already verified",
    };
  }

  // Check expiry
  if (!user.emailVerificationExpires || user.emailVerificationExpires < new Date()) {
    throw new Error("Verification link expired");
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  await user.save();

  return {
    message: "Email verified successfully",
  };
};