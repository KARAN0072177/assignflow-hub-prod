export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

export interface RegisterPayload {
  email: string;
  username?: string;
  password: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username?: string | null;
  bio?: string;
  avatarKey?: string | null;
  avatarUrl?: string | null;
  role: UserRole;
  isVerified?: boolean;
  createdAt?: string;
}

export interface UpdateProfilePayload {
  bio?: string;
  username?: string;
  avatarKey?: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  user: UserProfile;
}