export type UserRole = "STUDENT" | "TEACHER";

export interface RegisterPayload {
  email: string;
  password: string;
  role: UserRole;
}