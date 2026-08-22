import { apiClient } from "./apiClient";

export interface CreateClassroomPayload {
  name: string;
  description?: string;
}

export interface CreateClassroomResponse {
  id: string;
  name: string;
  code: string;
  status: string;
}

// Create a new classroom by a teacher
export const createClassroom = async (
  payload: CreateClassroomPayload
): Promise<CreateClassroomResponse> => {
  const response = await apiClient.post("/api/classrooms", payload);
  return response.data;
};

export interface JoinClassroomResponse {
  name: undefined;
  id: string | undefined;
  message: string;
  classroom: {
    classroomId: string;
    name: string;
  };
}

// Student joins a classroom using join code
export const joinClassroom = async (
  code: string
): Promise<JoinClassroomResponse> => {
  const response = await apiClient.post("/api/classrooms/join", { code });
  return response.data;
};

// Get all classrooms a student/teacher has
export interface ClassroomListItem {
  id: string;
  name: string;
  description?: string;
  code?: string;
  createdAt?: string;
  studentCount?: number;
}

export const getMyClassrooms = async (): Promise<ClassroomListItem[]> => {
  const response = await apiClient.get("/api/classrooms/my");
  return response.data;
};

// Get assignments for a specific classroom
export interface AssignmentListItem {
  id: string;
  title: string;
  description?: string;
  type: "GRADED" | "MATERIAL";
  state: "DRAFT" | "PUBLISHED";
  dueDate?: string;
}

export const getAssignmentsForClassroom = async (
  classroomId: string
): Promise<AssignmentListItem[]> => {
  const response = await apiClient.get(
    `/api/classrooms/${classroomId}/assignments`
  );
  return response.data;
};

// Teacher roster & student tracking
export interface ClassroomStudentItem {
  id: string;
  email: string;
  joinedAt: string;
}

export interface TeacherClassroomWithStudents {
  id: string;
  name: string;
  description?: string;
  code: string;
  createdAt: string;
  studentCount: number;
  students: ClassroomStudentItem[];
}

export const getTeacherClassroomStudents = async (): Promise<
  TeacherClassroomWithStudents[]
> => {
  const response = await apiClient.get("/api/classrooms/teacher/students");
  return response.data;
};