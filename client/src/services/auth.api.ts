import { apiClient } from "./apiClient";
import type {
  RegisterPayload,
  LoginPayload,
  LoginResponse,
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

  // Trigger storage sync
  window.dispatchEvent(new Event("storage"));

  return data;
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
    window.dispatchEvent(new Event("storage"));
  }
};