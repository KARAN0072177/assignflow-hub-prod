import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

/* =======================
   STUDENT TYPES & API
   ======================= */

export interface StudentGrade {
  score: number;
  feedback?: string;

  submittedAt: string;
  gradedAt: string;

  submissionDownloadUrl?: string;

  assignment: {
    id: string;
    title: string;
    description?: string;
  };
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
  feedback?: string,
  publishImmediately?: boolean
): Promise<any> => {
  const token = localStorage.getItem("authToken");

  const res = await axios.post(
    `${API_BASE_URL}/api/grades`,
    {
      submissionId,
      score,
      feedback,
      publishImmediately,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
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

/* =======================
   TEACHER ANALYTICS TYPES & API
   ======================= */

export interface StudentGradeHistoryItem {
  assignmentId: string;
  assignmentTitle: string;
  classroomName: string;
  score: number;
  feedback: string;
  published: boolean;
  gradedAt: string;
}

export interface StudentAnalyticsProfile {
  studentId: string;
  email: string;
  name: string;
  joinedAt: string;
  classrooms: { id: string; name: string; code: string }[];
  totalAssigned: number;
  totalSubmitted: number;
  totalGraded: number;
  averageScore: number | null;
  highestScore: number | null;
  lowestScore: number | null;
  letterGrade: string;
  performanceTier: "High Achiever" | "Good Standing" | "Needs Support" | "Not Graded";
  submissionRate: number;
  gradesHistory: StudentGradeHistoryItem[];
}

export interface GradeDistributionItem {
  tier: string;
  grade: string;
  count: number;
  percentage: number;
  color: string;
}

export interface TeacherAnalyticsData {
  students: StudentAnalyticsProfile[];
  summary: {
    totalUniqueStudents: number;
    totalEnrollments: number;
    totalClassrooms: number;
    totalAssignments: number;
    overallAverageScore: number | null;
    highAchieversCount: number;
    goodStandingCount: number;
    needsSupportCount: number;
    ungradedCount: number;
  };
  gradeDistribution: GradeDistributionItem[];
  classroomsSummary: {
    classroomId: string;
    classroomName: string;
    code: string;
    studentCount: number;
    averageScore: number | null;
  }[];
}

/**
 * Teacher: get global student performance analytics
 * GET /api/grades/teacher/analytics
 */
export const getTeacherStudentsAnalytics = async (): Promise<TeacherAnalyticsData> => {
  const token = localStorage.getItem("authToken");

  const res = await axios.get(`${API_BASE_URL}/api/grades/teacher/analytics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};