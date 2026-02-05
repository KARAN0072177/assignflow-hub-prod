import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

export interface DraftSubmissionResponse {
  submissionId: string;
  uploadUrl: string;
  fileKey: string;
}

export const createOrUpdateDraftSubmission = async (
  assignmentId: string,
  file: File
): Promise<DraftSubmissionResponse> => {
  const token = localStorage.getItem("authToken");

  const res = await axios.post(
    `${API_BASE_URL}/api/submissions/draft`,
    {
      assignmentId,
      originalFileName: file.name,
      fileType: file.name.endsWith(".pdf") ? "PDF" : "DOCX",
      fileSize: file.size,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // upload file to S3
  await axios.put(res.data.uploadUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });

  return res.data;
};

export const submitSubmission = async (submissionId: string) => {
  const token = localStorage.getItem("authToken");

  await axios.patch(
    `${API_BASE_URL}/api/submissions/${submissionId}/submit`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
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
  const token = localStorage.getItem("authToken");

  const res = await axios.get(
    `${API_BASE_URL}/api/submissions/assignment/${assignmentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};