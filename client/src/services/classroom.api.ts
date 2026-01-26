import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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
  message: string;
  classroom: {
    classroomId: string;
    name: string;
  };
}

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