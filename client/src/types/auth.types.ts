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
  role: UserRole;
  isVerified?: boolean;
  createdAt?: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  user: UserProfile;
}