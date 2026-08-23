import { apiClient } from "./apiClient";

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

export interface StudentAiInsight {
  hasData: boolean;
  advice: string;
  focusArea: string;
  sentiment: "EXCELLING" | "GOOD" | "NEEDS_IMPROVEMENT" | "NEEDS_ATTENTION";
  averageScore: number;
  gradesCount: number;
  lastGradeEvaluatedAt?: string | null;
  generatedAt: string;
  isCached: boolean;
}

/**
 * Student: get published grades
 * GET /api/grades/my
 */
export const getMyGrades = async (): Promise<StudentGrade[]> => {
  const res = await apiClient.get<StudentGrade[]>("/api/grades/my");
  return res.data;
};

/**
 * Student: get server-evaluated AI academic performance advisor insight
 * GET /api/grades/my/ai-insight
 */
export const getStudentAiInsight = async (): Promise<StudentAiInsight> => {
  const res = await apiClient.get<StudentAiInsight>("/api/grades/my/ai-insight");
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
  const res = await apiClient.post("/api/grades", {
    submissionId,
    score,
    feedback,
    publishImmediately,
  });
  return res.data;
};

/**
 * Teacher: publish grade
 * PATCH /api/grades/:id/publish
 */
export const publishGrade = async (gradeId: string): Promise<void> => {
  await apiClient.patch(`/api/grades/${gradeId}/publish`, {});
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
  performanceTier:
    | "High Achiever"
    | "Good Standing"
    | "Needs Support"
    | "Not Graded";
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
export const getTeacherStudentsAnalytics =
  async (): Promise<TeacherAnalyticsData> => {
    const res = await apiClient.get<TeacherAnalyticsData>(
      "/api/grades/teacher/analytics"
    );
    return res.data;
  };