import axios from "axios";
import { apiClient } from "./apiClient";

export interface DraftSubmissionResponse {
  submissionId: string;
  uploadUrl: string;
  fileKey: string;
}

const getFileEnum = (fileName: string): "PDF" | "DOCX" | "XLSX" | "PPTX" => {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".docx")) return "DOCX";
  if (lower.endsWith(".xlsx")) return "XLSX";
  if (lower.endsWith(".pptx")) return "PPTX";
  return "PDF";
};

export const createOrUpdateDraftSubmission = async (
  assignmentId: string,
  file: File
): Promise<DraftSubmissionResponse> => {
  const res = await apiClient.post<DraftSubmissionResponse>(
    "/api/submissions/draft",
    {
      assignmentId,
      originalFileName: file.name,
      fileType: getFileEnum(file.name),
      fileSize: file.size,
    }
  );

  // Upload file directly to S3 with presigned URL
  await axios.put(res.data.uploadUrl, file, {
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
  });

  return res.data;
};

export const submitSubmission = async (submissionId: string) => {
  await apiClient.patch(`/api/submissions/${submissionId}/submit`, {});
};

export interface TeacherSubmission {
  id: string;
  student: {
    id: string;
    email: string;
  };
  state: "DRAFT" | "SUBMITTED" | "LOCKED";
  submittedAt: string;
  downloadUrl?: string | null;
}

export const getSubmissionsForAssignment = async (
  assignmentId: string
): Promise<TeacherSubmission[]> => {
  const res = await apiClient.get<TeacherSubmission[]>(
    `/api/submissions/assignment/${assignmentId}`
  );
  return res.data;
};