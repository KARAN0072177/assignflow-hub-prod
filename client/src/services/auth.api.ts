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
  if (user.avatarUrl) {
    localStorage.setItem("userAvatar", user.avatarUrl);
  } else {
    localStorage.removeItem("userAvatar");
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

export const updateProfile = async (
  payload: { bio?: string; username?: string; avatarKey?: string }
): Promise<{ message: string; user: UserProfile }> => {
  const response = await apiClient.patch<{ message: string; user: UserProfile }>(
    "/api/auth/profile",
    payload
  );
  const user = response.data.user;
  if (user.username) {
    localStorage.setItem("username", user.username);
  }
  if (user.avatarUrl) {
    localStorage.setItem("userAvatar", user.avatarUrl);
  }
  window.dispatchEvent(new Event("storage"));
  return response.data;
};

export const getAvatarPresignedUrl = async (
  fileName: string,
  fileType: string
): Promise<{ uploadUrl: string; fileKey: string }> => {
  const response = await apiClient.post<{ uploadUrl: string; fileKey: string }>(
    "/api/auth/avatar/presigned-url",
    { fileName, fileType }
  );
  return response.data;
};

export const uploadAvatarToS3 = async (
  uploadUrl: string,
  file: File
): Promise<void> => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload avatar to S3 (${response.statusText})`);
  }
};

export interface PublicProfileCard {
  id: string;
  username: string | null;
  email: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  bio?: string;
  avatarUrl?: string | null;
  joinedAt?: string;
}

const profileCardCache = new Map<string, { data: PublicProfileCard; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 5; // 5 minutes cache

export const getProfileCard = async (
  identifier: string
): Promise<PublicProfileCard> => {
  const clean = identifier.trim().toLowerCase().replace(/^@/, "");
  const cached = profileCardCache.get(clean);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const response = await apiClient.get<PublicProfileCard>(
    `/api/auth/profile-card/${encodeURIComponent(clean)}`
  );

  const data = response.data;
  profileCardCache.set(clean, { data, timestamp: Date.now() });
  if (data.username) {
    profileCardCache.set(data.username.toLowerCase(), { data, timestamp: Date.now() });
  }
  if (data.id) {
    profileCardCache.set(data.id, { data, timestamp: Date.now() });
  }

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
    localStorage.removeItem("userEmail");
    localStorage.removeItem("username");
    localStorage.removeItem("userAvatar");
    window.dispatchEvent(new Event("storage"));
  }
};