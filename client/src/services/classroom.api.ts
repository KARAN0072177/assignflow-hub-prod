import axios from "axios";


// Base URL for the API

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

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
  const token = localStorage.getItem("authToken");

  const response = await axios.post(
    `${API_BASE_URL}/api/classrooms`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

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
  const token = localStorage.getItem("authToken");

  const response = await axios.post(
    `${API_BASE_URL}/api/classrooms/join`,
    { code },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// Get all classrooms a student has joined

export interface ClassroomListItem {
  id: string;
  name: string;
  description?: string;
  code?: string;
  createdAt?: string;
  studentCount?: number;
}

export const getMyClassrooms = async (): Promise<ClassroomListItem[]> => {
  const token = localStorage.getItem("authToken");

  const response = await axios.get(
    `${API_BASE_URL}/api/classrooms/my`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

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
  const token = localStorage.getItem("authToken");

  const response = await axios.get(
    `${API_BASE_URL}/api/classrooms/${classroomId}/assignments`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
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
  const token = localStorage.getItem("authToken");

  const response = await axios.get(
    `${API_BASE_URL}/api/classrooms/teacher/students`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};