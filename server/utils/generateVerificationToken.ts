import crypto from "crypto";

export const generateVerificationToken = () => {
  const token = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  return {
    token,        // raw (for email)
    hashedToken, // stored in DB
    expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
  };
};