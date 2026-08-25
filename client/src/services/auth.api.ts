import { apiClient } from "./apiClient";
import type {
  RegisterPayload,
  LoginPayload,
  LoginResponse,
  UserProfile,
} from "../types/auth.types";

export const registerUser = async (payload: RegisterPayload) => {
  const response = await apiClient.post("/api/auth/register", payload);
  return response.data;
};

export const loginUser = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(
    "/api/auth/login",
    payload
  );

  const data = response.data;

  // Persist access token and rotating refresh token
  if (data.token) {
    localStorage.setItem("authToken", data.token);
  }
  if (data.refreshToken) {
    localStorage.setItem("refreshToken", data.refreshToken);
  }
  if (data.user?.role) {
    localStorage.setItem("userRole", data.user.role);
  }
  if (data.user?.email) {
    localStorage.setItem("userEmail", data.user.email);
  }
  if (data.user?.username) {
    localStorage.setItem("username", data.user.username);
  } else {
    localStorage.removeItem("username");
  }

  // Trigger storage sync
  window.dispatchEvent(new Event("storage"));

  return data;
};

export const getMe = async (): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>("/api/auth/me");
  const user = response.data;
  if (user.username) {
    localStorage.setItem("username", user.username);
  } else {
    localStorage.removeItem("username");
  }
  if (user.role) {
    localStorage.setItem("userRole", user.role);
  }
  if (user.email) {
    localStorage.setItem("userEmail", user.email);
  }
  return user;
};

export const checkUsernameAvailability = async (
  username: string
): Promise<{ available: boolean; message: string }> => {
  const response = await apiClient.get<{ available: boolean; message: string }>(
    `/api/auth/check-username?username=${encodeURIComponent(username)}`
  );
  return response.data;
};

export const setUsername = async (
  username: string
): Promise<{ message: string; user: UserProfile }> => {
  const response = await apiClient.post<{ message: string; user: UserProfile }>(
    "/api/auth/set-username",
    { username }
  );
  if (response.data.user?.username) {
    localStorage.setItem("username", response.data.user.username);
    window.dispatchEvent(new Event("storage"));
  }
  return response.data;
};

export const logoutUser = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  try {
    await apiClient.post("/api/auth/logout", { refreshToken });
  } catch {
    // Ignore error on network disconnect during logout
  } finally {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("username");
    window.dispatchEvent(new Event("storage"));
  }
};