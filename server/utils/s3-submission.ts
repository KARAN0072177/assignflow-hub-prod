import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../config/aws";

const getContentType = (fileType: "PDF" | "DOCX") => {
  if (fileType === "PDF") return "application/pdf";
  return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
};

export const generateSubmissionUploadUrl = async ({
  classroomId,
  assignmentId,
  studentId,
  originalFileName,
  fileType,
}: {
  classroomId: string;
  assignmentId: string;
  studentId: string;
  originalFileName: string;
  fileType: "PDF" | "DOCX";
}) => {
  const fileKey = `submissions/${classroomId}/${assignmentId}/${studentId}/${originalFileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: fileKey,
    ContentType: getContentType(fileType),
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 60 * 5,
  });

  return { uploadUrl, fileKey };
};