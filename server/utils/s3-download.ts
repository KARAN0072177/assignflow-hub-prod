import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../config/aws";

export const generateDownloadUrl = async (fileKey: string) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: fileKey,
  });

  return getSignedUrl(s3Client, command, {
    expiresIn: 60 * 5, // 5 minutes
  });
};