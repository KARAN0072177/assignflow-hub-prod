import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/* =======================
   STUDENT TYPES & API
   ======================= */

export interface StudentGrade {
  assignment: {
    id: string;
    title: string;
  };
  score: number;
  feedback?: string;
  gradedAt: string;
}

/**
 * Student: get published grades
 * GET /api/grades/my
 */
export const getMyGrades = async (): Promise<StudentGrade[]> => {
  const token = localStorage.getItem("authToken");

  const res = await axios.get(`${API_BASE_URL}/api/grades/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

/* =======================
   TEACHER TYPES & API
   ======================= */

/**
 * Teacher: save or update grade (draft)
 * POST /api/grades
 */
export const saveGrade = async (
  submissionId: string,
  score: number,
  feedback?: string
): Promise<void> => {
  const token = localStorage.getItem("authToken");

  await axios.post(
    `${API_BASE_URL}/api/grades`,
    {
      submissionId,
      score,
      feedback,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

/**
 * Teacher: publish grade
 * PATCH /api/grades/:id/publish
 */
export const publishGrade = async (gradeId: string): Promise<void> => {
  const token = localStorage.getItem("authToken");

  await axios.patch(
    `${API_BASE_URL}/api/grades/${gradeId}/publish`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};