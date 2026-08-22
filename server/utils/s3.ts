// server/utils/s3.ts
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../config/aws";

interface GenerateUploadUrlParams {
  classroomId: string;
  assignmentId: string;
  originalFileName: string;
  fileType: "PDF" | "DOCX" | "XLSX" | "PPTX";
}

const getContentType = (fileType: "PDF" | "DOCX" | "XLSX" | "PPTX") => {
  switch (fileType) {
    case "PDF":
      return "application/pdf";
    case "DOCX":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "XLSX":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "PPTX":
      return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    default:
      throw new Error("Unsupported file type. Only PDF, DOCX, XLSX, and PPTX are allowed.");
  }
};

export const generateAssignmentUploadUrl = async ({
  classroomId,
  assignmentId,
  originalFileName,
  fileType,
}: GenerateUploadUrlParams) => {
  const fileKey = `assignments/${classroomId}/${assignmentId}/${originalFileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: fileKey,
    ContentType: getContentType(fileType),
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 60 * 5, // 5 minutes
  });

  return {
    uploadUrl,
    fileKey,
  };
};