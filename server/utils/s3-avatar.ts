// server/utils/s3-avatar.ts
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../config/aws";

interface GenerateAvatarUploadParams {
  userId: string;
  originalFileName: string;
  mimeType: string;
}

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
]);

export const generateAvatarUploadUrl = async ({
  userId,
  originalFileName,
  mimeType,
}: GenerateAvatarUploadParams) => {
  const normalizedMime = mimeType.toLowerCase().trim();

  if (!ALLOWED_MIME_TYPES.has(normalizedMime)) {
    throw new Error(
      "Invalid image format. Only PNG and JPG/JPEG images are allowed."
    );
  }

  // Sanitize filename and create unique key
  const cleanName = originalFileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "_")
    .replace(/_{2,}/g, "_");

  const timestamp = Date.now();
  const fileKey = `avatars/${userId}/${timestamp}-${cleanName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: fileKey,
    ContentType: normalizedMime,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 60 * 5, // 5 minutes validity
  });

  return {
    uploadUrl,
    fileKey,
  };
};
